import { createContext } from "react";
import type { PlantData } from "../data/plant";

interface PlantContextValue {
    plants: PlantData[]
    selectedPlantId?: string
    setSelectedPlantId: (id?: string) => void
};

export const PlantContext = createContext<PlantContextValue | undefined>(undefined);