"use client";

import { useSearchParams } from "next/navigation";
import { Input } from "@/components/Form/Input";
import { Button } from "@/components/Button/Button";
import Form, { FormField } from "@/components/Form/Form";
import { Select } from "@/components/Form/Select";
import type { EnvironmentType } from "@/types/environment";
import styles from "./EnvironmentForm.module.scss";
import { useEnvironmentForm } from "@/hooks/useEnvironmentForm";
import { usePlantMonitor } from "@/context/PlantMonitorContext";
import { useEnvironmentValidation } from "@/hooks/useEnvironmentValidation";

interface EnvironmentFormProps {
    onSaved?: (envId: string, nextStep: "plant" | "dashboard") => void;
    environmentId?: string,
}

export const EnvironmentForm = ({ onSaved, environmentId }: EnvironmentFormProps) => {
    const { environments, addEnvironment, updateEnvironment } = usePlantMonitor();
    const { validate } = useEnvironmentValidation();
    const searchParams = useSearchParams();
    const editId = environmentId ? environmentId : searchParams.get("editId");

    const existingEnvironment = editId
        ? environments.find(e => e.id === editId)
        : undefined;

    const { formState, setField } = useEnvironmentForm(existingEnvironment);
    
    const validationErrors = validate(formState);

    const handleSubmit = (e: React.FormEvent, nextStep: "plant" | "dashboard") => {
        e.preventDefault();

        const hasErrors = Object.keys(validationErrors).length > 0;
        if (hasErrors) {
            console.warn("Form has validation errors:", validationErrors);
            return;
        }


        if (editId && existingEnvironment) {
            const historical = [...(existingEnvironment.historical ?? [])];

            updateEnvironment({ ...existingEnvironment, ...formState, historical });
            if (onSaved) {
                onSaved(editId, nextStep);
            }
            return;
        }

        const envId = crypto.randomUUID();
       

        addEnvironment({ ...formState, id: envId });
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