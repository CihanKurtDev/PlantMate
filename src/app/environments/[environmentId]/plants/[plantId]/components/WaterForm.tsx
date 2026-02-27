"use client";

import { usePlantMonitor } from "@/context/PlantMonitorContext";
import { PlantData_Historical } from "@/types/plant";
import Form, { FormField, FormSectionTitle } from "@/components/Form/Form";
import { Button } from "@/components/Button/Button";
import { usePlantForm } from "@/hooks/usePlantForm";
import { convertWaterInputToData } from "@/helpers/waterConverter";
import { useModal } from "@/context/ModalContext";
import { WaterInputs } from "../../../components/shared/WaterInputs";
import { useWaterValidation } from "@/hooks/useWaterValidation";


export default function WaterForm({ plantId }: { plantId: string }) {
    const { addPlantHistoryData } = usePlantMonitor();
    const { waterInput, setWaterInput } = usePlantForm();
    const { errors, warnings } = useWaterValidation(waterInput);
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