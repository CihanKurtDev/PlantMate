"use client";

import { usePlantMonitor } from "@/context/PlantMonitorContext";
import { EnvironmentData_Historical } from "@/types/environment";
import Form, { FormField, FormSectionTitle } from "@/components/Form/Form";
import { Button } from "@/components/Button/Button";
import { ClimateInputs } from "./shared/ClimateInputs";
import { useEnvironmentForm } from "@/hooks/useEnvironmentForm";
import { convertClimateInputToData } from "@/helpers/climateConverter";
import { useModal } from "@/context/ModalContext";
import { useClimateValidation } from "@/hooks/useClimateValidation";

export default function ClimateForm({ environmentId } : { environmentId: string }) {
    const { addHistoryData } = usePlantMonitor();
    const { climateInput, setClimateInput } = useEnvironmentForm();
    const { errors, warnings } = useClimateValidation(climateInput);
    const { closeModal } = useModal();

    const validationErrors = errors;
    const validationWarnings = warnings;

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        const hasErrors = Object.keys(validationErrors).length > 0;
        if (hasErrors) {
            console.warn("Form has validation errors:", validationErrors);
            return;
        }

        const climateData = convertClimateInputToData(climateInput);

        const timestamp = Date.now();
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
                climate={climateInput}
                onChange={setClimateInput}
                errors={validationErrors}
                warnings={validationWarnings}
            />
            <FormField>
                <Button type="submit">Speichern</Button>
                <Button variant="secondary" type="button" onClick={closeModal}>Abbrechen</Button>
            </FormField>
        </Form>
    );
}