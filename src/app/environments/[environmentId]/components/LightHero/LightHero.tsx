"use client";

import { useEffect, useState } from "react";
import { Sun, Moon, SunDim } from "lucide-react";
import {
    getLightCycleSnapshot,
    formatMinutesShort,
    type LightCycleSnapshot,
} from "@/helpers/lightCycle";
import type { LightSchedule } from "@/types/environment";
import styles from "./LightHero.module.scss";

export function useLightCycleSnapshot(schedule?: LightSchedule) {
    const [snapshot, setSnapshot] = useState<LightCycleSnapshot | null>(null);

    useEffect(() => {
        if (!schedule) return;

        const update = () => setSnapshot(getLightCycleSnapshot(schedule));
        update();
        const interval = setInterval(update, 30_000);
        return () => clearInterval(interval);
    }, [schedule]);

    return snapshot;
}

export const LIGHT_CYCLE_ICON = {
    day:   { icon: Sun,    variant: "lightday" },
    night: { icon: Moon,   variant: "lightnight" },
    none:  { icon: SunDim, variant: "lightnone" },
} as const;

export function getLightIconVariant(snapshot: LightCycleSnapshot | null): "day" | "night" | "none" {
    if (!snapshot) return "none";
    return snapshot.isLightOn ? "day" : "night";
}

interface LightInfoProps {
    schedule?: LightSchedule;
    snapshot: LightCycleSnapshot | null;
    locationLabel?: string;
}

export function LightStatusInfo({ schedule, snapshot, locationLabel }: LightInfoProps) {
    if (!schedule || !snapshot) {
        return (
            <div className={styles.statusInfo}>
                <div className={styles.primaryRow}>
                    {locationLabel && <span className={styles.locationLabel}>{locationLabel}</span>}
                </div>
                <span className={styles.emptyLabel}>Kein Lichtzyklus</span>
            </div>
        );
    }

    const transitionLabel = snapshot.isLightOn ? "Licht geht aus" : "Licht geht an";

    return (
        <div className={styles.statusInfo}>
            <div className={styles.primaryRow}>
                <span className={styles.phaseLabel}>{snapshot.currentPhaseLabel}</span>
                {locationLabel && <span className={styles.locationLabel}>{locationLabel}</span>}
            </div>
            <div className={styles.secondaryRow}>
                <span className={styles.scheduleBadge}>
                    {snapshot.scheduleLabel} · {transitionLabel} in {formatMinutesShort(snapshot.minutesUntilTransition)}
                </span>
                <span className={styles.scheduleBadge}>
                    {snapshot.dayStartTime} – {snapshot.dayEndTime}
                </span>
            </div>
        </div>
    );
}
