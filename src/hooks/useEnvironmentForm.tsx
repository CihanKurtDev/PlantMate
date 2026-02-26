import { useState } from "react";
import type { EnvironmentData, EnvironmentFormData} from "@/types/environment";

export const useEnvironmentForm = (initialData?: EnvironmentData) => {
    const [formState, setFormState] = useState<EnvironmentFormData>({
        id: initialData?.id ?? crypto.randomUUID(),
        name: initialData?.name ?? "",
        type: initialData?.type ?? "ROOM",
        location: initialData?.location,
        historical: initialData?.historical,
    });


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
    };

    return { formState, setField, resetForm };
};