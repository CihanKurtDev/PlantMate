"use client";

import { createContext, useContext, ReactNode, useCallback, useMemo } from "react";
import type {
    EnvironmentData,
    EnvironmentData_Historical,
    EnvironmentEvent,
} from "@/types/environment";
import { useLocalStorageState } from "@/hooks/useLocalStorage";

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
    const [environments, setEnvironments] =
        useLocalStorageState<EnvironmentData[]>("environments", []);

    const addEnvironment = useCallback((env: EnvironmentData) => {
        setEnvironments((prev) => [...prev, env]);
    }, [setEnvironments]);

    const updateEnvironment = useCallback((env: EnvironmentData) => {
        setEnvironments((prev) => prev.map((e) => (e.id === env.id ? env : e)));
    }, [setEnvironments]);

    const deleteEnvironments = useCallback((ids: string[]) => {
        setEnvironments((prev) => prev.filter((env) => !ids.includes(env.id)));
    }, [setEnvironments]);

    const addEventToEnvironment = useCallback((environmentId: string, event: EnvironmentEvent) => {
        setEnvironments((prev) =>
            prev.map((env) =>
                env.id === environmentId
                    ? { ...env, events: [...(env.events ?? []), event] }
                    : env
            )
        );
    }, [setEnvironments]);

    const removeEventFromEnvironment = useCallback((environmentId: string, eventId: string) => {
        setEnvironments((prev) =>
            prev.map((env) =>
                env.id === environmentId
                    ? {
                          ...env,
                          events: (env.events ?? []).filter((event) => event.id !== eventId),
                      }
                    : env
            )
        );
    }, [setEnvironments]);

    const addHistoryData = useCallback((environmentId: string, entry: EnvironmentData_Historical) => {
        setEnvironments((prev) =>
            prev.map((env) =>
                env.id === environmentId
                    ? { ...env, historical: [...(env.historical ?? []), entry] }
                    : env
            )
        );
    }, [setEnvironments]);

    const removeHistoryData = useCallback((environmentId: string, entryId: string) => {
        setEnvironments((prev) =>
            prev.map((env) =>
                env.id === environmentId
                    ? {
                          ...env,
                          historical: (env.historical ?? []).filter((entry) => entry.id !== entryId),
                      }
                    : env
            )
        );
    }, [setEnvironments]);

    const updateHistoryData = useCallback((environmentId: string, entry: EnvironmentData_Historical) => {
        setEnvironments((prev) =>
            prev.map((env) =>
                env.id === environmentId
                    ? {
                          ...env,
                          historical: (env.historical ?? []).map((h) =>
                              h.id === entry.id ? entry : h
                          ),
                      }
                    : env
            )
        );
    }, [setEnvironments]);

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