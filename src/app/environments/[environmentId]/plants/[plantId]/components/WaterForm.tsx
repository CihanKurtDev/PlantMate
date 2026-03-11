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
import { getProfile } from "@/config/profiles";

export default function WaterForm({ plantId }: { plantId: string }) {
    const { addPlantHistoryData, plants, environments } = usePlantMonitor();
    const { waterInput, setWaterInput } = usePlantForm();
    const { closeModal } = useModal();

    const plant = plants.find(p => p.id === plantId);
    const environment = environments.find(e => e.id === plant?.environmentId);
    const profile = getProfile(environment?.profile);

    const { errors: validationErrors, warnings: validationWarnings } = useWaterValidation(waterInput, profile);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (Object.keys(validationErrors).length > 0) {
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