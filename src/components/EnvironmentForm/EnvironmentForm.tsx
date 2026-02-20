"use client";

import { useSearchParams } from "next/navigation";
import { Input } from "@/components/Form/Input";
import { Button } from "@/components/Button/Button";
import Form, { FormField, FormSectionTitle } from "@/components/Form/Form";
import { Select } from "@/components/Form/Select";
import type { EnvironmentType } from "@/types/environment";
import { ClimateInputs } from "../../app/environments/[environmentId]/components/shared/ClimateInputs";
import styles from "./EnvironmentForm.module.scss";
import { useEnvironmentForm } from "@/hooks/useEnvironmentForm";
import { usePlantMonitor } from "@/context/PlantMonitorContext";
import { convertClimateInputToData } from "@/helpers/climateConverter";
import { useEnvironmentValidation } from "@/hooks/useEnvironmentValidation";
import { isSameDay } from "@/helpers/date";

interface EnvironmentFormProps {
    onSaved?: (envId: string, nextStep: "plant" | "dashboard") => void;
    environmentId?: string,
}

export const EnvironmentForm = ({ onSaved, environmentId }: EnvironmentFormProps) => {
    const { environments, addEnvironment, updateEnvironment } = usePlantMonitor();
    const { validate, validateWarnings } = useEnvironmentValidation();
    const searchParams = useSearchParams();
    const editId = environmentId ? environmentId : searchParams.get("editId");

    const existingEnvironment = editId
        ? environments.find(e => e.id === editId)
        : undefined;

    const { formState, climateInput, setField, setClimateInput } = useEnvironmentForm(existingEnvironment);
    
    const validationErrors = validate(formState, climateInput);
    const validationWarnings = validateWarnings(formState, climateInput);

    const handleSubmit = (e: React.FormEvent, nextStep: "plant" | "dashboard") => {
        e.preventDefault();

        const hasErrors = Object.keys(validationErrors).length > 0;
        if (hasErrors) {
            console.warn("Form has validation errors:", validationErrors);
            return;
        }

        const climateData = convertClimateInputToData(climateInput);

        if (editId && existingEnvironment) {
            const historical = [...(existingEnvironment.historical ?? [])];

            if (climateData) {
                const now = new Date();
                const todayEntry = historical.find(entry => isSameDay(new Date(entry.timestamp), now));

                if (todayEntry) {
                    todayEntry.timestamp = Date.now();
                    todayEntry.climate = climateData;
                } else {
                    historical.push({
                        id: crypto.randomUUID(),
                        environmentId: editId,
                        timestamp: Date.now(),
                        climate: climateData,
                    });
                }
            }

            updateEnvironment({ ...existingEnvironment, ...formState, historical });
            if (onSaved) {
                onSaved(editId, nextStep);
            }
            return;
        }

        const envId = crypto.randomUUID();
        const historical = climateData ? [{
            id: crypto.randomUUID(),
            environmentId: envId,
            timestamp: Date.now(),
            climate: climateData,
        }] : undefined;

        addEnvironment({ ...formState, id: envId, historical });
        if (onSaved) {
            onSaved(envId, nextStep);
        }
    };

    return (
        <Form onSubmit={(e) => handleSubmit(e, "dashboard")}>
            <Input
                label="Name"
                value={formState.name}
                onChange={(e) => setField("name", e.target.value)}
                error={validationErrors.name}
            />

            <FormField>
                <Select
                    label="Typ"
                    value={formState.type}
                    onChange={(e) => setField("type", e.target.value as EnvironmentType)}
                >
                    <option value="ROOM">Room</option>
                    <option value="TENT">Tent</option>
                    <option value="GREENHOUSE">Greenhouse</option>
                </Select>
            </FormField>

            <Input
                label="Location"
                value={formState.location ?? ""}
                onChange={(e) => setField("location", e.target.value)}
                error={validationErrors.location}
            />

            <FormSectionTitle>Klimadaten</FormSectionTitle>

            <ClimateInputs
                climate={climateInput}
                onChange={setClimateInput}
                errors={validationErrors.climate}
                warnings={validationWarnings.climate}
            />

            <div className={styles.buttonRow}>
                {editId ? (
                    <Button type="button" variant="primary" onClick={(e) => handleSubmit(e, "dashboard")}>
                        Änderungen speichern
                    </Button>
                ) : (
                    <>
                        <Button type="button" variant="primary" onClick={(e) => handleSubmit(e, "plant")}>
                            Weiter zu Pflanzen
                        </Button>
                        <Button type="button" variant="secondary" onClick={(e) => handleSubmit(e, "dashboard")}>
                            Zum Dashboard
                        </Button>
                    </>
                )}
            </div>
        </Form>
    );
};