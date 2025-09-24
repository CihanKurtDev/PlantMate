import { useState } from "react";
import type { PlantData } from "../data/plant";
import { PlantContext } from "./PlantContext";

interface PlantProviderProps {
  plants: PlantData[] 
  children: React.ReactNode
}

export const PlantProvider: React.FC<PlantProviderProps> = ({
  plants,
  children,
}) => {
  const [selectedPlantId, setSelectedPlantId] = useState<string | undefined>();

  return (
    <PlantContext value={{ plants, selectedPlantId, setSelectedPlantId}}>
      {children}
    </PlantContext>
  );
};
