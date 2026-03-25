"use client";

import { usePlantMonitor } from "@/context/PlantMonitorContext";
import { EnvironmentData_Historical } from "@/types/environment";
import Form, { FormField, FormSectionTitle } from "@/components/Form/Form";
import { Button } from "@/components/Button/Button";
import { ClimateInputs } from "../shared/ClimateInputs";
import { convertClimateInputToData } from "@/helpers/climateConverter";
import { useModal } from "@/context/ModalContext";
import { useClimateValidation } from "@/hooks/useClimateValidation";
import { useClimateForm } from "@/hooks/useClimateForm";
import { getProfile, ProfileKey } from "@/config/profiles";
import { ClimateProfileInfo } from "./ClimateProfileInfo";

interface ClimateFormProps {
    environmentId: string;
    entryId?: string;
}

export default function ClimateForm({ environmentId, entryId }: ClimateFormProps) {
    const { environments, addHistoryData, updateHistoryData, getPlantsByEnvironment } = usePlantMonitor();
    const { closeModal } = useModal();

    const environment = environments.find((e) => e.id === environmentId);
    const plants = getPlantsByEnvironment(environmentId);

    const uniqueProfileKeys = [...new Set(plants.map((p) => p.profile).filter(Boolean))] as ProfileKey[];
    const profiles = uniqueProfileKeys.length > 0
        ? uniqueProfileKeys.map((key) => getProfile(key))
        : [getProfile("generic")];

    const existingEntry = entryId
        ? environment?.historical?.find((h) => h.id === entryId)
        : undefined;

    const { climateInput, setClimateInput } = useClimateForm(existingEntry);
    const { errors: validationErrors, warnings: validationWarnings } = useClimateValidation(climateInput, profiles);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (Object.keys(validationErrors).length > 0) {
            console.warn("Form has validation errors:", validationErrors);
            return;
        }

        const climateData = convertClimateInputToData(climateInput);
        if (!climateData) {
            console.warn("Keine Klimadaten eingegeben.");
            return;
        }

        const timestamp = Date.now();
        const entry: EnvironmentData_Historical = {
            id: existingEntry?.id ?? timestamp.toString(),
            environmentId,
            timestamp: existingEntry?.timestamp ?? timestamp,
            climate: climateData,
        };

        if (existingEntry) {
            updateHistoryData(environmentId, entry);
        } else {
            addHistoryData(environmentId, entry);
        }

        closeModal();
    };

    return (
        <Form onSubmit={handleSubmit}>
            <FormSectionTitle>
                {existingEntry ? "Klimamessung bearbeiten" : "Klimamessung eintragen"}
            </FormSectionTitle>
            <ClimateProfileInfo profiles={profiles} />
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