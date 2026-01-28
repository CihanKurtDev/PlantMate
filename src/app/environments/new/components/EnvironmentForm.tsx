"use client";

import { Input } from "@/components/Form/Input";
import { Button } from "@/components/Button/Button";
import Form, { FormField, FormSectionTitle } from "@/components/Form/Form";
import { Select } from "@/components/Form/Select";
import type { EnvironmentData, EnvironmentType } from "@/types/environment";
import { ClimateInputs } from "../../[environmentId]/components/shared/ClimateInputs";
import styles from "./EnvironmentForm.module.scss";
import { useEnvironmentForm } from "@/hooks/useEnvironmentForm";
import { usePlantMonitor } from "@/context/PlantMonitorContext";
import { convertClimateInputToData } from "@/helpers/climateConverter";
import { useEnvironmentValidation } from "@/hooks/useEnvironmentValidation";

interface EnvironmentFormProps {
    initialData?: EnvironmentData;
    onSaved?: (envId: string, nextStep: "plant" | "dashboard") => void;
}

export const EnvironmentForm = ({ initialData, onSaved }: EnvironmentFormProps) => {
    const { formState, setField, setClimateField } = useEnvironmentForm(initialData)
    const { validate, validateWarnings } = useEnvironmentValidation();
    const { addEnvironment } = usePlantMonitor();
    
     const validationErrors = validate(formState);
    const validationWarnings = validateWarnings(formState);

    const handleSubmit = (e: React.FormEvent, nextStep: "plant" | "dashboard") => {
        e.preventDefault();

        const hasErrors = Object.keys(validationErrors).length > 0;
        
        if (hasErrors) {
            console.warn("Form has validation errors:", validationErrors);
            return;
        }

        const climateData = convertClimateInputToData(formState.climate);
        const envId = crypto.randomUUID();

        addEnvironment({ ...formState, climate: climateData, id: envId });

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
                climate={formState.climate}
                onChange={setClimateField}
                errors={validationErrors.climate}
                warnings={validationWarnings.climate}
            />

            <div className={styles.buttonRow}>
                <Button type="button" variant="primary" onClick={(e) => handleSubmit(e, "plant")}>
                    Weiter zu Pflanzen
                </Button>
                <Button type="button" variant="secondary" onClick={(e) => handleSubmit(e, "dashboard")}>
                    Zum Dashboard
                </Button>
            </div>
        </Form>
    );
};
