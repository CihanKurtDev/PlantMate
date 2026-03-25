import Form, { FormField, FormSectionTitle } from "@/components/Form/Form";
import { getProfile } from "@/config/profiles";
import { useModal } from "@/context/ModalContext";
import { usePlantMonitor } from "@/context/PlantMonitorContext";
import { convertWaterInputToData } from "@/helpers/waterConverter";
import { usePlantForm } from "@/hooks/usePlantForm";
import { useWaterValidation } from "@/hooks/useWaterValidation";
import { PlantData_Historical } from "@/types/plant";
import { useState } from "react";
import { Button } from "@/components/Button/Button";
import { WaterInputs } from "@/app/environments/[environmentId]/plants/[plantId]/components/WaterForm/WaterInputs";
import { WateringGroup } from "./WateringGroup";

export default function WaterForm({ plantId }: { plantId: string }) {
    const { addPlantHistoryData, plants, environments } = usePlantMonitor();
    const { waterInput, setWaterInput } = usePlantForm();
    const { closeModal } = useModal();
    const [selectedPlantIds, setSelectedPlantIds] = useState<string[]>([]);

    const plant = plants.find((plant) => plant.id === plantId);
    const environment = environments.find((env) => env.id === plant?.environmentId);
    const plantsInEnvironment = plants.filter((p) => p.environmentId === environment?.id);

    const allSelectedIds = [plantId, ...selectedPlantIds.filter((id) => id !== plantId)];

    const selectedPlants = allSelectedIds
        .map((id) => plants.find((plant) => plant.id === id))
        .filter(Boolean);

    const uniqueProfileKeys = [
        ...new Set(selectedPlants.map((plant) => plant!.profile).filter(Boolean)),
    ];
    const profiles = uniqueProfileKeys.map((key) => getProfile(key));

    const { errors: validationErrors, warnings: validationWarnings } = useWaterValidation(
        waterInput,
        profiles
    );

    const handleSubmit = (event: React.FormEvent) => {
        event.preventDefault();
        if (Object.keys(validationErrors).length > 0) return;

        const waterData = convertWaterInputToData(waterInput);
        const timestamp = Date.now();

        allSelectedIds.forEach((id, index) => {
            const entry: PlantData_Historical = {
                id: `${timestamp}-${index}`,
                plantId: id,
                timestamp,
                water: waterData || {},
            };
            addPlantHistoryData(id, entry);
        });

        closeModal();
    };

    return (
        <Form onSubmit={handleSubmit}>
            <FormSectionTitle>Wassermessung eintragen</FormSectionTitle>

            {plantsInEnvironment.length > 1 && (
                <WateringGroup
                    plants={plantsInEnvironment}
                    fixedPlantId={plantId}
                    selectedPlantIds={selectedPlantIds}
                    onChange={setSelectedPlantIds}
                />
            )}

            <WaterInputs
                water={waterInput}
                onChange={setWaterInput}
                errors={validationErrors}
                warnings={validationWarnings}
            />

            <FormField>
                <Button type="submit">Speichern</Button>
                <Button variant="secondary" type="button" onClick={closeModal}>
                    Abbrechen
                </Button>
            </FormField>
        </Form>
    );
}