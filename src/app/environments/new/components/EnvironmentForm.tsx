"use client";

import { Input } from "@/components/Form/Input";
import { Button } from "@/components/Button/Button";
import Form, { FormField, FormSectionTitle } from "@/components/Form/Form";
import { Select } from "@/components/Form/Select";
import { useState } from "react";
import { useClimateValidation } from "@/hooks/useClimateValidation";
import type { ClimateData, EnvironmentData, EnvironmentType } from "@/types/environment";
import { ClimateInputs } from "../../[environmentId]/components/shared/ClimateInputs";
import styles from "./EnvironmentForm.module.scss";

interface EnvironmentFormProps {
    initialData?: EnvironmentData;
    onSaved?: (envId: string, nextStep: "plant" | "dashboard") => void;
}

export const EnvironmentForm = ({ initialData, onSaved }: EnvironmentFormProps) => {
    const [formState, setFormState] = useState<EnvironmentData>({
        id: initialData?.id ?? crypto.randomUUID(),
        name: initialData?.name ?? "",
        type: initialData?.type ?? "ROOM",
        location: initialData?.location,
        climate: initialData?.climate,
    });

    const { errors, warnings } = useClimateValidation(formState.climate);

    const setField = (field: keyof EnvironmentData, value: any) => {
        setFormState(prev => ({ ...prev, [field]: value }));
    };

    const setClimateField = (c: ClimateData) => {
        setFormState(prev => ({ ...prev, climate: c }));
    };

    const handleSubmit = (e: React.FormEvent, nextStep: "plant" | "dashboard") => {
        e.preventDefault();

        if (Object.keys(errors).length > 0) return;

        if (onSaved) {
            onSaved(formState.id, nextStep);
        }
    };

    return (
        <Form onSubmit={(e) => handleSubmit(e, "dashboard")}>
            <Input
                label="Name"
                value={formState.name}
                onChange={(e) => setField("name", e.target.value)}
                error={formState.name === "" ? "Name erforderlich" : undefined}
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
            />

            <FormSectionTitle>Klimadaten</FormSectionTitle>

            <ClimateInputs
                climate={formState.climate}
                onChange={setClimateField}
                errors={errors}
                warnings={warnings}
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
