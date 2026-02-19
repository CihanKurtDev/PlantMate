"use client"

import type { PlantData } from "@/types/plant";
import { Input } from "@/components/Form/Input";
import { Button } from "@/components/Button/Button";
import { usePlantMonitor } from "@/context/PlantMonitorContext";
import { useRouter, useSearchParams } from "next/navigation";
import { usePlantValidation } from "@/hooks/usePlantValidation";
import Form, { FormField, FormSectionTitle } from "@/components/Form/Form";
import { Select } from "@/components/Form/Select";
import { WaterInputs } from "../../[environmentId]/components/shared/WaterInputs";
import { usePlantForm } from "@/hooks/usePlantForm";
import { useEffect, useState } from "react";
import { convertWaterInputToData } from "@/helpers/waterConverter";
import { useModal } from "@/context/ModalContext";

interface PlantFormProps {
    environmentId?: string;
}

export const PlantForm = ({ environmentId }: PlantFormProps) => {
    const { addPlant, updatePlant, environments, plants } = usePlantMonitor();
    const { validate, validateWarnings } = usePlantValidation();
    const [plantCount, setPlantCount] = useState<number>(1);
    const searchParams = useSearchParams();
    const router = useRouter();
    const editId = environmentId ? environmentId : searchParams.get("editId");
    const { closeModal } = useModal();

    const existingPlant = editId
        ? plants.find(p => p.environmentId === editId)
        : undefined;

    const { formState, setField, resetForm } = usePlantForm(existingPlant);

    useEffect(() => {
        if (!existingPlant && environmentId) {
            setField("environmentId", environmentId);
        }
    }, [environmentId, existingPlant]);

    const validationErrors = validate(formState);
    const validationWarnings = validateWarnings(formState);

    const handleSubmitWithoutNav = (e: React.FormEvent) => {
        e.preventDefault();
        if (Object.keys(validationErrors).length > 0) return;

        const waterData = convertWaterInputToData(formState.water);

        if (editId && existingPlant) {
            updatePlant({
                ...existingPlant,
                ...formState,
                water: waterData,
            });
        } else {
            const plantData: PlantData = { ...formState, water: waterData };
            for (let i = 0; i < plantCount; i++) {
                addPlant({ ...plantData, id: crypto.randomUUID() });
            }
            resetForm();
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        handleSubmitWithoutNav(e);
        if (!editId && existingPlant) router.push("/dashboard");
        closeModal()
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

            {!editId && (
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
                {editId ? (
                    <Button type="button" onClick={handleSubmit}>
                        Änderungen speichern
                    </Button>
                ) : (
                    <>
                        <Button type="button" variant="secondary" onClick={handleSubmitWithoutNav}>
                            Speichern & Weiter
                        </Button>
                        <Button type="button" onClick={handleSubmit}>
                            Speichern & Zum Dashboard
                        </Button>
                    </>
                )}
            </div>
        </Form>
    );
};
