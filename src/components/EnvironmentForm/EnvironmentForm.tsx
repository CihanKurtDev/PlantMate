"use client";

import { useSearchParams } from "next/navigation";
import { Input } from "@/components/Form/Input";
import { Button } from "@/components/Button/Button";
import Form, { FormField, FormHint } from "@/components/Form/Form";
import { Select } from "@/components/Form/Select";
import type { EnvironmentType } from "@/types/environment";
import styles from "./EnvironmentForm.module.scss";
import { useEnvironmentForm } from "@/hooks/useEnvironmentForm";
import { useEnvironmentValidation } from "@/hooks/useEnvironmentValidation";
import { hasValidationErrors } from "@/helpers/validationUtils";
import { useEnvironment } from "@/context/EnvironmentContext";
import { useToast } from "@/context/ToastContext";

interface EnvironmentFormProps {
    onSaved?: (envId: string, nextStep: "plant" | "dashboard") => void;
    environmentId?: string;
    existingId?: string;
}

export const EnvironmentForm = ({
    onSaved,
    environmentId,
    existingId,
}: EnvironmentFormProps) => {
    const { environments, addEnvironment, updateEnvironment } = useEnvironment();
    const { validate } = useEnvironmentValidation();
    const { addToast } = useToast();
    const searchParams = useSearchParams();
    const editId = environmentId ?? searchParams.get("editId");

    const existingEnvironment = editId
        ? environments.find((e) => e.id === editId)
        : existingId
          ? environments.find((e) => e.id === existingId)
          : undefined;

    const { formState, setField } = useEnvironmentForm(existingEnvironment);
    const { errors: validationErrors } = validate(formState);

    const handleSubmit = (e: React.FormEvent, nextStep: "plant" | "dashboard") => {
        e.preventDefault();
        if (hasValidationErrors(validationErrors)) return;

        const finalId = existingEnvironment?.id || crypto.randomUUID();

        if (!existingEnvironment) {
            addEnvironment({ ...formState, id: finalId });
            addToast("Umgebung erfolgreich erstellt");
        } else {
            updateEnvironment({ ...existingEnvironment, ...formState });
            addToast("Änderungen gespeichert");
        }

        onSaved?.(finalId, nextStep);
    };

    return (
        <Form onSubmit={(e) => handleSubmit(e, "dashboard")}>
            <Input
                data-demo="environment-name"
                label="Name"
                value={formState.name}
                onChange={(e) => setField("name", e.target.value)}
                error={validationErrors.name}
                placeholder="z.B. Gewächshaus Nord, Anzuchtzelt"
            />

            <FormField>
                <Select
                    data-demo="environment-type"
                    label="Typ"
                    value={formState.type}
                    onChange={(e) => setField("type", e.target.value as EnvironmentType)}
                >
                    <option value="ROOM">🏠 Room — offener Raum, natürliche Belüftung</option>
                    <option value="TENT">⛺ Tent — geschlossenes Growzelt, kontrolliertes Klima</option>
                    <option value="GREENHOUSE">🌱 Greenhouse — Gewächshaus mit Tageslicht</option>
                </Select>
            </FormField>

            <Input
                data-demo="environment-location"
                label="Location"
                value={formState.location ?? ""}
                onChange={(e) => setField("location", e.target.value)}
                error={validationErrors.location}
                placeholder="z.B. Keller, Dachboden, Garage"
            />
            <FormHint>Hilft dir später dabei, mehrere Umgebungen auseinanderzuhalten.</FormHint>

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