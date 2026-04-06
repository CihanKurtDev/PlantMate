"use client";

import { createContext, useContext, ReactNode, useCallback, useMemo } from "react";
import type { PlantData, PlantData_Historical, PlantEvent } from "@/types/plant";
import { useLocalStorageState } from "@/hooks/useLocalStorage";

interface PlantContextType {
    plants: PlantData[];
    addPlant: (plant: PlantData) => void;
    updatePlant: (plant: PlantData) => void;
    deletePlants: (ids: string[]) => void;
    addEventToPlant: (plantId: string, event: PlantEvent) => void;
    removeEventFromPlant: (plantId: string, eventId: string) => void;
    addPlantHistoryData: (plantId: string, entry: PlantData_Historical) => void;
    removePlantHistoryData: (plantId: string, entryId: string) => void;
    getPlantsByEnvironment: (envId: string) => PlantData[];
}

const PlantContext = createContext<PlantContextType | undefined>(undefined);

export const PlantProvider = ({ children }: { children: ReactNode }) => {
    const [plants, setPlants] = useLocalStorageState<PlantData[]>("plants", []);

    const addPlant = useCallback((plant: PlantData) => {
        setPlants((prev) => [...prev, plant]);
    }, [setPlants]);

    const updatePlant = useCallback((plant: PlantData) => {
        setPlants((prev) => prev.map((p) => (p.id === plant.id ? plant : p)));
    }, [setPlants]);

    const deletePlants = useCallback((ids: string[]) => {
        setPlants((prev) => prev.filter((p) => !ids.includes(p.id!)));
    }, [setPlants]);

    const addEventToPlant = useCallback((plantId: string, event: PlantEvent) => {
        setPlants((prev) =>
            prev.map((plant) =>
                plant.id === plantId
                    ? { ...plant, events: [...(plant.events ?? []), event] }
                    : plant
            )
        );
    }, [setPlants]);

    const removeEventFromPlant = useCallback((plantId: string, eventId: string) => {
        setPlants((prev) =>
            prev.map((plant) =>
                plant.id === plantId
                    ? {
                          ...plant,
                          events: (plant.events ?? []).filter((event) => event.id !== eventId),
                      }
                    : plant
            )
        );
    }, [setPlants]);

    const addPlantHistoryData = useCallback((plantId: string, entry: PlantData_Historical) => {
        setPlants((prev) =>
            prev.map((plant) =>
                plant.id === plantId
                    ? { ...plant, historical: [...(plant.historical ?? []), entry] }
                    : plant
            )
        );
    }, [setPlants]);

    const removePlantHistoryData = useCallback((plantId: string, entryId: string) => {
        setPlants((prev) =>
            prev.map((plant) =>
                plant.id === plantId
                    ? {
                          ...plant,
                          historical: (plant.historical ?? []).filter((entry) => entry.id !== entryId),
                      }
                    : plant
            )
        );
    }, [setPlants]);

    const getPlantsByEnvironment = useCallback(
        (envId: string) => plants.filter((p) => p.environmentId === envId),
        [plants]
    );

    const value = useMemo(
        () => ({
            plants,
            addPlant,
            updatePlant,
            deletePlants,
            addEventToPlant,
            removeEventFromPlant,
            addPlantHistoryData,
            removePlantHistoryData,
            getPlantsByEnvironment,
        }),
        [
            plants,
            addPlant,
            updatePlant,
            deletePlants,
            addEventToPlant,
            removeEventFromPlant,
            addPlantHistoryData,
            removePlantHistoryData,
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