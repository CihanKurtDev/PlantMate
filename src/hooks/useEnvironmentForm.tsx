import { useState } from "react";
import type { EnvironmentData, EnvironmentFormData} from "@/types/environment";
import { convertClimateDataToInput } from "@/helpers/climateConverter";

export const useEnvironmentForm = (initialData?: EnvironmentData) => {
    const [formState, setFormState] = useState<EnvironmentFormData>({
        id: initialData?.id ?? crypto.randomUUID(),
        name: initialData?.name ?? "",
        type: initialData?.type ?? "ROOM",
        location: initialData?.location,
        climate: convertClimateDataToInput(initialData?.climate),
    });

    const setField = <K extends keyof EnvironmentData>(
        field: K,
        value: EnvironmentData[K]
    ) => {
        setFormState((prev) => ({ ...prev, [field]: value }));
    };

    const setClimateField = (climateInput: EnvironmentFormData["climate"]) => {
        setFormState((prev) => ({
            ...prev,
            climate: climateInput,
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