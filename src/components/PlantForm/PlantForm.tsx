"use client"

import { Input } from "@/components/Form/Input";
import { Button } from "@/components/Button/Button";
import { usePlantMonitor } from "@/context/PlantMonitorContext";
import { usePlantValidation } from "@/hooks/usePlantValidation";
import Form, { FormField, FormSectionTitle } from "@/components/Form/Form";
import { Select } from "@/components/Form/Select";
import { WaterInputs } from "../../app/environments/[environmentId]/components/shared/WaterInputs";
import { usePlantForm } from "@/hooks/usePlantForm";
import { useEffect, useState } from "react";
import { convertWaterInputToData } from "@/helpers/waterConverter";
import { useModal } from "@/context/ModalContext";
import { isSameDay } from "@/helpers/date";

interface PlantFormProps {
    environmentId?: string;
    plantId?: string;
}

export const PlantForm = ({ environmentId, plantId }: PlantFormProps) => {
    const { addPlant, updatePlant, environments, plants } = usePlantMonitor();
    const { validate, validateWarnings } = usePlantValidation();
    const [plantCount, setPlantCount] = useState<number>(1);
    const existingPlant = plantId ? plants.find(p => p.id === plantId) : undefined;
    const { closeModal } = useModal();
    const { formState, waterInput, setField, setWaterInput, resetForm } = usePlantForm(existingPlant);

    useEffect(() => {
        if (!existingPlant && environmentId) {
            setField("environmentId", environmentId);
        }
    }, [environmentId, existingPlant]);

    const validationErrors = validate(formState, waterInput);
    const validationWarnings = validateWarnings(formState, waterInput);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (Object.keys(validationErrors).length > 0) return;

        const waterData = convertWaterInputToData(waterInput);

        if (existingPlant) {
            const historical = [...(existingPlant.historical ?? [])];

            if (waterData) {
                const now = new Date();
                const todayEntry = historical.find(entry =>
                    isSameDay(new Date(entry.timestamp), now)
                );

                if (todayEntry) {
                    todayEntry.timestamp = Date.now();
                    todayEntry.water = waterData;
                } else {
                    historical.push({
                        id: crypto.randomUUID(),
                        plantId: existingPlant.id!,
                        timestamp: Date.now(),
                        water: waterData,
                    });
                }
            }

            updatePlant({ ...existingPlant, ...formState, historical });

        } else {
            for (let i = 0; i < plantCount; i++) {
                const id = crypto.randomUUID();
                const historical = waterData ? [{
                    id: crypto.randomUUID(),
                    plantId: id,
                    timestamp: Date.now(),
                    water: waterData,
                }] : undefined;

                addPlant({ ...formState, id, historical });
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

            <FormSectionTitle>Wasserwerte</FormSectionTitle>

            <WaterInputs
                water={waterInput}
                onChange={setWaterInput}
                errors={validationErrors.water}
                warnings={validationWarnings.water}
                hideAmountInput={true}
            />

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