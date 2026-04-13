"use client";

import { createContext, useContext, ReactNode, useCallback, useMemo } from "react";
import type { PlantData, PlantData_Historical, PlantEvent } from "@/types/plant";
import { useLocalStorageState } from "@/hooks/useLocalStorage";
import { useEnvironment } from "@/context/EnvironmentContext";

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
    const [storedPlants, setPlants] = useLocalStorageState<PlantData[]>("plants", []);
    const { environments } = useEnvironment();
    const allowedEnvironmentIds = useMemo(
        () => new Set(environments.map((environment) => environment.id)),
        [environments]
    );
    const plants = useMemo(
        () => storedPlants.filter((plant) => allowedEnvironmentIds.has(plant.environmentId)),
        [allowedEnvironmentIds, storedPlants]
    );
    const visiblePlantIds = useMemo(
        () => new Set(plants.map((plant) => plant.id)),
        [plants]
    );

    const addPlant = useCallback((plant: PlantData) => {
        if (!allowedEnvironmentIds.has(plant.environmentId)) return;
        setPlants((prev) => [...prev, plant]);
    }, [allowedEnvironmentIds, setPlants]);

    const updatePlant = useCallback((plant: PlantData) => {
        if (!plant.id) return;
        if (!allowedEnvironmentIds.has(plant.environmentId)) return;
        if (!visiblePlantIds.has(plant.id)) return;
        setPlants((prev) =>
            prev.map((p) =>
                p.id === plant.id
                    ? plant
                    : p
            )
        );
    }, [allowedEnvironmentIds, setPlants, visiblePlantIds]);

    const deletePlants = useCallback((ids: string[]) => {
        setPlants((prev) =>
            prev.filter((p) => !(ids.includes(p.id!) && allowedEnvironmentIds.has(p.environmentId)))
        );
    }, [allowedEnvironmentIds, setPlants]);

    const addEventToPlant = useCallback((plantId: string, event: PlantEvent) => {
        if (!visiblePlantIds.has(plantId)) return;
        setPlants((prev) =>
            prev.map((plant) =>
                plant.id === plantId
                    ? { ...plant, events: [...(plant.events ?? []), event] }
                    : plant
            )
        );
    }, [setPlants, visiblePlantIds]);

    const removeEventFromPlant = useCallback((plantId: string, eventId: string) => {
        if (!visiblePlantIds.has(plantId)) return;
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
    }, [setPlants, visiblePlantIds]);

    const addPlantHistoryData = useCallback((plantId: string, entry: PlantData_Historical) => {
        if (!visiblePlantIds.has(plantId)) return;
        setPlants((prev) =>
            prev.map((plant) =>
                plant.id === plantId
                    ? { ...plant, historical: [...(plant.historical ?? []), entry] }
                    : plant
            )
        );
    }, [setPlants, visiblePlantIds]);

    const removePlantHistoryData = useCallback((plantId: string, entryId: string) => {
        if (!visiblePlantIds.has(plantId)) return;
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
    }, [setPlants, visiblePlantIds]);

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