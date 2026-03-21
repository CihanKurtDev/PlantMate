import { TimeSeriesEntry } from "@/types/events";
import { MetricConfig } from "./DataTab";
import { DeviationLevel } from "@/config/icons";
import { PlantData } from "@/types/plant";
import { getProfile, ProfileKey } from "@/config/profiles";

export interface ChartDatum {
    t: number;
    v: number;
}

export interface Trend {
    diff: number;
    pct: string;
}

export function toRangePercent(value: number, min: number, max: number): number {
    return Math.min(100, Math.max(0, ((value - min) / (max - min)) * 100));
}

export function getMetricValue(entry: TimeSeriesEntry, key: string): number | undefined {
    return entry.metrics?.[key];
}

export function getTrend(data: TimeSeriesEntry[], key: string): Trend | null {
    if (data.length < 2) return null;
    const first = getMetricValue(data[0], key);
    const last = getMetricValue(data[data.length - 1], key);
    if (first === undefined || last === undefined || first === 0) return null;
    const diff = last - first;
    const pct = ((diff / first) * 100).toFixed(1);
    return { diff, pct };
}

export function getDeviationLevel(value: number, metric: MetricConfig): DeviationLevel {
    const { idealMin, idealMax } = metric;
    const warnBuffer = (idealMax - idealMin) * 0.2;
    if (value >= idealMin && value <= idealMax) return "ok";
    if (value >= idealMin - warnBuffer && value <= idealMax + warnBuffer) return "warn";
    return "critical";
}

export function toFahrenheit(celsius: number): number {
    return (celsius * 9) / 5 + 32;
}

export function getDisplayMetric(metric: MetricConfig, useFahrenheit: boolean): MetricConfig {
    if (metric.key !== "temp" || !useFahrenheit) return metric;
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
    const now = Date.now();
    return offsets.map((offset, index) => ({
        t: now - (offsets.length - 1 - index) * 3600000,
        v: mid + offset * range,
    }));
}

export function getIntersectedClimateMetrics(plants: PlantData[]): MetricConfig[] {
    const uniqueProfileKeys = [
        ...new Set(plants.map(plant => plant.profile).filter(Boolean))
    ] as ProfileKey[];

    const profiles = uniqueProfileKeys.length > 0
        ? uniqueProfileKeys.map(key => getProfile(key))
        : [getProfile("generic")];

    const genericClimateMetrics = getProfile("generic").climate;

    // Schnittmenge der Idealbereiche aller Pflanzenprofile
    return genericClimateMetrics.map(baseMetric => {
        const intersectedIdealMin = Math.max(...profiles.map(profile =>
            profile.climate.find(metric => metric.key === baseMetric.key)?.idealMin ?? baseMetric.idealMin
        ));
        const intersectedIdealMax = Math.min(...profiles.map(profile =>
            profile.climate.find(metric => metric.key === baseMetric.key)?.idealMax ?? baseMetric.idealMax
        ));
        const hasValidOverlap = intersectedIdealMax > intersectedIdealMin;

        return {
            ...baseMetric,
            idealMin: intersectedIdealMin,
            idealMax: hasValidOverlap ? intersectedIdealMax : baseMetric.idealMax,
        };
    });
}