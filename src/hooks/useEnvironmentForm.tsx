import { useState } from "react";
import type { EnvironmentData, EnvironmentType, TempUnit } from "@/types/environment";

interface EnvironmentFormState {
    environmentId: string;
    name: string;
    type: EnvironmentType;
    location: string;
    climate?: {
        temp?: { value: number; unit: TempUnit };
        humidity?: { value: number };
        co2?: { value: number };
        vpd?: { value: number };
    };
}

export const useEnvironmentForm = (initialData?: EnvironmentData) => {
    const [formState, setFormState] = useState<EnvironmentFormState>({
        environmentId: initialData?.id || crypto.randomUUID(),
        name: initialData?.name || "",
        type: initialData?.type || "ROOM",
        location: initialData?.location || "",
        climate: {
            temp: initialData?.climate?.temp 
                ? { value: initialData.climate.temp.value, unit: initialData.climate.temp.unit }
                : undefined,
            humidity: initialData?.climate?.humidity?.value !== undefined
                ? { value: initialData.climate.humidity.value }
                : undefined,
            co2: initialData?.climate?.co2?.value !== undefined
                ? { value: initialData.climate.co2.value }
                : undefined,
            vpd: initialData?.climate?.vpd?.value !== undefined
                ? { value: initialData.climate.vpd.value }
                : undefined,
        },
    });

    const setField = <K extends keyof EnvironmentFormState>(
        field: K,
        value: EnvironmentFormState[K]
    ) => {
        setFormState((prev) => ({ ...prev, [field]: value }));
    };

    const setClimateField = <K extends keyof NonNullable<EnvironmentFormState["climate"]>>(
        field: K,
        value: NonNullable<EnvironmentFormState["climate"]>[K]
    ) => {
        setFormState((prev) => ({
            ...prev,
            climate: {
                ...prev.climate,
                [field]: value,
            },
        }));
    };

    const resetForm = () => {
        setFormState({
            environmentId: crypto.randomUUID(),
            name: "",
            type: "ROOM",
            location: "",
            climate: {
                temp: undefined,
                humidity: undefined,
                co2: undefined,
                vpd: undefined,
            },
        });
    };

    return { formState, setField, setClimateField, resetForm };
};