import type { DeviationLevel } from "@/config/icons";
import { getProfile, getProfileMetric, ProfileKey } from "@/config/profiles";
import type { PlantData, PlantStage } from "@/types/plant";
import type { TimeSeriesEntry } from "@/types/events";
import type { MetricConfig } from "./DataTab";

export interface ChartDatum {
    t: number;
    v: number;
}

export interface Trend {
    diff: number;
    pct: string;
}

interface IntersectedClimateMetricOptions {
    getStageForPlant?: (plant: PlantData) => PlantStage | undefined;
}

const GHOST_BASE_TIMESTAMP = Date.UTC(2024, 0, 1, 12, 0, 0, 0);

export function toRangePercent(value: number, min: number, max: number): number {
    return Math.min(100, Math.max(0, ((value - min) / (max - min)) * 100));
}

export function getMetricValue(entry: TimeSeriesEntry, key: string): number | undefined {
    return entry.metrics?.[key];
}

export function getTrend(data: TimeSeriesEntry[], key: string): Trend | null {
    if (data.length < 2) {
        return null;
    }

    const first = getMetricValue(data[0], key);
    const last = getMetricValue(data[data.length - 1], key);

    if (first === undefined || last === undefined || first === 0) {
        return null;
    }

    const diff = last - first;
    const pct = ((diff / first) * 100).toFixed(1);

    return { diff, pct };
}

export function getDeviationLevel(value: number, metric: Pick<MetricConfig, "idealMin" | "idealMax">): DeviationLevel {
    const { idealMin, idealMax } = metric;
    const warnBuffer = (idealMax - idealMin) * 0.2;

    if (value >= idealMin && value <= idealMax) {
        return "ok";
    }

    if (value >= idealMin - warnBuffer && value <= idealMax + warnBuffer) {
        return "warn";
    }

    return "critical";
}

export function toFahrenheit(celsius: number): number {
    return (celsius * 9) / 5 + 32;
}

export function getDisplayMetric(metric: MetricConfig, useFahrenheit: boolean): MetricConfig {
    if (metric.key !== "temp" || !useFahrenheit) {
        return metric;
    }

    return {
        ...metric,
        unit: "°F",
        min: toFahrenheit(metric.min),
        max: toFahrenheit(metric.max),
        idealMin: toFahrenheit(metric.idealMin),
        idealMax: toFahrenheit(metric.idealMax),
        format: (value) => `${value.toFixed(1)} °F`,
    };
}

export function generateGhostData(idealMin: number, idealMax: number): ChartDatum[] {
    const mid = (idealMin + idealMax) / 2;
    const range = (idealMax - idealMin) * 0.4;
    const offsets = [0.2, -0.1, 0.4, 0.1, -0.2, 0.5, 0.3, -0.15, 0.35, 0.2, -0.05, 0.25];

    return offsets.map((offset, index) => ({
        t: GHOST_BASE_TIMESTAMP - (offsets.length - 1 - index) * 3600000,
        v: mid + offset * range,
    }));
}

function getLatestStageFromHistory(plant: PlantData): PlantStage | undefined {
    if (!plant.stageHistory?.length) {
        return undefined;
    }

    const activeStage = plant.stageHistory.find((entry) => entry.endTimestamp === undefined);

    if (activeStage) {
        return activeStage.stage;
    }

    const latestStage = [...plant.stageHistory].sort((left, right) => right.startTimestamp - left.startTimestamp)[0];

    return latestStage?.stage;
}

function getProfileStageClimateMetrics(profileKey?: ProfileKey, stage?: PlantStage): MetricConfig[] {
    const profile = getProfile(profileKey);
    const resolvedStage = stage ?? profile.defaultStage;

    return (
        profile.stages[resolvedStage]?.climate ||
        profile.stages[profile.defaultStage]?.climate ||
        profile.stages.VEGETATIVE?.climate ||
        []
    );
}

export function getIntersectedClimateMetrics(
    plants: PlantData[],
    options: IntersectedClimateMetricOptions = {}
): MetricConfig[] {
    const { getStageForPlant } = options;
    const baseMetrics = getProfileStageClimateMetrics("generic", "VEGETATIVE");

    if (plants.length === 0) {
        return baseMetrics;
    }

    const plantContexts = plants.map((plant) => {
        const resolvedStage = getStageForPlant?.(plant) ?? getLatestStageFromHistory(plant);
        const profile = getProfile(plant.profile);

        return {
            profile,
            stage: resolvedStage ?? profile.defaultStage ?? "VEGETATIVE",
        };
    });

    return baseMetrics.map((baseMetric) => {
        const idealMins = plantContexts.map(({ profile, stage }) => {
            return getProfileMetric(profile, "climate", baseMetric.key, stage)?.idealMin ?? baseMetric.idealMin;
        });

        const idealMaxs = plantContexts.map(({ profile, stage }) => {
            return getProfileMetric(profile, "climate", baseMetric.key, stage)?.idealMax ?? baseMetric.idealMax;
        });

        const intersectedIdealMin = Math.max(...idealMins);
        const intersectedIdealMax = Math.min(...idealMaxs);
        const hasValidOverlap = intersectedIdealMax > intersectedIdealMin;

        if (!hasValidOverlap) {
            return {
                ...baseMetric,
                idealMin: baseMetric.idealMin,
                idealMax: baseMetric.idealMax,
            };
        }

        return {
            ...baseMetric,
            idealMin: intersectedIdealMin,
            idealMax: intersectedIdealMax,
        };
    });
}
