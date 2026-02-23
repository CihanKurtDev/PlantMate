import { useState } from "react";
import type { ClimateDataInput, EnvironmentData, EnvironmentFormData} from "@/types/environment";
import { convertClimateDataToInput } from "@/helpers/climateConverter";

export const useEnvironmentForm = (initialData?: EnvironmentData) => {
    const historical = initialData?.historical;
    const latestClimate = historical?.at(-1)?.climate;
    const [formState, setFormState] = useState<EnvironmentFormData>({
        id: initialData?.id ?? crypto.randomUUID(),
        name: initialData?.name ?? "",
        type: initialData?.type ?? "ROOM",
        location: initialData?.location,
        historical: initialData?.historical,
    });

    const [climateInput, setClimateInput] = useState<ClimateDataInput | undefined>(
        convertClimateDataToInput(latestClimate)
    );

    const setField = <K extends keyof EnvironmentFormData>( field: K, value: EnvironmentFormData[K] ) => {
        setFormState((prev) => ({ ...prev, [field]: value }));
    };

    const resetForm = () => {
        setFormState({
            id: crypto.randomUUID(),
            name: "",
            type: "ROOM",
            location: "",
            historical: undefined,
        });
        setClimateInput(undefined);
    };

    return { formState, climateInput, setField, setClimateInput, resetForm };
};