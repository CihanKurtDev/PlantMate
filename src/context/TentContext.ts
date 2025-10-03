import { createContext } from "react";
import type { TentData } from "../data/tents";

interface TentContextValue {
    tents: TentData[]
    selectedTentId?: string
    setSelectedTentId: (id?: string) => void
    getTentSpecies: (tent: TentData) => string[];
};

export const TentContext = createContext<TentContextValue | undefined>(undefined);