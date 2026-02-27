"use client"
import { createContext, useContext, useState, ReactNode, useEffect } from "react";
import type { EnvironmentData, EnvironmentData_Historical, EnvironmentEvent } from "@/types/environment";
import type { PlantData, PlantData_Historical, PlantEvent } from "@/types/plant";

interface PlantMonitorContextType {
    environments: EnvironmentData[];
    plants: PlantData[];
    addEnvironment: (env: EnvironmentData) => void;
    updateEnvironment: (env: EnvironmentData) => void;
    addPlant: (plant: PlantData) => void;
    updatePlant: (plant: PlantData) => void;
    getPlantsByEnvironment: (envId: string) => PlantData[];
    addEventToPlant: (plantId: string, event: PlantEvent) => void,
    addEventToEnvironment: (environmentId: string, event: EnvironmentEvent) => void,
    addHistoryData: (environmentId: string, entry: EnvironmentData_Historical) => void,
    updateHistoryData: (environmentId: string, entry: EnvironmentData_Historical) => void,
    addPlantHistoryData: (plantId: string, entry: PlantData_Historical) => void,
    deletePlants: (ids: string[]) => void;
}

const PlantMonitorContext = createContext<PlantMonitorContextType | undefined>(undefined);

export const PlantMonitorProvider = ({ children }: { children: ReactNode }) => {
    const [environments, setEnvironments] = useState<EnvironmentData[]>([]);
    const [plants, setPlants] = useState<PlantData[]>([]);

    useEffect(() => {
        const storedEnvs = localStorage.getItem("environments");
        if (storedEnvs) {
            try {
                setEnvironments(JSON.parse(storedEnvs));
            } catch (e) {
                console.error("Fehler beim Laden der Environments aus localStorage", e);
            }
        }
        const storedPlants = localStorage.getItem("plants");
        if (storedPlants) {
            try {
                setPlants(JSON.parse(storedPlants));
            } catch (e) {
                console.error("Fehler beim Laden der Plants aus localStorage", e);
            }
        }
    }, []);

    const addEnvironment = (env: EnvironmentData) => {
        setEnvironments(prev => {
            const updated = [...prev, env];
            localStorage.setItem("environments", JSON.stringify(updated));
            return updated;
        });
    };

    const updateEnvironment = (env: EnvironmentData) => {
        setEnvironments(prev => {
            const updated = prev.map(e => e.id === env.id ? env : e);
            localStorage.setItem("environments", JSON.stringify(updated));
            return updated;
        });
    };

    const addPlant = (plant: PlantData) => {
        setPlants(prev => {
            const updated = [...prev, plant];
            localStorage.setItem("plants", JSON.stringify(updated));
            return updated;
        });
    };

    const updatePlant = (plant: PlantData) => {
        setPlants(prev => {
            const updated = prev.map(p => p.id === plant.id ? plant : p);
            localStorage.setItem("plants", JSON.stringify(updated));
            return updated;
        });
    };

    const deletePlants = (ids: string[]) => {
        setPlants(prev => {
            const updated = prev.filter(plant => !ids.includes(plant.id!));
            localStorage.setItem("plants", JSON.stringify(updated));
            return updated;
        });
    };

    const addEventToPlant = (plantId: string, event: PlantEvent) => {
        setPlants(prev => {
            const updated = prev.map(plant =>
                plant.id === plantId
                    ? { ...plant, events: [...(plant.events || []), event] }
                    : plant
            );
            localStorage.setItem("plants", JSON.stringify(updated));
            return updated;
        });
    };

    const addEventToEnvironment = (environmentId: string, event: EnvironmentEvent) => {
        setEnvironments(prev => {
            const updated = prev.map(env =>
                env.id === environmentId
                    ? { ...env, events: [...(env.events ?? []), event] }
                    : env
            )

            localStorage.setItem("environments", JSON.stringify(updated))

            return updated
        });
    };

    const addHistoryData = (environmentId: string, entry: EnvironmentData_Historical) => {
        setEnvironments(prev => {
            const updated = prev.map(env =>
                env.id === environmentId
                    ? { ...env, historical: [...(env.historical ?? []), entry] }
                    : env
            );
            localStorage.setItem("environments", JSON.stringify(updated));
            return updated;
        });
    };

    const updateHistoryData = (environmentId: string, entry: EnvironmentData_Historical) => {
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
    };

    const addPlantHistoryData = (plantId: string, entry: PlantData_Historical) => {
        setPlants(prev => {
            const updated = prev.map(plant =>
                plant.id === plantId
                    ? { ...plant, historical: [...(plant.historical ?? []), entry] }
                    : plant
            );
            localStorage.setItem("plants", JSON.stringify(updated));
            return updated;
        });
    };

    const getPlantsByEnvironment = (envId: string) => {
        return plants.filter(plant => plant.environmentId === envId);
    };

    return (
        <PlantMonitorContext.Provider value={{
            environments, 
            plants,
            addEnvironment, 
            updateEnvironment,
            addPlant, 
            updatePlant,
            getPlantsByEnvironment, 
            deletePlants,
            addEventToPlant, 
            addEventToEnvironment,
            addHistoryData,
            updateHistoryData,
            addPlantHistoryData
        }}>
            {children}
        </PlantMonitorContext.Provider>
    );
};

export const usePlantMonitor = () => {
    const context = useContext(PlantMonitorContext);
    if (!context) throw new Error("usePlantMonitor must be used within PlantMonitorProvider");
    return context;
};