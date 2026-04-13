import { CLIMATE_CONFIG, WATER_CONFIG } from "./icons";
import { LIMITS, THRESHOLDS } from "./thresholds";
import type { PlantStage } from "@/types/plant";

export type ProfileKey =
    | "paprika"
    | "tomaten"
    | "gurken"
    | "salat"
    | "erdbeeren"
    | "kräuter"
    | "pilze"
    | "generic";

type MetricIcon =
    | (typeof CLIMATE_CONFIG)[keyof typeof CLIMATE_CONFIG]["icon"]
    | (typeof WATER_CONFIG)[keyof typeof WATER_CONFIG]["icon"];

export interface MetricProfile {
    key: string;
    label: string;
    unit: string;
    color: string;
    icon: MetricIcon;
    min: number;
    max: number;
    idealMin: number;
    idealMax: number;
    format: (v: number) => string;
}

export interface StageMetricSet {
    climate: MetricProfile[];
    water: MetricProfile[];
}

export type FloweringTrigger = "SHORT_DAY" | "LONG_DAY";

export type StageStrategy =
    | {
          mode: "PHOTOPERIOD";
          seedlingDays: number;
          maturityDays: number;
          floweringTrigger: FloweringTrigger;
          floweringThresholdHours: number;
      }
    | {
          mode: "AGE";
          seedlingDays: number;
      }
    | {
          mode: "MANUAL";
      };

export interface CultivationProfile {
    key: ProfileKey;
    label: string;
    color: string;
    defaultStage: PlantStage;
    stages: Partial<Record<PlantStage, StageMetricSet>>;
    stageStrategy: StageStrategy;
}

type ClimateOverrides = Partial<
    Record<"temp" | "humidity" | "vpd" | "co2", { idealMin: number; idealMax: number }>
>;

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

function withSeedlingStage(
    vegetative: StageMetricSet,
    flowering: StageMetricSet
): Partial<Record<PlantStage, StageMetricSet>> {
    const vegetativeTemp = vegetative.climate.find((metric) => metric.key === "temp");
    const vegetativePh = vegetative.water.find((metric) => metric.key === "ph");

    return {
        SEEDLING: {
            climate: climateMetrics({
                temp: {
                    idealMin: vegetativeTemp?.idealMin ?? 20,
                    idealMax: vegetativeTemp?.idealMax ?? 24,
                },
                humidity: { idealMin: 65, idealMax: 80 },
                vpd: { idealMin: 0.4, idealMax: 0.8 },
                co2: { idealMin: 400, idealMax: 800 },
            }),
            water: waterMetrics({
                ph: {
                    idealMin: vegetativePh?.idealMin ?? 5.8,
                    idealMax: vegetativePh?.idealMax ?? 6.2,
                },
                ec: { idealMin: 0.4, idealMax: 1.0 },
            }),
        },
        VEGETATIVE: vegetative,
        FLOWERING: flowering,
    };
}

function buildProfile(
    key: ProfileKey,
    label: string,
    color: string,
    vegetative: StageMetricSet,
    flowering: StageMetricSet,
    stageStrategy: StageStrategy
): CultivationProfile {
    return {
        key,
        label,
        color,
        defaultStage: "VEGETATIVE",
        stages: withSeedlingStage(vegetative, flowering),
        stageStrategy,
    };
}

