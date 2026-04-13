"use client";

import { createContext, useContext, ReactNode, useCallback, useMemo } from "react";
import type {
    EnvironmentData,
    EnvironmentData_Historical,
    EnvironmentEvent,
} from "@/types/environment";
import { useLocalStorageState } from "@/hooks/useLocalStorage";
import { useAuth } from "@/context/AuthContext";

interface EnvironmentContextType {
    environments: EnvironmentData[];
    addEnvironment: (env: EnvironmentData) => void;
    updateEnvironment: (env: EnvironmentData) => void;
    deleteEnvironments: (ids: string[]) => void;
    addEventToEnvironment: (environmentId: string, event: EnvironmentEvent) => void;
    removeEventFromEnvironment: (environmentId: string, eventId: string) => void;
    addHistoryData: (environmentId: string, entry: EnvironmentData_Historical) => void;
    removeHistoryData: (environmentId: string, entryId: string) => void;
    updateHistoryData: (environmentId: string, entry: EnvironmentData_Historical) => void;
}

const EnvironmentContext = createContext<EnvironmentContextType | undefined>(undefined);

export const EnvironmentProvider = ({ children }: { children: ReactNode }) => {
    const [storedEnvironments, setEnvironments] =
        useLocalStorageState<EnvironmentData[]>("environments", []);
    const { user } = useAuth();
    const currentUserId = user?.id;

    const environments = useMemo(
        () =>
            currentUserId
                ? storedEnvironments.filter((env) => env.ownerUserId === currentUserId)
                : [],
        [currentUserId, storedEnvironments]
    );

    const addEnvironment = useCallback((env: EnvironmentData) => {
        if (!currentUserId) return;
        setEnvironments((prev) => [...prev, { ...env, ownerUserId: currentUserId }]);
    }, [currentUserId, setEnvironments]);

    const updateEnvironment = useCallback((env: EnvironmentData) => {
        if (!currentUserId) return;
        setEnvironments((prev) =>
            prev.map((e) =>
                e.id === env.id && e.ownerUserId === currentUserId
                    ? { ...env, ownerUserId: currentUserId }
                    : e
            )
        );
    }, [currentUserId, setEnvironments]);

    const deleteEnvironments = useCallback((ids: string[]) => {
        if (!currentUserId) return;
        setEnvironments((prev) =>
            prev.filter((env) => !(env.ownerUserId === currentUserId && ids.includes(env.id)))
        );
    }, [currentUserId, setEnvironments]);

    const addEventToEnvironment = useCallback((environmentId: string, event: EnvironmentEvent) => {
        if (!currentUserId) return;
        setEnvironments((prev) =>
            prev.map((env) =>
                env.id === environmentId && env.ownerUserId === currentUserId
                    ? { ...env, events: [...(env.events ?? []), event] }
                    : env
            )
        );
    }, [currentUserId, setEnvironments]);

    const removeEventFromEnvironment = useCallback((environmentId: string, eventId: string) => {
        if (!currentUserId) return;
        setEnvironments((prev) =>
            prev.map((env) =>
                env.id === environmentId && env.ownerUserId === currentUserId
                    ? {
                          ...env,
                          events: (env.events ?? []).filter((event) => event.id !== eventId),
                      }
                    : env
            )
        );
    }, [currentUserId, setEnvironments]);

    const addHistoryData = useCallback((environmentId: string, entry: EnvironmentData_Historical) => {
        if (!currentUserId) return;
        setEnvironments((prev) =>
            prev.map((env) =>
                env.id === environmentId && env.ownerUserId === currentUserId
                    ? { ...env, historical: [...(env.historical ?? []), entry] }
                    : env
            )
        );
    }, [currentUserId, setEnvironments]);

    const removeHistoryData = useCallback((environmentId: string, entryId: string) => {
        if (!currentUserId) return;
        setEnvironments((prev) =>
            prev.map((env) =>
                env.id === environmentId && env.ownerUserId === currentUserId
                    ? {
                          ...env,
                          historical: (env.historical ?? []).filter((entry) => entry.id !== entryId),
                      }
                    : env
            )
        );
    }, [currentUserId, setEnvironments]);

    const updateHistoryData = useCallback((environmentId: string, entry: EnvironmentData_Historical) => {
        if (!currentUserId) return;
        setEnvironments((prev) =>
            prev.map((env) =>
                env.id === environmentId && env.ownerUserId === currentUserId
                    ? {
                          ...env,
                          historical: (env.historical ?? []).map((h) =>
                              h.id === entry.id ? entry : h
                          ),
                      }
                    : env
            )
        );
    }, [currentUserId, setEnvironments]);

    const value = useMemo(
        () => ({
            environments,
            addEnvironment,
            updateEnvironment,
            deleteEnvironments,
            addEventToEnvironment,
            removeEventFromEnvironment,
            addHistoryData,
            removeHistoryData,
            updateHistoryData,
        }),
        [
            environments,
            addEnvironment,
            updateEnvironment,
            deleteEnvironments,
            addEventToEnvironment,
            removeEventFromEnvironment,
            addHistoryData,
            removeHistoryData,
            updateHistoryData,
        ]
    );

    return (
        <EnvironmentContext.Provider value={value}>
            {children}
        </EnvironmentContext.Provider>
    );
};

export const useEnvironment = () => {
    const ctx = useContext(EnvironmentContext);
    if (!ctx) throw new Error("useEnvironment must be used within EnvironmentProvider");
    return ctx;
};