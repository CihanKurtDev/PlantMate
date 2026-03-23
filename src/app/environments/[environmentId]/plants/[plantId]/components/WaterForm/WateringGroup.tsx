import { useState } from "react";
import { PlantData } from "@/types/plant";
import { Button } from "@/components/Button/Button";
import Checkbox from "@/components/Checkbox/Checkbox";
import styles from "./WaterForm.module.scss";
import { useWateringGroup } from "./useWateringGroup";

function buildSummary(allSelectedIds: Set<string>, plants: PlantData[]): string {
    const selectedPlantNames = [...allSelectedIds]
        .map((id) => plants.find((p) => p.id === id)?.title)
        .filter(Boolean) as string[];
    const visible = selectedPlantNames.slice(0, 2);
    const overflow = selectedPlantNames.length - visible.length;
    return overflow > 0
        ? `${visible.join(", ")} +${overflow} weitere`
        : visible.join(", ");
}

interface WateringGroupProps {
    plants: PlantData[];
    fixedPlantId: string;
    selectedPlantIds: string[];
    onChange: (ids: string[]) => void;
}

export function WateringGroup({
    plants,
    fixedPlantId,
    selectedPlantIds,
    onChange,
}: WateringGroupProps) {
    const [isOpen, setIsOpen] = useState(false);

    const {
        allSelectedIds,
        allNonFixedSelected,
        sameProfileIds,
        allSameProfileSelected,
        toggle,
        toggleAll,
        toggleSameProfile,
    } = useWateringGroup({ plants, fixedPlantId, selectedPlantIds, onChange });

    const summary = buildSummary(allSelectedIds, plants);

    return (
        <fieldset className={styles.groupField}>
            <legend className={styles.groupLabel}>Pflanzen</legend>
            <div className={styles.groupBox}>
                <button
                    type="button"
                    className={styles.groupToggle}
                    onClick={() => setIsOpen((prev) => !prev)}
                    aria-expanded={isOpen}
                >
                    <span className={styles.groupToggleSummary}>{summary}</span>
                    <svg
                        className={[styles.groupToggleChevron, isOpen ? styles.open : ""].join(" ")}
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

                <div className={[styles.groupContentWrapper, isOpen ? styles.open : ""].join(" ")}>
                    <div className={styles.groupContent}>
                        <div className={styles.toolbar}>
                            <Button
                                type="button"
                                variant="secondary"
                                size="sm"
                                className={[
                                    styles.toolbarButton,
                                    allNonFixedSelected ? styles.toolbarButtonActive : "",
                                ].join(" ")}
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
                                    className={[
                                        styles.toolbarButton,
                                        allSameProfileSelected ? styles.toolbarButtonActive : "",
                                    ].join(" ")}
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

                                const itemClassName = [
                                    styles.item,
                                    isFixed ? styles.fixed : "",
                                    isSelected && !isFixed ? styles.selected : "",
                                ].join(" ");

                                return (
                                    <li key={plant.id}>
                                        <Checkbox
                                            checked={isSelected}
                                            disabled={isFixed}
                                            disabledReason={
                                                isFixed
                                                    ? "Diese Pflanze ist die Ausgangspflanze und kann nicht abgewählt werden."
                                                    : undefined
                                            }
                                            onChange={() => toggle(plant.id!)}
                                            variant={isFixed ? "success" : "default"}
                                            className={itemClassName}
                                        >
                                            <div className={styles.info}>
                                                <span className={styles.name}>{plant.title}</span>
                                                {plant.species && (
                                                    <span className={styles.species}>
                                                        {plant.species}
                                                    </span>
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
        </fieldset>
    );
}