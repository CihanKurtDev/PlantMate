"use client";

import { Sprout, Leaf, Flower2, Sun, Moon, type LucideIcon } from "lucide-react";
import { getProfile } from "@/config/profiles";
import {
    getCurrentPlantStage,
    getPlantStageLabel,
    getPlantStageSourceShort,
    getLightScheduleLabel,
} from "@/helpers/plantStages";
import type { PlantData, PlantStage } from "@/types/plant";
import type { EnvironmentData } from "@/types/environment";
import { getLightCycleSnapshot } from "@/helpers/lightCycle";
import styles from "./PlantStatusHero.module.scss";

export const STAGE_ICON: Record<PlantStage, LucideIcon> = {
    SEEDLING: Sprout,
    VEGETATIVE: Leaf,
    FLOWERING: Flower2,
};

interface PlantStatusProps {
    plant: PlantData;
    environment?: EnvironmentData;
}

export function PlantStatusInfo({ plant, environment }: PlantStatusProps) {
    const profile = getProfile(plant.profile);
    const currentStage = getCurrentPlantStage(plant, environment);
    const sourceShort = getPlantStageSourceShort(plant, environment);
    const schedule = environment?.currentLightSchedule;
    const snapshot = schedule ? getLightCycleSnapshot(schedule) : null;
    const LightIcon = snapshot?.isLightOn ? Sun : Moon;

    return (
        <div className={styles.statusInfo}>
            <div className={styles.primaryRow}>
                <span className={styles.stageLabel}>{getPlantStageLabel(currentStage)}</span>
                <span className={styles.sourceLabel}>{sourceShort}</span>
            </div>

            <div className={styles.secondaryRow}>
                {schedule && (
                    <span className={styles.lightBadge}>
                        <LightIcon size={13} />
                        {getLightScheduleLabel(schedule)}
                        {snapshot && (
                            <> · {snapshot.currentPhaseLabel}</>
                        )}
                    </span>
                )}

                <span className={styles.profileChip}>
                    <span className={styles.profileDot} style={{ background: profile.color }} />
                    {profile.label}
                </span>
            </div>
        </div>
    );
}
