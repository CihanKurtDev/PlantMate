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
import { usePlantForm } from "@/hooks/usePlantForm";
import { useEffect, useState } from "react";
import { convertWaterInputToData } from "@/helpers/waterConverter";

interface PlantFormProps {
    initialData?: PlantData; 
    environmentId?: string;
}

export const PlantForm = ({ initialData, environmentId }: PlantFormProps) => {
    const { addPlant, environments } = usePlantMonitor();
    const { validate, validateWarnings } = usePlantValidation();
    const [plantCount, setPlantCount] = useState<number>(1)
    const router = useRouter();
    const isEditing = !!initialData;

    const { formState, setField, resetForm } = usePlantForm(initialData)

    useEffect(() => {
        if (!initialData && environmentId) {
            setField("environmentId", environmentId);
        }
    }, [environmentId, initialData]);

    const validationErrors = validate(formState);
    const validationWarnings = validateWarnings(formState);

    const handleSubmitWithoutNav = (e: React.FormEvent) => {
        e.preventDefault();
        if (Object.keys(validationErrors).length > 0) return;

        const waterData = convertWaterInputToData(formState.water);

        const plantData: PlantData = {
            ...formState,
            water: waterData,
        };

        for (let i = 0; i < plantCount; i++) {
            addPlant({ ...plantData, id: crypto.randomUUID() });
        }

        resetForm();
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

            {!isEditing && (
                <Input
                    label="Anzahl Pflanzen"
                    type="number"
                    value={plantCount}
                    onChange={(e) => setPlantCount(Math.max(1, parseInt(e.target.value) || 1))}
                    min={1}
                />
            )}

            <FormSectionTitle>Wasserwerte</FormSectionTitle>

            <WaterInputs
                water={formState.water}
                onChange={(water) => setField("water", water)}
                errors={validationErrors.water}
                warnings={validationWarnings.water}
                hideAmountInput={true}
            />

            <div>
                {isEditing && (
                    <Button type="button" variant="secondary" onClick={handleSubmitWithoutNav}>
                        Speichern & Weiter
                    </Button>
                )}
                <Button type="button" onClick={handleSubmit}>
                    Speichern & Zum Dashboard
                </Button>
            </div>
        </Form>
    );
};