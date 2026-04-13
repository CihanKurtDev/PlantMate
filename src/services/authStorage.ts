"use client";

import type { AuthSession, AuthUser } from "@/types/auth";

export const AUTH_USERS_KEY = "auth.users";
export const AUTH_SESSION_KEY = "auth.session";
export const AUTH_PERSISTENT_SESSION_KEY = AUTH_SESSION_KEY;
export const AUTH_TRANSIENT_SESSION_KEY = "auth.session.temp";
export const AUTH_CHANGED_EVENT = "auth:changed";

const notifyAuthChanged = () => {
    if (typeof window === "undefined") return;
    window.dispatchEvent(new Event(AUTH_CHANGED_EVENT));
};

const createId = () => {
    if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
        return crypto.randomUUID();
    }
    return `${Date.now()}-${Math.random().toString(16).slice(2)}`;
};

interface StoredUser extends AuthUser {
    password: string;
}

const toPublicUser = (user: StoredUser): AuthUser => ({
    id: user.id,
    email: user.email,
    name: user.name,
    createdAt: user.createdAt,
});

const safeParse = <T>(raw: string | null, fallback: T): T => {
    if (!raw) return fallback;
    try {
        return JSON.parse(raw) as T;
    } catch {
        return fallback;
    }
};

const readUsers = (): StoredUser[] => {
    const users = safeParse<StoredUser[]>(localStorage.getItem(AUTH_USERS_KEY), []);
    if (users.length > 0) return users;

    const seedUser: StoredUser = {
        id: createId(),
        email: "test@test.de",
        name: "Test User",
        password: "1234",
        createdAt: Date.now(),
    };
    localStorage.setItem(AUTH_USERS_KEY, JSON.stringify([seedUser]));
    return [seedUser];
};

const writeUsers = (users: StoredUser[]) => {
    localStorage.setItem(AUTH_USERS_KEY, JSON.stringify(users));
    notifyAuthChanged();
};

export const readSession = (): AuthSession | null =>
    safeParse<AuthSession | null>(localStorage.getItem(AUTH_PERSISTENT_SESSION_KEY), null) ??
    safeParse<AuthSession | null>(sessionStorage.getItem(AUTH_TRANSIENT_SESSION_KEY), null);

export const writeSession = (session: AuthSession, persist = true) => {
    if (persist) {
        localStorage.setItem(AUTH_PERSISTENT_SESSION_KEY, JSON.stringify(session));
        sessionStorage.removeItem(AUTH_TRANSIENT_SESSION_KEY);
    } else {
        sessionStorage.setItem(AUTH_TRANSIENT_SESSION_KEY, JSON.stringify(session));
        localStorage.removeItem(AUTH_PERSISTENT_SESSION_KEY);
    }
    notifyAuthChanged();
};

export const clearSession = () => {
    localStorage.removeItem(AUTH_PERSISTENT_SESSION_KEY);
    sessionStorage.removeItem(AUTH_TRANSIENT_SESSION_KEY);
    notifyAuthChanged();
};

export const getCurrentUser = (): AuthUser | null => {
    const session = readSession();
    if (!session) return null;
    const users = readUsers();
    const user = users.find((entry) => entry.id === session.userId);
    if (!user) {
        clearSession();
        return null;
    }
    return toPublicUser(user);
};

export const loginUser = (
    email: string,
    password: string,
    rememberMe = false
): { user?: AuthUser; error?: string } => {
    const users = readUsers();
    const user = users.find((entry) => entry.email.toLowerCase() === email.toLowerCase());

    if (!user || user.password !== password) {
        return { error: "Ungültige Zugangsdaten" };
    }

    const publicUser = toPublicUser(user);
    writeSession({ userId: user.id, createdAt: Date.now() }, rememberMe);
    return { user: publicUser };
};

export const registerUser = (
    name: string,
    email: string,
    password: string
): { user?: AuthUser; error?: string } => {
    const users = readUsers();
    const emailExists = users.some((entry) => entry.email.toLowerCase() === email.toLowerCase());

    if (emailExists) {
        return { error: "Diese Email ist bereits registriert" };
    }

    const newUser: StoredUser = {
        id: createId(),
        name: name.trim(),
        email: email.trim().toLowerCase(),
        password,
        createdAt: Date.now(),
    };

    writeUsers([...users, newUser]);
    writeSession({ userId: newUser.id, createdAt: Date.now() });

    const publicUser = toPublicUser(newUser);
    return { user: publicUser };
};
