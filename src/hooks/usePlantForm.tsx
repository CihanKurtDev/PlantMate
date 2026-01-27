import { PlantData } from "@/types/plant"
import { useState } from "react"

export const usePlantForm = (initialData?: PlantData) => {
    const [formState, setFormState] = useState({
        plantId: initialData?.id,
        title: initialData?.title || "",
        species: initialData?.species || "",
        environmentId: initialData?.environmentId || "",
        water: initialData?.water,
    })

    const setField = <K extends keyof typeof formState>(field: K, value: any) => {
        setFormState(prev => ({ ...prev, [field]: value }));
    };

    const resetForm = () => {
        setFormState(prev => ({
            ...prev,
            plantId: undefined,
            title: "",
            species: "",
            environmentId: prev.environmentId,
            water: undefined,
        }));
    };
    
    return { formState, setField, resetForm }
}