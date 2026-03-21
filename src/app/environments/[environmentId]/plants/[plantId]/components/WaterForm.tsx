import Form, { FormField, FormSectionTitle } from "@/components/Form/Form";
import { getProfile } from "@/config/profiles";
import { useModal } from "@/context/ModalContext";
import { usePlantMonitor } from "@/context/PlantMonitorContext";
import { convertWaterInputToData } from "@/helpers/waterConverter";
import { usePlantForm } from "@/hooks/usePlantForm";
import { useWaterValidation } from "@/hooks/useWaterValidation";
import { PlantData_Historical, PlantData } from "@/types/plant";
import { useState } from "react";
import { WaterInputs } from "../../../components/shared/WaterInputs";
import { Button } from "@/components/Button/Button";
import Checkbox from "@/components/Checkbox/Checkbox";
import styles from "./WaterForm.module.scss";

function plantsShareProfile(plant: PlantData, otherPlant: PlantData): boolean {
    if (!plant.profile) return false;
    return plant.profile === otherPlant.profile;
}

interface WateringGroupProps {
    plants: PlantData[];
    fixedPlantId: string;
    selectedPlantIds: string[];
    onChange: (ids: string[]) => void;
}

export function WateringGroup({ plants, fixedPlantId, selectedPlantIds, onChange }: WateringGroupProps) {
    const [isOpen, setIsOpen] = useState(false);

    const fixedPlant = plants.find((plant) => plant.id === fixedPlantId);
    const allSelectedIds = new Set([fixedPlantId, ...selectedPlantIds]);

    const nonFixedIds = plants.map((plant) => plant.id!).filter((id) => id !== fixedPlantId);
    const allNonFixedSelected = nonFixedIds.every((id) => selectedPlantIds.includes(id));

    const sameProfileIds = fixedPlant
        ? plants
              .filter((plant) => plant.id !== fixedPlantId && plantsShareProfile(plant, fixedPlant))
              .map((plant) => plant.id!)
        : [];

    const allSameProfileSelected =
        sameProfileIds.length > 0 && sameProfileIds.every((id) => selectedPlantIds.includes(id));

    const toggle = (plantId: string) => {
        if (plantId === fixedPlantId) return;
        const next = new Set(selectedPlantIds);
        next.has(plantId) ? next.delete(plantId) : next.add(plantId);
        onChange([...next]);
    };

    const toggleAll = () => {
        onChange(allNonFixedSelected ? [] : nonFixedIds);
    };

    const toggleSameProfile = () => {
        if (allSameProfileSelected) {
            onChange(selectedPlantIds.filter((id) => !sameProfileIds.includes(id)));
        } else {
            onChange([...new Set([...selectedPlantIds, ...sameProfileIds])]);
        }
    };

    const summary = (() => {
        const selectedPlantNames = [...allSelectedIds]
            .map((id) => plants.find((p) => p.id === id)?.title)
            .filter(Boolean) as string[];
        const visible = selectedPlantNames.slice(0, 2);
        const overflow = selectedPlantNames.length - visible.length;
        return overflow > 0
            ? `${visible.join(", ")} +${overflow} weitere`
            : visible.join(", ");
    })();

    return (
        <div className={styles.groupField}>
            <span className={styles.groupLabel}>Pflanzen</span>
            <div className={styles.groupBox}>
                <button
                    type="button"
                    className={styles.groupToggle}
                    onClick={() => setIsOpen((prev) => !prev)}
                    aria-expanded={isOpen}
                >
                    <span className={styles.groupToggleSummary}>{summary}</span>
                    <svg
                        className={`${styles.groupToggleChevron} ${isOpen ? styles.open : ""}`}
                        width="14"
                        height="14"
                        viewBox="0 0 14 14"
                        fill="none"
                    >
                        <polyline
                            points="2,4 7,10 12,4"
                            stroke="currentColor"
                            strokeWidth="1.5"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        />
                    </svg>
                </button>

                <div className={`${styles.groupContentWrapper} ${isOpen ? styles.open : ""}`}>
                    <div className={styles.groupContent}>
                        <div className={styles.toolbar}>
                            <Button
                                type="button"
                                variant="secondary"
                                size="sm"
                                className={`${styles.toolbarButton} ${allNonFixedSelected ? styles.toolbarButtonActive : ""}`}
                                onClick={toggleAll}
                                aria-pressed={allNonFixedSelected}
                            >
                                Alle
                            </Button>
                            {sameProfileIds.length > 0 && (
                                <Button
                                    type="button"
                                    variant="secondary"
                                    size="sm"
                                    className={`${styles.toolbarButton} ${allSameProfileSelected ? styles.toolbarButtonActive : ""}`}
                                    onClick={toggleSameProfile}
                                    aria-pressed={allSameProfileSelected}
                                >
                                    Gleiches Profil
                                </Button>
                            )}
                        </div>

                        <ul className={styles.list}>
                            {plants.map((plant) => {
                                const isFixed = plant.id === fixedPlantId;
                                const isSelected = allSelectedIds.has(plant.id!);

                                return (
                                    <li key={plant.id}>
                                        <Checkbox
                                            checked={isSelected}
                                            disabled={isFixed}
                                            onChange={() => toggle(plant.id!)}
                                            variant={isFixed ? "success" : "default"}
                                            className={`${styles.item} ${isFixed ? styles.fixed : ""} ${isSelected && !isFixed ? styles.selected : ""}`}
                                        >
                                            <div className={styles.info}>
                                                <span className={styles.name}>{plant.title}</span>
                                                {plant.species && (
                                                    <span className={styles.species}>{plant.species}</span>
                                                )}
                                            </div>
                                            {plant.profile && (
                                                <span className={styles.tag}>{plant.profile}</span>
                                            )}
                                        </Checkbox>
                                    </li>
                                );
                            })}
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default function WaterForm({ plantId }: { plantId: string }) {
    const { addPlantHistoryData, plants, environments } = usePlantMonitor();
    const { waterInput, setWaterInput } = usePlantForm();
    const { closeModal } = useModal();
    const [selectedPlantIds, setSelectedPlantIds] = useState<string[]>([]);

    const plant = plants.find((plant) => plant.id === plantId);
    const environment = environments.find((env) => env.id === plant?.environmentId);
    const plantsInEnvironment = plants.filter((plant) => plant.environmentId === environment?.id);

    const allSelectedIds = [plantId, ...selectedPlantIds.filter((id) => id !== plantId)];

    const selectedPlants = allSelectedIds
        .map((id) => plants.find((plant) => plant.id === id))
        .filter(Boolean);

    const uniqueProfileKeys = [...new Set(selectedPlants.map((plant) => plant!.profile).filter(Boolean))];
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