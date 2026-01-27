import { useState } from "react";
import type { ClimateData, EnvironmentData, EnvironmentType, TempUnit } from "@/types/environment";

export const useEnvironmentForm = (initialData?: EnvironmentData) => {
    const [formState, setFormState] = useState<EnvironmentData>({
        id: initialData?.id ?? crypto.randomUUID(),
        name: initialData?.name ?? "",
        type: initialData?.type ?? "ROOM",
        location: initialData?.location,
        climate: initialData?.climate,
    });

    const setField = <K extends keyof EnvironmentData>(
        field: K,
        value: EnvironmentData[K]
    ) => {
        setFormState((prev) => ({ ...prev, [field]: value }));
    };

    const setClimateField = (climate: ClimateData) => {
        setFormState((prev) => ({
            ...prev,
            climate: climate,
        }));
    };

    const resetForm = () => {
        setFormState({
            id: crypto.randomUUID(),
            name: "",
            type: "ROOM",
            location: "",
            climate: undefined,
        });
    };

    return { formState, setField, setClimateField, resetForm };
};