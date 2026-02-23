"use client";

import { usePlantMonitor } from "@/context/PlantMonitorContext";
import { PlantData_Historical } from "@/types/plant";
import Form, { FormField, FormSectionTitle } from "@/components/Form/Form";
import { Button } from "@/components/Button/Button";
import { usePlantForm } from "@/hooks/usePlantForm";
import { usePlantValidation } from "@/hooks/usePlantValidation";
import { convertWaterInputToData } from "@/helpers/waterConverter";
import { useModal } from "@/context/ModalContext";
import { WaterInputs } from "../../../components/shared/WaterInputs";


export default function WaterForm({ plantId }: { plantId: string }) {
    const { addPlantHistoryData } = usePlantMonitor();
    const { formState, waterInput, setWaterInput } = usePlantForm();
    const { validate, validateWarnings } = usePlantValidation();
    const { closeModal } = useModal();

    const validationErrors = validate(formState, waterInput);
    const validationWarnings = validateWarnings(formState, waterInput);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (!waterInput || Object.values(waterInput).every(v => !v)) {
            alert("Bitte trage mindestens einen Messwert ein.");
            return;
        }

        const waterData = convertWaterInputToData(waterInput);

        const timestamp = Date.now();
        const entry: PlantData_Historical = {
            id: timestamp.toString(),
            plantId,
            timestamp,
            water: waterData || {},
        };

        addPlantHistoryData(plantId, entry);
        closeModal();
    };

    return (
        <Form onSubmit={handleSubmit}>
            <FormSectionTitle>Wassermessung eintragen</FormSectionTitle>
            <WaterInputs
                water={waterInput}
                onChange={setWaterInput}
                errors={validationErrors.water}
                warnings={validationWarnings.water}
            />
            <FormField>
                <Button type="submit">Speichern</Button>
                <Button variant="secondary" type="button" onClick={closeModal}>Abbrechen</Button>
            </FormField>
        </Form>
    );
}