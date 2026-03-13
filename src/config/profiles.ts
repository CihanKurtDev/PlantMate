import { CLIMATE_CONFIG, WATER_CONFIG } from "./icons";
import { THRESHOLDS, LIMITS } from "./thresholds";

export type ProfileKey = "paprika" | "tomaten" | "gurken" | "salat" | "erdbeeren" | "kräuter" | "pilze" | "generic";

export interface MetricProfile {
    key: string;
    label: string;
    unit: string;
    color: string;
    icon: (typeof CLIMATE_CONFIG)[keyof typeof CLIMATE_CONFIG]["icon"];
    min: number;
    max: number;
    idealMin: number;
    idealMax: number;
    format: (v: number) => string;
}

export interface CultivationProfile {
    key: ProfileKey;
    label: string;
    climate: MetricProfile[];
    water: MetricProfile[];
}

type ClimateOverrides = Partial<Record<"temp" | "humidity" | "vpd" | "co2", { idealMin: number; idealMax: number }>>;
type WaterOverrides = Partial<Record<"ph" | "ec", { idealMin: number; idealMax: number }>>;

const climateMetrics = (overrides: ClimateOverrides): MetricProfile[] => [
    {
        key: "temp",
        label: CLIMATE_CONFIG.temp.label,
        unit: "°C",
        color: CLIMATE_CONFIG.temp.colors.base,
        icon: CLIMATE_CONFIG.temp.icon,
        min: LIMITS.climate.temp.min,
        max: LIMITS.climate.temp.max,
        idealMin: overrides.temp?.idealMin ?? THRESHOLDS.climate.temp.warn - 10,
        idealMax: overrides.temp?.idealMax ?? THRESHOLDS.climate.temp.warn,
        format: (v) => `${v.toFixed(1)} °C`,
    },
    {
        key: "humidity",
        label: CLIMATE_CONFIG.humidity.label,
        unit: "%",
        color: CLIMATE_CONFIG.humidity.colors.base,
        icon: CLIMATE_CONFIG.humidity.icon,
        min: LIMITS.climate.humidity.min,
        max: LIMITS.climate.humidity.max,
        idealMin: overrides.humidity?.idealMin ?? THRESHOLDS.climate.humidity.min,
        idealMax: overrides.humidity?.idealMax ?? THRESHOLDS.climate.humidity.max,
        format: (v) => `${v.toFixed(0)} %`,
    },
    {
        key: "vpd",
        label: CLIMATE_CONFIG.vpd.label,
        unit: "kPa",
        color: CLIMATE_CONFIG.vpd.colors.base,
        icon: CLIMATE_CONFIG.vpd.icon,
        min: LIMITS.climate.vpd.min,
        max: LIMITS.climate.vpd.max,
        idealMin: overrides.vpd?.idealMin ?? THRESHOLDS.climate.vpd.min,
        idealMax: overrides.vpd?.idealMax ?? THRESHOLDS.climate.vpd.max,
        format: (v) => `${v.toFixed(2)} kPa`,
    },
    {
        key: "co2",
        label: CLIMATE_CONFIG.co2.label,
        unit: "ppm",
        color: CLIMATE_CONFIG.co2.colors.base,
        icon: CLIMATE_CONFIG.co2.icon,
        min: 300,
        max: LIMITS.climate.co2.max,
        idealMin: overrides.co2?.idealMin ?? 400,
        idealMax: overrides.co2?.idealMax ?? THRESHOLDS.climate.co2.warn,
        format: (v) => `${v.toFixed(0)} ppm`,
    },
];

const waterMetrics = (overrides: WaterOverrides): MetricProfile[] => [
    {
        key: "ph",
        label: WATER_CONFIG.ph.label,
        unit: "pH",
        color: WATER_CONFIG.ph.colors.base,
        icon: WATER_CONFIG.ph.icon,
        min: LIMITS.water.ph.min,
        max: LIMITS.water.ph.max,
        idealMin: overrides.ph?.idealMin ?? THRESHOLDS.water.ph.min,
        idealMax: overrides.ph?.idealMax ?? THRESHOLDS.water.ph.max,
        format: (v) => v.toFixed(1),
    },
    {
        key: "ec",
        label: WATER_CONFIG.ec.label,
        unit: "mS/cm",
        color: WATER_CONFIG.ec.colors.base,
        icon: WATER_CONFIG.ec.icon,
        min: LIMITS.water.ec.min,
        max: LIMITS.water.ec.max,
        idealMin: overrides.ec?.idealMin ?? THRESHOLDS.water.ec.min,
        idealMax: overrides.ec?.idealMax ?? THRESHOLDS.water.ec.max,
        format: (v) => v.toFixed(2),
    },
];

