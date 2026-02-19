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
import { useModal } from "@/context/ModalContext";

interface AddEnvironmentModalContentProps {
    environmentId: string;
}

function ClimateForm({ environmentId}: { environmentId: string }) {
    const { addHistoryData } = usePlantMonitor();
    const { formState, setClimateField } = useEnvironmentForm();
    const { validate } = useEnvironmentValidation();
    const { closeModal } = useModal();
    
    const validationErrors = validate(formState);
    
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        
        const climate = formState.climate;
        if (!climate || Object.values(climate).every(v => !v)) {
            alert("Bitte trage mindestens einen Messwert ein.");
            return;
        }
        
        const climateData = convertClimateInputToData(climate);
        
        const timestamp = Date.now()
        const entry: EnvironmentData_Historical = {
            id: timestamp.toString(),
            environmentId,
            timestamp,
            climate: climateData || {},
        };

        addHistoryData(environmentId, entry);
        closeModal()
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
                <Button variant="secondary" type="button" onClick={closeModal}>Abbrechen</Button>
            </FormField>
        </Form>
    );
}

export default function AddEnvironmentEventModalContent({ environmentId }: AddEnvironmentModalContentProps) {
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
                <ClimateForm environmentId={environmentId}/>
            )}
            {tab === "ereignis" && (
                <EnvironmentEventForm environmentId={environmentId} />
            )}
        </>
    );
}