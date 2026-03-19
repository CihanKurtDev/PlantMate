import Form, { FormField, FormSectionTitle } from "@/components/Form/Form";
import { getProfile } from "@/config/profiles";
import { useModal } from "@/context/ModalContext";
import { usePlantMonitor } from "@/context/PlantMonitorContext";
import { convertWaterInputToData } from "@/helpers/waterConverter";
import { usePlantForm } from "@/hooks/usePlantForm";
import { useWaterValidation } from "@/hooks/useWaterValidation";
import { PlantData_Historical } from "@/types/plant";
import { useCallback, useState } from "react";
import { WaterInputs } from "../../../components/shared/WaterInputs";
import { Button } from "@/components/Button/Button";
import { PlantData } from "@/types/plant";
import styles from "./WaterForm.module.scss";

interface WateringGroupProps {
    plants: PlantData[];
    fixedPlantId: string;
    selectedPlantIds: string[];
    onChange: (ids: string[]) => void;
}

export function WateringGroup({ plants, fixedPlantId, selectedPlantIds, onChange }: WateringGroupProps) {
    const [lastIdx, setLastIdx] = useState<number | null>(null);

    const fixedPlant = plants.find(p => p.id === fixedPlantId);
    const allSelected = new Set([fixedPlantId, ...selectedPlantIds]);

    const toggle = useCallback((id: string, idx: number, shiftKey: boolean, ctrlKey: boolean) => {
        if (id === fixedPlantId) return;

        if (shiftKey && lastIdx !== null) {
            const from = Math.min(lastIdx, idx);
            const to = Math.max(lastIdx, idx);
            const shouldSelect = !allSelected.has(id);
            const range = plants.slice(from, to + 1)
                .map(p => p.id!)
                .filter(pid => pid !== fixedPlantId);

            const next = new Set(selectedPlantIds);
            range.forEach(pid => shouldSelect ? next.add(pid) : next.delete(pid));
            onChange([...next]);
        } else if (ctrlKey) {
            const next = new Set(selectedPlantIds);
            allSelected.has(id) ? next.delete(id) : next.add(id);
            onChange([...next]);
            setLastIdx(idx);
        } else {
            const isOnlySelected = allSelected.has(id) && allSelected.size === 2;
            if (isOnlySelected) {
                onChange([]);
            } else {
                onChange([id]);
            }
            setLastIdx(idx);
        }
    }, [plants, fixedPlantId, selectedPlantIds, allSelected, lastIdx, onChange]);

    const selectAll = () => {
        onChange(plants.map(p => p.id!).filter(id => id !== fixedPlantId));
    };

    const selectNone = () => {
        onChange([]);
    };

    const selectSameSpecies = () => {
        if (!fixedPlant?.species) return;
        const ids = plants
            .filter(p => p.species === fixedPlant.species && p.id !== fixedPlantId)
            .map(p => p.id!);
        onChange(ids);
    };

    const totalSelected = allSelected.size;
    const total = plants.length;

    return (
        <div className={styles.wrapper}>
            <div className={styles.sectionLabel}>Pflanzen</div>

            <div className={styles.groupBox}>
                <div className={styles.toolbar}>
                    <button type="button" className={styles.tbtn} onClick={selectAll}>Alle</button>
                    <button type="button" className={styles.tbtn} onClick={selectNone}>Keine</button>
                    {fixedPlant?.species && (
                        <button type="button" className={styles.tbtn} onClick={selectSameSpecies}>
                            Gleiche Art
                        </button>
                    )}
                    <span className={styles.count}>{totalSelected} / {total}</span>
                </div>

                <div className={styles.list}>
                    {plants.map((plant, idx) => {
                        const isFixed = plant.id === fixedPlantId;
                        const isSelected = allSelected.has(plant.id!);
                        return (
                            <div
                                key={plant.id}
                                className={`${styles.item} ${isFixed ? styles.fixed : isSelected ? styles.selected : ""}`}
                                onClick={e => toggle(plant.id!, idx, e.shiftKey, e.ctrlKey || e.metaKey)}
                            >
                                <div className={styles.checkbox}>
                                    <CheckIcon />
                                </div>
                                <div className={styles.info}>
                                    <span className={styles.name}>
                                        {plant.title}
                                        {isFixed && <span className={styles.fixedBadge}>diese</span>}
                                    </span>
                                    {plant.species && (
                                        <span className={styles.species}>{plant.species}</span>
                                    )}
                                </div>
                                {plant.profile && (
                                    <span className={styles.tag}>{plant.profile}</span>
                                )}
                            </div>
                        );
                    })}
                </div>

                <div className={styles.hint}>
                    <kbd className={styles.kbd}>Strg</kbd>
                    <span className={styles.hintText}>einzeln</span>
                    <span className={styles.hintDot}>·</span>
                    <kbd className={styles.kbd}>Shift</kbd>
                    <span className={styles.hintText}>Bereich</span>
                </div>
            </div>
        </div>
    );
}

function CheckIcon() {
    return (
        <svg width="10" height="8" viewBox="0 0 10 8" fill="none">
            <path d="M1 4l3 3 5-6" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
    );
}

export default function WaterForm({ plantId }: { plantId: string }) {
    const { addPlantHistoryData, plants, environments } = usePlantMonitor();
    const { waterInput, setWaterInput } = usePlantForm();
    const { closeModal } = useModal();
    const [selectedPlantIds, setSelectedPlantIds] = useState<string[]>([]);

    const plant = plants.find(p => p.id === plantId);
    const environment = environments.find(e => e.id === plant?.environmentId);
    const plantsInEnv = plants.filter(p => p.environmentId === environment?.id);

    const allSelected = [plantId, ...selectedPlantIds.filter(id => id !== plantId)];

    const profiles = [...new Map(
        allSelected
            .map(id => plants.find(p => p.id === id))
            .filter(Boolean)
            .map(p => getProfile(p!.profile))
            .map(prof => [prof.key, prof])
    ).values()];

    const { errors: validationErrors, warnings: validationWarnings } = useWaterValidation(waterInput, profiles);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (Object.keys(validationErrors).length > 0) return;

        const waterData = convertWaterInputToData(waterInput);
        const timestamp = Date.now();

        allSelected.forEach((id, i) => {
            const entry: PlantData_Historical = {
                id: `${timestamp}-${i}`,
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

            {plantsInEnv.length > 1 && (
                <WateringGroup
                    plants={plantsInEnv}
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
                <Button variant="secondary" type="button" onClick={closeModal}>Abbrechen</Button>
            </FormField>
        </Form>
    );
}