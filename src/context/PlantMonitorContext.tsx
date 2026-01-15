"use client"
import { createContext, useContext, useState, ReactNode, useEffect } from "react";
import type { EnvironmentData, EnvironmentEvent } from "@/types/environment";
import type { PlantData, PlantEvent } from "@/types/plant";

interface PlantMonitorContextType {
    environments: EnvironmentData[];
    plants: PlantData[];
    addEnvironment: (env: EnvironmentData) => void;
    addPlant: (plant: PlantData) => void;
    getPlantsByEnvironment: (envId: string) => PlantData[];
    addEventToPlant: (plantId: string, event: PlantEvent) => void,
    addEventToEnvironment: (environmentId: string, event: EnvironmentEvent) => void,
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

    const addPlant = (plant: PlantData) => {
        setPlants(prev => {
            const updated = [...prev, plant];
            localStorage.setItem("plants", JSON.stringify(updated));
            return updated;
        });
    };

    const addEventToPlant = (plantId: string, event: PlantEvent) => {
        setPlants(prev =>
            prev.map(plant => {
                if (plant.id === plantId) {
                    const updatedPlant = {
                        ...plant,
                        events: [...(plant.events || []), event],
                    };
                    return updatedPlant;
                }
                return plant;
            })
        );

        const updatedPlants = plants.map(plant => {
            if (plant.id === plantId) {
                return { ...plant, events: [...(plant.events || []), event] };
            }
            return plant;
        });

        localStorage.setItem("plants", JSON.stringify(updatedPlants));
    };

    const addEventToEnvironment = (environmentId: string, event: EnvironmentEvent) => {
        setEnvironments(prev =>
            prev.map(env =>
                env.id === environmentId
                    ? { ...env, events: [...(env.events ?? []), event] }
                    : env
            )
        );
    };


    const getPlantsByEnvironment = (envId: string) => {
        return plants.filter(plant => plant.environmentId === envId);
    };

    return (
        <PlantMonitorContext.Provider value={{ environments, plants, addEnvironment, getPlantsByEnvironment, addPlant, addEventToPlant, addEventToEnvironment }}>
            {children}
        </PlantMonitorContext.Provider>
    );
};

export const usePlantMonitor = () => {
    const context = useContext(PlantMonitorContext);
    if (!context) throw new Error("usePlantMonitor must be used within PlantMonitorProvider");
    return context;
};