export const PROFILES: Record<ProfileKey, CultivationProfile> = {
    paprika: buildProfile(
        "paprika",
        "Paprika",
        "#c0522a",
        {
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
        {
            climate: climateMetrics({
                temp: { idealMin: 22, idealMax: 26 },
                humidity: { idealMin: 50, idealMax: 60 },
                vpd: { idealMin: 1.0, idealMax: 1.4 },
                co2: { idealMin: 400, idealMax: 1200 },
            }),
            water: waterMetrics({
                ph: { idealMin: 5.8, idealMax: 6.5 },
                ec: { idealMin: 1.8, idealMax: 2.6 },
            }),
        },
        {
            mode: "PHOTOPERIOD",
            seedlingDays: 14,
            maturityDays: 60,
            floweringTrigger: "SHORT_DAY",
            floweringThresholdHours: 12,
        }
    ),
    tomaten: buildProfile(
        "tomaten",
        "Tomaten",
        "#c0312a",
        {
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
        {
            climate: climateMetrics({
                temp: { idealMin: 19, idealMax: 24 },
                humidity: { idealMin: 50, idealMax: 60 },
                vpd: { idealMin: 1.0, idealMax: 1.6 },
                co2: { idealMin: 400, idealMax: 1200 },
            }),
            water: waterMetrics({
                ph: { idealMin: 5.6, idealMax: 6.5 },
                ec: { idealMin: 1.8, idealMax: 2.8 },
            }),
        },
        {
            mode: "PHOTOPERIOD",
            seedlingDays: 14,
            maturityDays: 45,
            floweringTrigger: "SHORT_DAY",
            floweringThresholdHours: 12,
        }
    ),
    gurken: buildProfile(
        "gurken",
        "Gurken",
        "#3a7d44",
        {
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
        {
            climate: climateMetrics({
                temp: { idealMin: 20, idealMax: 26 },
                humidity: { idealMin: 60, idealMax: 75 },
                vpd: { idealMin: 0.8, idealMax: 1.3 },
                co2: { idealMin: 400, idealMax: 1000 },
            }),
            water: waterMetrics({
                ph: { idealMin: 5.5, idealMax: 6.5 },
                ec: { idealMin: 1.8, idealMax: 2.5 },
            }),
        },
        {
            mode: "PHOTOPERIOD",
            seedlingDays: 10,
            maturityDays: 35,
            floweringTrigger: "SHORT_DAY",
            floweringThresholdHours: 12,
        }
    ),
    salat: buildProfile(
        "salat",
        "Salat",
        "#6a9e2f",
        {
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
        {
            climate: climateMetrics({
                temp: { idealMin: 15, idealMax: 20 },
                humidity: { idealMin: 50, idealMax: 65 },
                vpd: { idealMin: 0.5, idealMax: 1.0 },
                co2: { idealMin: 400, idealMax: 800 },
            }),
            water: waterMetrics({
                ph: { idealMin: 5.5, idealMax: 6.5 },
                ec: { idealMin: 1.0, idealMax: 1.8 },
            }),
        },
        {
            mode: "PHOTOPERIOD",
            seedlingDays: 10,
            maturityDays: 30,
            floweringTrigger: "LONG_DAY",
            floweringThresholdHours: 14,
        }
    ),
    erdbeeren: buildProfile(
        "erdbeeren",
        "Erdbeeren",
        "#c0294d",
        {
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
        {
            climate: climateMetrics({
                temp: { idealMin: 17, idealMax: 22 },
                humidity: { idealMin: 55, idealMax: 70 },
                vpd: { idealMin: 0.7, idealMax: 1.1 },
                co2: { idealMin: 400, idealMax: 900 },
            }),
            water: waterMetrics({
                ph: { idealMin: 5.5, idealMax: 6.5 },
                ec: { idealMin: 1.4, idealMax: 2.0 },
            }),
        },
        {
            mode: "PHOTOPERIOD",
            seedlingDays: 12,
            maturityDays: 45,
            floweringTrigger: "SHORT_DAY",
            floweringThresholdHours: 12,
        }
    ),
    kräuter: buildProfile(
        "kräuter",
        "Kräuter",
        "#2e8c64",
        {
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
        {
            climate: climateMetrics({
                temp: { idealMin: 18, idealMax: 24 },
                humidity: { idealMin: 45, idealMax: 65 },
                vpd: { idealMin: 0.6, idealMax: 1.1 },
                co2: { idealMin: 400, idealMax: 800 },
            }),
            water: waterMetrics({
                ph: { idealMin: 5.5, idealMax: 6.5 },
                ec: { idealMin: 1.2, idealMax: 1.9 },
            }),
        },
        {
            mode: "PHOTOPERIOD",
            seedlingDays: 10,
            maturityDays: 30,
            floweringTrigger: "LONG_DAY",
            floweringThresholdHours: 16,
        }
    ),
    pilze: buildProfile(
        "pilze",
        "Pilze",
        "#8c6b2e",
        {
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
        {
            climate: climateMetrics({
                temp: { idealMin: 14, idealMax: 20 },
                humidity: { idealMin: 85, idealMax: 95 },
                vpd: { idealMin: 0.1, idealMax: 0.4 },
                co2: { idealMin: 400, idealMax: 800 },
            }),
            water: waterMetrics({
                ph: { idealMin: 6.0, idealMax: 7.0 },
                ec: { idealMin: 0.5, idealMax: 1.2 },
            }),
        },
        {
            mode: "AGE",
            seedlingDays: 7,
        }
    ),
    generic: buildProfile(
        "generic",
        "Generisch",
        "#4a6b8c",
        {
            climate: climateMetrics({}),
            water: waterMetrics({}),
        },
        {
            climate: climateMetrics({
                humidity: { idealMin: 50, idealMax: 65 },
                vpd: { idealMin: 0.8, idealMax: 1.2 },
            }),
            water: waterMetrics({
                ec: { idealMin: 1.2, idealMax: 2.0 },
            }),
        },
        {
            mode: "PHOTOPERIOD",
            seedlingDays: 12,
            maturityDays: 30,
            floweringTrigger: "SHORT_DAY",
            floweringThresholdHours: 12,
        }
    ),
};

export function getProfile(key?: ProfileKey | null): CultivationProfile {
    return PROFILES[key ?? "generic"] ?? PROFILES.generic;
}

export function getProfileMetrics(
    profile: CultivationProfile,
    section: "climate" | "water",
    stage?: PlantStage
): MetricProfile[] {
    const resolvedStage = stage ?? profile.defaultStage;

    return (
        profile.stages[resolvedStage]?.[section] ??
        profile.stages[profile.defaultStage]?.[section] ??
        profile.stages.VEGETATIVE?.[section] ??
        []
    );
}

export function getProfileMetric(
    profile: CultivationProfile,
    section: "climate" | "water",
    key: string,
    stage?: PlantStage
): MetricProfile | undefined {
    return getProfileMetrics(profile, section, stage).find((metric) => metric.key === key);
}
