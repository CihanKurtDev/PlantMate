import { useContext } from "react";
import { TentContext } from "./TentContext";

export function useTentContext() {
    const ctx = useContext(TentContext);
    if (!ctx) throw new Error("usePlantContext must be used inside PlantProvider");
    return ctx;
}