import { useContext } from "react";
import { PlantContext } from "./PlantContext";

export function usePlantContext() {
    const ctx = useContext(PlantContext);
    if (!ctx) throw new Error("usePlantContext must be used inside PlantProvider");
    return ctx;
}