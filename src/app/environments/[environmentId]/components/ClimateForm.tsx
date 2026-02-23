"use client";

import { usePlantMonitor } from "@/context/PlantMonitorContext";
import { EnvironmentData_Historical } from "@/types/environment";
import Form, { FormField, FormSectionTitle } from "@/components/Form/Form";
import { Button } from "@/components/Button/Button";
import { ClimateInputs } from "./shared/ClimateInputs";
import { useEnvironmentForm } from "@/hooks/useEnvironmentForm";
import { useEnvironmentValidation } from "@/hooks/useEnvironmentValidation";
import { convertClimateInputToData } from "@/helpers/climateConverter";
import { useModal } from "@/context/ModalContext";

export default function ClimateForm({ environmentId } : { environmentId: string }) {
    const { addHistoryData } = usePlantMonitor();
    const { formState, climateInput, setClimateInput } = useEnvironmentForm();
    const { validate, validateWarnings } = useEnvironmentValidation();
    const { closeModal } = useModal();

    const validationErrors = validate(formState, climateInput);
    const validationWarnings = validateWarnings(formState, climateInput);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (!climateInput || Object.values(climateInput).every(v => !v)) {
            alert("Bitte trage mindestens einen Messwert ein.");
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
                errors={validationErrors.climate}
                warnings={validationWarnings.climate}
            />
            <FormField>
                <Button type="submit">Speichern</Button>
                <Button variant="secondary" type="button" onClick={closeModal}>Abbrechen</Button>
            </FormField>
        </Form>
    );
}