export const PROFILES: Record<ProfileKey, CultivationProfile> = {
    paprika: {
        key: "paprika",
        label: "Paprika",
        climate: climateMetrics({
            temp: { idealMin: 23, idealMax: 28 },
            humidity: { idealMin: 60, idealMax: 70 },
            vpd: { idealMin: 0.6, idealMax: 1.2 },
            co2: { idealMin: 400, idealMax: 1200 },
        }),
        water: waterMetrics({
            ph: { idealMin: 5.8, idealMax: 6.5 },
            ec: { idealMin: 1.4, idealMax: 2.2 },
        }),
    },
    tomaten: {
        key: "tomaten",
        label: "Tomaten",
        climate: climateMetrics({
            temp: { idealMin: 20, idealMax: 26 },
            humidity: { idealMin: 60, idealMax: 70 },
            vpd: { idealMin: 0.8, idealMax: 1.4 },
            co2: { idealMin: 400, idealMax: 1200 },
        }),
        water: waterMetrics({
            ph: { idealMin: 5.5, idealMax: 6.5 },
            ec: { idealMin: 1.5, idealMax: 2.5 },
        }),
    },
    gurken: {
        key: "gurken",
        label: "Gurken",
        climate: climateMetrics({
            temp: { idealMin: 22, idealMax: 28 },
            humidity: { idealMin: 70, idealMax: 85 },
            vpd: { idealMin: 0.5, idealMax: 1.0 },
            co2: { idealMin: 400, idealMax: 1000 },
        }),
        water: waterMetrics({
            ph: { idealMin: 5.5, idealMax: 6.5 },
            ec: { idealMin: 1.4, idealMax: 2.2 },
        }),
    },
    salat: {
        key: "salat",
        label: "Salat",
        climate: climateMetrics({
            temp: { idealMin: 16, idealMax: 22 },
            humidity: { idealMin: 50, idealMax: 70 },
            vpd: { idealMin: 0.4, idealMax: 0.9 },
            co2: { idealMin: 400, idealMax: 800 },
        }),
        water: waterMetrics({
            ph: { idealMin: 5.5, idealMax: 6.5 },
            ec: { idealMin: 0.8, idealMax: 1.8 },
        }),
    },
    erdbeeren: {
        key: "erdbeeren",
        label: "Erdbeeren",
        climate: climateMetrics({
            temp: { idealMin: 18, idealMax: 24 },
            humidity: { idealMin: 60, idealMax: 75 },
            vpd: { idealMin: 0.5, idealMax: 1.0 },
            co2: { idealMin: 400, idealMax: 900 },
        }),
        water: waterMetrics({
            ph: { idealMin: 5.5, idealMax: 6.5 },
            ec: { idealMin: 1.4, idealMax: 1.8 },
        }),
    },
    kräuter: {
        key: "kräuter",
        label: "Kräuter",
        climate: climateMetrics({
            temp: { idealMin: 18, idealMax: 24 },
            humidity: { idealMin: 50, idealMax: 70 },
            vpd: { idealMin: 0.4, idealMax: 1.0 },
            co2: { idealMin: 400, idealMax: 800 },
        }),
        water: waterMetrics({
            ph: { idealMin: 5.5, idealMax: 6.5 },
            ec: { idealMin: 1.0, idealMax: 1.8 },
        }),
    },
    pilze: {
        key: "pilze",
        label: "Pilze",
        climate: climateMetrics({
            temp: { idealMin: 14, idealMax: 22 },
            humidity: { idealMin: 80, idealMax: 95 },
            vpd: { idealMin: 0.1, idealMax: 0.5 },
            co2: { idealMin: 400, idealMax: 800 },
        }),
        water: waterMetrics({
            ph: { idealMin: 6.0, idealMax: 7.0 },
            ec: { idealMin: 0.5, idealMax: 1.5 },
        }),
    },
    generic: {
        key: "generic",
        label: "Generisch",
        climate: climateMetrics({}),
        water: waterMetrics({}),
    },
};

export function getProfile(key?: ProfileKey | null): CultivationProfile {
    return PROFILES[key ?? "generic"] ?? PROFILES.generic;
}

export function getProfileMetric(profile: CultivationProfile, section: "climate" | "water", key: string): MetricProfile | undefined {
    return profile[section].find(m => m.key === key);
}