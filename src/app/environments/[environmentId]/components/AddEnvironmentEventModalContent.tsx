"use client";

import { useState } from "react";
import { usePlantMonitor } from "@/context/PlantMonitorContext";
import { EnvironmentData_Historical } from "@/types/environment";
import Form, { FormField, FormSectionTitle } from "@/components/Form/Form";
import { Button } from "@/components/Button/Button";
import styles from "./AddEnvironmentEventModalContent.module.scss";
import EnvironmentEventForm from "./EnvironmentEventForm";
import { ClimateInputs } from "./shared/ClimateInputs";
import { useEnvironmentForm } from "@/hooks/useEnvironmentForm";
import { useEnvironmentValidation } from "@/hooks/useEnvironmentValidation";
import { convertClimateInputToData } from "@/helpers/climateConverter";

interface AddEnvironmentModalContentProps {
    environmentId: string;
    onClose: () => void;
}

function ClimateForm({ environmentId, onClose }: { environmentId: string; onClose: () => void }) {
    const { addHistoryData } = usePlantMonitor();
    const timestamp = Date.now()
    const { formState, setClimateField } = useEnvironmentForm();
    const { validate } = useEnvironmentValidation();

    const validationErrors = validate(formState);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        const climate = formState.climate;
        if (!climate || Object.values(climate).every(v => !v)) {
            alert("Bitte trage mindestens einen Messwert ein.");
            return;
        }

        const climateData = convertClimateInputToData(climate);

        const entry: EnvironmentData_Historical = {
            id: timestamp.toString(),
            environmentId,
            timestamp,
            climate: climateData || {},
        };

        addHistoryData(environmentId, entry);
        onClose();
    };

    return (
        <Form onSubmit={handleSubmit}>
            <FormSectionTitle>Klimamessung eintragen</FormSectionTitle>
            <ClimateInputs
                climate={formState.climate}
                onChange={setClimateField}
                errors={validationErrors.climate}
            />
            <FormField>
                <Button type="submit">Speichern</Button>
                <Button variant="secondary" type="button" onClick={onClose}>Abbrechen</Button>
            </FormField>
        </Form>
    );
}

export default function AddEnvironmentEventModalContent({ environmentId, onClose }: AddEnvironmentModalContentProps) {
    const [tab, setTab] = useState<"messung" | "ereignis">("messung");

    return (
        <>
            <div className={styles.tabs}>
                <Button
                    style={{width: "100%", border: "none"}}
                    isActive={tab === "messung"}
                    onClick={() => setTab("messung")}
                >
                    📊 Klimamessung
                </Button>
                <Button
                    style={{width: "100%"}}
                    isActive={tab === "ereignis"}
                    onClick={() => setTab("ereignis")}
                >
                    📋 Ereignis
                </Button>
            </div>

            {tab === "messung" && (
                <ClimateForm environmentId={environmentId} onClose={onClose} />
            )}
            {tab === "ereignis" && (
                <EnvironmentEventForm environmentId={environmentId} onCancel={onClose} />
            )}
        </>
    );
}