"use client";

import { createContext, useCallback, useContext, useMemo, useSyncExternalStore, type ReactNode } from "react";
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
    login: (data: LoginFormData) => Promise<{ success: boolean; error?: string }>;
    register: (data: RegisterFormData) => Promise<{ success: boolean; error?: string }>;
    logout: () => void;
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

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const authSnapshot = useSyncExternalStore(subscribeToAuth, getClientSnapshot, getServerSnapshot);

    const { user, status } = useMemo(() => {
        if (authSnapshot === SERVER_SNAPSHOT) {
            return { user: null, status: "loading" as AuthStatus };
        }

        const user = getCurrentUser();
        return user
            ? { user, status: "authenticated" as AuthStatus }
            : { user: null, status: "unauthenticated" as AuthStatus };
    }, [authSnapshot]);

    const login = useCallback(async (data: LoginFormData) => {
        const result = loginUser(data.email, data.password, Boolean(data.rememberMe));
        if (!result.user) {
            return { success: false, error: result.error ?? "Login fehlgeschlagen" };
        }

        return { success: true };
    }, []);

    const register = useCallback(async (data: RegisterFormData) => {
        const result = registerUser(data.name, data.email, data.password);
        if (!result.user) {
            return { success: false, error: result.error ?? "Registrierung fehlgeschlagen" };
        }

        return { success: true };
    }, []);

    const logout = useCallback(() => {
        clearSession();
    }, []);

    const value = useMemo(
        () => ({
            user,
            status,
            isAuthenticated: status === "authenticated",
            login,
            register,
            logout,
        }),
        [login, logout, register, status, user]
    );

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
    const ctx = useContext(AuthContext);
    if (!ctx) throw new Error("useAuth must be used within AuthProvider");
    return ctx;
};
