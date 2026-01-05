"use client"
import { EnvironmentData } from "@/types/environment";
import { PlantData } from "@/types/plant";
import { createContext, useContext, useState } from "react";
import plants from '@/data/mock/plants'
import environments from '@/data/mock/environments'

interface PlantMonitorContextType {
    environments: EnvironmentData[];
    plants: PlantData[];
    getPlantsByEnvironment: (envId: string) => PlantData[];
}

const PlantMonitorContext = createContext<PlantMonitorContextType | undefined>(undefined);

const PlantMonitorProvider = ({ children }: { children: React.ReactNode }) => {

    const getPlantsByEnvironment = (envId: string) => {
        return plants.filter(plant => plant.environmentId === envId);
    };

    return (
        <PlantMonitorContext.Provider
            value={{
                environments,
                plants,
                getPlantsByEnvironment,
            }}
        >
            {children}
        </PlantMonitorContext.Provider>
    );
}

export const usePlantMonitor = () => {
    const context = useContext(PlantMonitorContext);
    if (!context) {
        throw new Error('usePlantMonitor must be used within PlantMonitorProvider');
    }
    return context;
}

export default PlantMonitorProvider