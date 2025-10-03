import { useState } from "react";
import type { TentData } from "../data/tents";
import { TentContext } from "./TentContext";

interface TentProviderProps {
  tents: TentData[] 
  children: React.ReactNode
}

export const TentProvider: React.FC<TentProviderProps> = ({
  tents,
  children,
}) => {
  const [selectedTentId, setSelectedTentId] = useState<string | undefined>();
  
  function getTentSpecies(tent: TentData): string[] {
    const species = tent.plants.map(plant => plant.species);
    return [...new Set(species)];
  }

  return (
    <TentContext value={{ tents, selectedTentId, setSelectedTentId, getTentSpecies}}>
      {children}
    </TentContext>
  );
};
