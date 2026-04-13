"use client";

import { createContext, useCallback, useContext, useMemo, useState, useSyncExternalStore, type ReactNode } from "react";
import type { AuthUser, LoginFormData, RegisterFormData } from "@/types/auth";
import {
    AUTH_CHANGED_EVENT,
    AUTH_SESSION_KEY,
    AUTH_TRANSIENT_SESSION_KEY,
    AUTH_USERS_KEY,
    clearSession,
    getCurrentUser,
    loginUser,
    registerUser,
} from "@/services/authStorage";

type AuthStatus = "loading" | "authenticated" | "unauthenticated";

interface AuthContextType {
    user: AuthUser | null;
    status: AuthStatus;
    isAuthenticated: boolean;
    isDemoSession: boolean;
    login: (data: LoginFormData) => Promise<{ success: boolean; error?: string }>;
    register: (data: RegisterFormData) => Promise<{ success: boolean; error?: string }>;
    logout: () => void;
    startDemoSession: () => void;
    endDemoSession: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const SERVER_SNAPSHOT = "__AUTH_SERVER__";

const subscribeToAuth = (callback: () => void) => {
    const handleStorage = (event: StorageEvent) => {
        if (
            event.key === AUTH_SESSION_KEY ||
            event.key === AUTH_TRANSIENT_SESSION_KEY ||
            event.key === AUTH_USERS_KEY
        ) {
            callback();
        }
    };

    window.addEventListener("storage", handleStorage);
    window.addEventListener(AUTH_CHANGED_EVENT, callback);

    return () => {
        window.removeEventListener("storage", handleStorage);
        window.removeEventListener(AUTH_CHANGED_EVENT, callback);
    };
};

const getClientSnapshot = () =>
    JSON.stringify([
        localStorage.getItem(AUTH_SESSION_KEY),
        sessionStorage.getItem(AUTH_TRANSIENT_SESSION_KEY),
        localStorage.getItem(AUTH_USERS_KEY),
    ]);

const getServerSnapshot = () => SERVER_SNAPSHOT;

const DEMO_USER: AuthUser = {
    id: "demo-user",
    email: "demo@plantmate.local",
    name: "Demo User",
    createdAt: 0,
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const authSnapshot = useSyncExternalStore(subscribeToAuth, getClientSnapshot, getServerSnapshot);
    const [isDemoSession, setIsDemoSession] = useState(false);

    const { storageUser, storageStatus } = useMemo(() => {
        if (authSnapshot === SERVER_SNAPSHOT) {
            return { storageUser: null, storageStatus: "loading" as AuthStatus };
        }

        const user = getCurrentUser();
        return user
            ? { storageUser: user, storageStatus: "authenticated" as AuthStatus }
            : { storageUser: null, storageStatus: "unauthenticated" as AuthStatus };
    }, [authSnapshot]);

    const user = isDemoSession ? DEMO_USER : storageUser;
    const status = isDemoSession ? "authenticated" : storageStatus;
    const isAuthenticated = isDemoSession || status === "authenticated";

    const login = useCallback(async (data: LoginFormData) => {
        setIsDemoSession(false);
        const result = loginUser(data.email, data.password, Boolean(data.rememberMe));
        if (!result.user) {
            return { success: false, error: result.error ?? "Login fehlgeschlagen" };
        }

        return { success: true };
    }, []);

    const register = useCallback(async (data: RegisterFormData) => {
        setIsDemoSession(false);
        const result = registerUser(data.name, data.email, data.password);
        if (!result.user) {
            return { success: false, error: result.error ?? "Registrierung fehlgeschlagen" };
        }

        return { success: true };
    }, []);

    const logout = useCallback(() => {
        setIsDemoSession(false);
        clearSession();
    }, []);

    const startDemoSession = useCallback(() => {
        setIsDemoSession(true);
    }, []);

    const endDemoSession = useCallback(() => {
        setIsDemoSession(false);
    }, []);

    const value = useMemo(
        () => ({
            user,
            status,
            isAuthenticated,
            isDemoSession,
            login,
            register,
            logout,
            startDemoSession,
            endDemoSession,
        }),
        [endDemoSession, isAuthenticated, isDemoSession, login, logout, register, startDemoSession, status, user]
    );

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
    const ctx = useContext(AuthContext);
    if (!ctx) throw new Error("useAuth must be used within AuthProvider");
    return ctx;
};
