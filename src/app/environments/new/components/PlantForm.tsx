"use client"

import type { PlantData } from "@/types/plant";
import { Input } from "@/components/Form/Input";
import { Button } from "@/components/Button/Button";
import { usePlantMonitor } from "@/context/PlantMonitorContext";
import { useRouter } from "next/navigation";
import { usePlantValidation } from "@/hooks/usePlantValidation";
import Form, { FormField, FormSectionTitle } from "@/components/Form/Form";
import { Select } from "@/components/Form/Select";
import { WaterInputs } from "../../[environmentId]/components/shared/WaterInputs";
import { useState } from "react";

interface PlantFormProps {
    initialData?: PlantData; 
}

export const PlantForm = ({ initialData }: PlantFormProps) => {
    const { addPlant, environments } = usePlantMonitor();
    const { validate, validateWarnings } = usePlantValidation();
    const router = useRouter();
    const isEditing = !!initialData;

    const [formState, setFormState] = useState<PlantData>({
        id: initialData?.id ?? crypto.randomUUID(),
        title: initialData?.title ?? "",
        species: initialData?.species ?? "",
        environmentId: initialData?.environmentId ?? "",
        water: initialData?.water ?? {},
    });

    const setField = <K extends keyof PlantData>(field: K, value: PlantData[K]) => {
        setFormState(prev => ({ ...prev, [field]: value }));
    };

    const validationErrors = validate(formState);
    const validationWarnings = validateWarnings(formState);

    const handleSubmitWithoutNav = (e: React.FormEvent) => {
        e.preventDefault();
        if (Object.keys(validationErrors).length > 0) return;

        const amount = formState.water?.amount?.value ?? 1;

        for (let i = 0; i < amount; i++) {
            addPlant({ ...formState, id: crypto.randomUUID() });
        }

        setFormState({
            id: crypto.randomUUID(),
            title: "",
            species: "",
            environmentId: "",
            water: {},
        });
    };

    const handleSubmit = (e: React.FormEvent) => {
        handleSubmitWithoutNav(e);
        router.push("/dashboard");
    };

    return (
        <Form onSubmit={handleSubmit}>
            <Input
                label="Name"
                value={formState.title}
                onChange={(e) => setField("title", e.target.value)}
                error={validationErrors.title}
                required
            />

            <Input
                label="Art/Sorte"
                value={formState.species}
                onChange={(e) => setField("species", e.target.value)}
                error={validationErrors.species}
                placeholder="z.B. Solanum lycopersicum"
            />

            <FormField>
                <Select
                    label="Environment"
                    value={formState.environmentId}
                    onChange={(e) => setField("environmentId", e.target.value)}
                    error={validationErrors.environmentId}
                >
                    <option value="">Bitte wählen...</option>
                    {environments.map(env => (
                        <option key={env.id} value={env.id}>
                            {env.name}
                        </option>
                    ))}
                </Select>
            </FormField>

            <FormSectionTitle>Wasserwerte</FormSectionTitle>

            <WaterInputs
                water={formState.water}
                onChange={(water) => setField("water", water)}
                errors={validationErrors.water}
                warnings={validationWarnings.water}
            />

            <div>
                {isEditing && (
                    <Button type="button" variant="secondary" onClick={handleSubmitWithoutNav}>
                        Speichern & Weiter
                    </Button>
                )}
                <Button type="button" variant="primary" onClick={handleSubmit}>
                    Speichern & Zum Dashboard
                </Button>
            </div>
        </Form>
    );
};
