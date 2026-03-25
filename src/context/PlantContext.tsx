"use client";

import { createContext, useContext, useState, ReactNode, useEffect, useCallback, useMemo } from "react";
import type { PlantData, PlantData_Historical, PlantEvent } from "@/types/plant";

interface PlantContextType {
    plants: PlantData[];
    addPlant: (plant: PlantData) => void;
    updatePlant: (plant: PlantData) => void;
    deletePlants: (ids: string[]) => void;
    addEventToPlant: (plantId: string, event: PlantEvent) => void;
    addPlantHistoryData: (plantId: string, entry: PlantData_Historical) => void;
    getPlantsByEnvironment: (envId: string) => PlantData[];
}

const PlantContext = createContext<PlantContextType | undefined>(undefined);

export const PlantProvider = ({ children }: { children: ReactNode }) => {
    const [plants, setPlants] = useState<PlantData[]>([]);

    useEffect(() => {
        const stored = localStorage.getItem("plants");
        if (stored) setPlants(JSON.parse(stored));
    }, []);

    const addPlant = useCallback((plant: PlantData) => {
        setPlants(prev => {
            const updated = [...prev, plant];
            localStorage.setItem("plants", JSON.stringify(updated));
            return updated;
        });
    }, []);

    const updatePlant = useCallback((plant: PlantData) => {
        setPlants(prev => {
            const updated = prev.map(p => (p.id === plant.id ? plant : p));
            localStorage.setItem("plants", JSON.stringify(updated));
            return updated;
        });
    }, []);

    const deletePlants = useCallback((ids: string[]) => {
        setPlants(prev => {
            const updated = prev.filter(p => !ids.includes(p.id!));
            localStorage.setItem("plants", JSON.stringify(updated));
            return updated;
        });
    }, []);

    const addEventToPlant = useCallback((plantId: string, event: PlantEvent) => {
        setPlants(prev => {
            const updated = prev.map(plant =>
                plant.id === plantId
                    ? { ...plant, events: [...(plant.events || []), event] }
                    : plant
            );
            localStorage.setItem("plants", JSON.stringify(updated));
            return updated;
        });
    }, []);

    const addPlantHistoryData = useCallback((plantId: string, entry: PlantData_Historical) => {
        setPlants(prev => {
            const updated = prev.map(plant =>
                plant.id === plantId
                    ? { ...plant, historical: [...(plant.historical ?? []), entry] }
                    : plant
            );
            localStorage.setItem("plants", JSON.stringify(updated));
            return updated;
        });
    }, []);

    const getPlantsByEnvironment = useCallback(
        (envId: string) => plants.filter(p => p.environmentId === envId),
        [plants]
    );

    const value = useMemo(
        () => ({
            plants,
            addPlant,
            updatePlant,
            deletePlants,
            addEventToPlant,
            addPlantHistoryData,
            getPlantsByEnvironment,
        }),
        [
            plants,
            addPlant,
            updatePlant,
            deletePlants,
            addEventToPlant,
            addPlantHistoryData,
            getPlantsByEnvironment,
        ]
    );

    return (
        <PlantContext.Provider value={value}>
            {children}
        </PlantContext.Provider>
    );
};

export const usePlant = () => {
    const ctx = useContext(PlantContext);
    if (!ctx) throw new Error("usePlant must be used within PlantProvider");
    return ctx;
};