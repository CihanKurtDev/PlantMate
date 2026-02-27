"use client"

import { Input } from "@/components/Form/Input";
import { Button } from "@/components/Button/Button";
import { usePlantMonitor } from "@/context/PlantMonitorContext";
import { usePlantValidation } from "@/hooks/usePlantValidation";
import { hasValidationErrors } from "@/helpers/validationUtils";
import Form, { FormField } from "@/components/Form/Form";
import { Select } from "@/components/Form/Select";
import { usePlantForm } from "@/hooks/usePlantForm";
import { useEffect, useState } from "react";
import { useModal } from "@/context/ModalContext";

interface PlantFormProps {
    environmentId?: string;
    plantId?: string;
}

export const PlantForm = ({ environmentId, plantId }: PlantFormProps) => {
    const { addPlant, updatePlant, environments, plants } = usePlantMonitor();
    const { validate } = usePlantValidation();
    const [plantCount, setPlantCount] = useState<number>(1);
    const { closeModal } = useModal();

    const existingPlant = plantId ? plants.find(p => p.id === plantId) : undefined;
    const { formState, setField, resetForm } = usePlantForm(existingPlant);

    useEffect(() => {
        if (!existingPlant && environmentId) {
            setField("environmentId", environmentId);
        }
    }, [environmentId, existingPlant]);

    const validationErrors = validate(formState);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (hasValidationErrors(validationErrors)) return;

        if (existingPlant) {
            updatePlant({ ...existingPlant, ...formState });
        } else {
            for (let i = 0; i < plantCount; i++) {
                addPlant({ ...formState, id: crypto.randomUUID() });
            }
            resetForm();
        }

        closeModal();
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

            {!plantId && (
                <Input
                    label="Anzahl Pflanzen"
                    type="number"
                    value={plantCount}
                    onChange={(e) => setPlantCount(Math.max(1, parseInt(e.target.value) || 1))}
                    min={1}
                />
            )}

            <div>
                {plantId ? (
                    <Button type="button" onClick={handleSubmit}>
                        Änderungen speichern
                    </Button>
                ) : (
                    <Button type="button" variant="secondary" onClick={handleSubmit}>
                        Speichern
                    </Button>
                )}
            </div>
        </Form>
    );
};