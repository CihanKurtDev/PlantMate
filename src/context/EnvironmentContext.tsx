"use client";

import { createContext, useContext, useState, ReactNode, useEffect, useCallback, useMemo } from "react";
import type { EnvironmentData, EnvironmentData_Historical, EnvironmentEvent } from "@/types/environment";

interface EnvironmentContextType {
    environments: EnvironmentData[];
    addEnvironment: (env: EnvironmentData) => void;
    updateEnvironment: (env: EnvironmentData) => void;
    deleteEnvironments: (ids: string[]) => void;
    addEventToEnvironment: (environmentId: string, event: EnvironmentEvent) => void;
    addHistoryData: (environmentId: string, entry: EnvironmentData_Historical) => void;
    updateHistoryData: (environmentId: string, entry: EnvironmentData_Historical) => void;
}

const EnvironmentContext = createContext<EnvironmentContextType | undefined>(undefined);

export const EnvironmentProvider = ({ children }: { children: ReactNode }) => {
    const [environments, setEnvironments] = useState<EnvironmentData[]>([]);

    useEffect(() => {
        const stored = localStorage.getItem("environments");
        if (stored) setEnvironments(JSON.parse(stored));
    }, []);

    const addEnvironment = useCallback((env: EnvironmentData) => {
        setEnvironments(prev => {
            const updated = [...prev, env];
            localStorage.setItem("environments", JSON.stringify(updated));
            return updated;
        });
    }, []);

    const updateEnvironment = useCallback((env: EnvironmentData) => {
        setEnvironments(prev => {
            const updated = prev.map(e => (e.id === env.id ? env : e));
            localStorage.setItem("environments", JSON.stringify(updated));
            return updated;
        });
    }, []);

    const deleteEnvironments = useCallback((ids: string[]) => {
        setEnvironments(prev => {
            const updated = prev.filter(env => !ids.includes(env.id!));
            localStorage.setItem("environments", JSON.stringify(updated));
            return updated;
        });
    }, []);

    const addEventToEnvironment = useCallback((environmentId: string, event: EnvironmentEvent) => {
        setEnvironments(prev => {
            const updated = prev.map(env =>
                env.id === environmentId
                    ? { ...env, events: [...(env.events ?? []), event] }
                    : env
            );
            localStorage.setItem("environments", JSON.stringify(updated));
            return updated;
        });
    }, []);

    const addHistoryData = useCallback((environmentId: string, entry: EnvironmentData_Historical) => {
        setEnvironments(prev => {
            const updated = prev.map(env =>
                env.id === environmentId
                    ? { ...env, historical: [...(env.historical ?? []), entry] }
                    : env
            );
            localStorage.setItem("environments", JSON.stringify(updated));
            return updated;
        });
    }, []);

    const updateHistoryData = useCallback((environmentId: string, entry: EnvironmentData_Historical) => {
        setEnvironments(prev => {
            const updated = prev.map(env =>
                env.id === environmentId
                    ? {
                          ...env,
                          historical: (env.historical ?? []).map(h =>
                              h.id === entry.id ? entry : h
                          ),
                      }
                    : env
            );
            localStorage.setItem("environments", JSON.stringify(updated));
            return updated;
        });
    }, []);

    const value = useMemo(
        () => ({
            environments,
            addEnvironment,
            updateEnvironment,
            deleteEnvironments,
            addEventToEnvironment,
            addHistoryData,
            updateHistoryData,
        }),
        [
            environments,
            addEnvironment,
            updateEnvironment,
            deleteEnvironments,
            addEventToEnvironment,
            addHistoryData,
            updateHistoryData,
        ]
    );

    return (
        <EnvironmentContext value={value}>
            {children}
        </EnvironmentContext>
    );
};

export const useEnvironment = () => {
    const ctx = useContext(EnvironmentContext);
    if (!ctx) throw new Error("useEnvironment must be used within EnvironmentProvider");
    return ctx;
};