import { PlantData } from "@/types/plant"
import { useState } from "react"

export const usePlantForm = (initialData?: PlantData) => {
    const [formState, setFormState] = useState({
        plantId: initialData?.id,
        title: initialData?.title || "",
        species: initialData?.species || "",
        environmentId: initialData?.environmentId || "",
        ph: initialData?.water?.ph?.value,
        ec: initialData?.water?.ec?.value,
        touched: {
            title: false,
            species: false,
            environmentId: false,
            ph: false,
            ec: false,
        },        
    })

    const setField = <K extends keyof typeof formState>(field: K, value: any) => {
        setFormState(prev => ({ ...prev, [field]: value }));
    };

    const setTouchedField = (field: keyof typeof formState.touched, value: boolean) => {
        setFormState(prev => ({ 
            ...prev, 
            touched: { ...prev.touched, [field]: value } 
        }));
    };

    const resetForm = () => {
        setFormState(prev => ({
            ...prev,
            plantId: undefined,
            title: "",
            species: "",
            environmentId: prev.environmentId,
            ph: undefined,
            ec: undefined,
            touched: {
                title: false,
                species: false,
                environmentId: false,
                ph: false,
                ec: false,
            },
        }));
    };
    
    return { formState, setField, setTouchedField, resetForm }
}