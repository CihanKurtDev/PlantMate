import { convertWaterDataToInput } from "@/helpers/waterConverter";
import { PlantData, PlantFormData, WaterDataInput } from "@/types/plant";
import { useState, useCallback } from "react";

export const usePlantForm = (initialData?: PlantData) => {
    const historical = initialData?.historical;
    const latestWater = historical?.at(-1)?.water;

    const [formState, setFormState] = useState<PlantFormData>({
        id: initialData?.id ?? "",
        title: initialData?.title ?? "",
        species: initialData?.species ?? "",
        environmentId: initialData?.environmentId ?? "",
        historical: initialData?.historical,
    });

    const [waterInput, setWaterInput] = useState<WaterDataInput | undefined>(
        convertWaterDataToInput(latestWater)
    );

    const setField = useCallback(<K extends keyof PlantFormData>(field: K, value: PlantFormData[K]) => {
        setFormState((prev) => ({ ...prev, [field]: value }));
    }, []);

    const resetForm = useCallback(() => {
        setFormState(prev => ({
            ...prev,
            title: "",
            species: "",
            environmentId: prev.environmentId,
            historical: undefined,
        }));
        setWaterInput(undefined);
    }, []);

    return { formState, waterInput, setField, setWaterInput, resetForm };
};