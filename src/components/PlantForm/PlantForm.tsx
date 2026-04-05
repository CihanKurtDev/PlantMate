"use client";

import { Input } from "@/components/Form/Input";
import { Button } from "@/components/Button/Button";
import { usePlantValidation } from "@/hooks/usePlantValidation";
import { hasValidationErrors } from "@/helpers/validationUtils";
import Form, { FormField, FormHint } from "@/components/Form/Form";
import { Select } from "@/components/Form/Select";
import { usePlantForm } from "@/hooks/usePlantForm";
import { useEffect, useState } from "react";
import { useModal } from "@/context/ModalContext";
import { ProfileKey, PROFILES } from "@/config/profiles";
import { MAX_PLANT_COUNT } from "@/helpers/validationUtils";
import { usePlant } from "@/context/PlantContext";
import { useEnvironment } from "@/context/EnvironmentContext";
import { useToast } from "@/context/ToastContext";

interface PlantFormProps {
    environmentId?: string;
    plantId?: string;
    onBack?: () => void;
}

export const PlantForm = ({ environmentId, plantId, onBack }: PlantFormProps) => {
    const { addPlant, updatePlant, plants } = usePlant();
    const { environments } = useEnvironment();
    const { validate } = usePlantValidation();
    const { addToast } = useToast();
    const [plantCount, setPlantCount] = useState<number>(1);
    const { closeModal } = useModal();

    const existingPlant = plantId ? plants.find(p => p.id === plantId) : undefined;
    const { formState, setField, resetForm } = usePlantForm(existingPlant);

    useEffect(() => {
        if (!existingPlant && environmentId) {
            setField("environmentId", environmentId);
        }
    }, [environmentId, existingPlant, setField]);

    const validationErrors = validate(formState, plantId ? undefined : plantCount);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (hasValidationErrors(validationErrors)) return;

        if (existingPlant) {
            updatePlant({ ...existingPlant, ...formState });
            addToast("Pflanze aktualisiert");
        } else {
            for (let i = 0; i < plantCount; i++) {
                addPlant({ ...formState, id: crypto.randomUUID() });
            }
            addToast(plantCount > 1 ? `${plantCount} Pflanzen angelegt` : "Pflanze angelegt");
            resetForm();
        }

        closeModal();
    };

    return (
        <Form onSubmit={handleSubmit}>
            <Input
                data-demo="plant-name"
                label="Name"
                value={formState.title}
                onChange={(e) => setField("title", e.target.value)}
                error={validationErrors.title}
                placeholder="z.B. Tomate Cherry, Basilikum #3"
                required
            />

            <Input
                data-demo="plant-species"
                label="Art / Sorte"
                value={formState.species}
                onChange={(e) => setField("species", e.target.value)}
                error={validationErrors.species}
                placeholder="z.B. Solanum lycopersicum"
            />
            <FormHint>Optional — hilft bei sortenspezifischen Richtwerten.</FormHint>

            <FormField>
                <Select
                    data-demo="plant-environment"
                    label="Environment"
                    value={formState.environmentId}
                    onChange={(e) => setField("environmentId", e.target.value)}
                    error={validationErrors.environmentId}
                >
                    <option value="">Bitte wählen...</option>
                    {environments.map(env => (
                        <option key={env.id} value={env.id}>{env.name}</option>
                    ))}
                </Select>
            </FormField>

            <FormField>
                <Select
                    data-demo="plant-profile"
                    label="Profil"
                    value={formState.profile ?? "generic"}
                    onChange={(e) => setField("profile", e.target.value as ProfileKey)}
                >
                    {Object.values(PROFILES).map(p => (
                        <option key={p.key} value={p.key}>{p.label}</option>
                    ))}
                </Select>
            </FormField>
            <FormHint>Das Profil legt Zielwerte für pH, EC und Klima fest.</FormHint>

            {!plantId && (
                <Input
                    data-demo="plant-count"
                    label="Anzahl Pflanzen"
                    type="number"
                    value={plantCount}
                    onChange={(e) => setPlantCount(Math.max(1, Math.min(MAX_PLANT_COUNT, parseInt(e.target.value) || 1)))}
                    error={validationErrors.count}
                    min={1}
                    max={MAX_PLANT_COUNT}
                />
            )}

            <div>
                {onBack && (
                    <Button type="button" variant="secondary" onClick={onBack}>
                        Zurück
                    </Button>
                )}
                <Button type="button" onClick={handleSubmit}>
                    {plantId ? "Änderungen speichern" : "Speichern"}
                </Button>
            </div>
        </Form>
    );
};