import { getProfile, getProfileMetric, getProfileMetrics } from "@/config/profiles";
import type { MetricProfile } from "@/config/profiles";
import type { EnvironmentData, LightSchedule } from "@/types/environment";
import type { PlantData, PlantStage, PlantStagePeriod, PlantStartMode } from "@/types/plant";

export const PLANT_START_MODE_OPTIONS: { value: PlantStartMode; label: string }[] = [
    { value: "NEW", label: "Neu gestartet" },
    { value: "ESTABLISHED", label: "Bereits etabliert" },
];

export function getPlantStageLabel(stage: PlantStage | undefined): string {
    switch (stage) {
        case "SEEDLING":
            return "Keimling";
        case "VEGETATIVE":
            return "Wachstum";
        case "FLOWERING":
            return "Blüte";
        default:
            return "Unbekannt";
    }
}

export function normalizeLightSchedule(hoursLight: number, dayStartMinutes?: number): LightSchedule {
    const clampedLightHours = Math.max(0, Math.min(24, Math.round(hoursLight)));

    return {
        hoursLight: clampedLightHours,
        hoursDark: 24 - clampedLightHours,
        dayStartMinutes,
    };
}

export function getLightScheduleLabel(lightSchedule?: LightSchedule): string {
    if (!lightSchedule) {
        return "–";
    }

    return `${lightSchedule.hoursLight}/${lightSchedule.hoursDark}`;
}

function getStageOverrideAtTimestamp(
    plant: PlantData,
    timestamp: number
): PlantStagePeriod | undefined {
    return [...(plant.stageHistory ?? [])]
        .filter((entry) => {
            const startsBefore = entry.startTimestamp <= timestamp;
            const endsAfter = entry.endTimestamp === undefined || timestamp <= entry.endTimestamp;

            return startsBefore && endsAfter;
        })
        .sort((left, right) => right.startTimestamp - left.startTimestamp)[0];
}

function getPlantStartTimestamp(plant: PlantData): number {
    if (typeof plant.startedAt === "number") {
        return plant.startedAt;
    }

    const timestamps = [
        ...(plant.historical ?? []).map((entry) => entry.timestamp),
        ...(plant.events ?? []).map((entry) => entry.timestamp),
        ...(plant.stageHistory ?? []).map((entry) => entry.startTimestamp),
    ].filter((value): value is number => Number.isFinite(value));

    return timestamps.length ? Math.min(...timestamps) : Date.now();
}

export function getLightScheduleAtTimestamp(
    environment: EnvironmentData | undefined,
    timestamp: number
): LightSchedule | undefined {
    if (!environment) {
        return undefined;
    }

    const matchingEvent = [...(environment.events ?? [])]
        .filter((event) => event.lightScheduleChange && event.timestamp <= timestamp)
        .sort((left, right) => right.timestamp - left.timestamp)[0];

    return matchingEvent?.lightScheduleChange ?? environment.currentLightSchedule;
}

function getAgeDerivedBaseStage(plant: PlantData, timestamp: number): PlantStage {
    const profile = getProfile(plant.profile);
    const startMode = plant.startMode ?? "ESTABLISHED";

    if (startMode !== "NEW") {
        return "VEGETATIVE";
    }

    if (profile.stageStrategy.mode === "MANUAL") {
        return profile.defaultStage;
    }

    const seedlingDays = profile.stageStrategy.seedlingDays;
    const ageInDays = (timestamp - getPlantStartTimestamp(plant)) / 86400000;

    if (ageInDays < seedlingDays) {
        return "SEEDLING";
    }

    return "VEGETATIVE";
}

function getPhotoperiodStage(
    plant: PlantData,
    environment: EnvironmentData | undefined,
    timestamp: number
): PlantStage | undefined {
    const profile = getProfile(plant.profile);

    if (profile.stageStrategy.mode !== "PHOTOPERIOD") {
        return undefined;
    }

    const baseStage = getAgeDerivedBaseStage(plant, timestamp);

    if (baseStage === "SEEDLING") {
        return "SEEDLING";
    }

    const ageInDays = (timestamp - getPlantStartTimestamp(plant)) / 86400000;

    if (ageInDays < profile.stageStrategy.maturityDays) {
        return "VEGETATIVE";
    }

    const lightSchedule = getLightScheduleAtTimestamp(environment, timestamp);

    if (!lightSchedule) {
        return "VEGETATIVE";
    }

    const { floweringTrigger, floweringThresholdHours } = profile.stageStrategy;

    if (floweringTrigger === "SHORT_DAY" && lightSchedule.hoursDark >= floweringThresholdHours) {
        return "FLOWERING";
    }

    if (floweringTrigger === "LONG_DAY" && lightSchedule.hoursLight >= floweringThresholdHours) {
        return "FLOWERING";
    }

    return "VEGETATIVE";
}

export function getPlantStageAtTimestamp(
    plant: PlantData,
    timestamp: number,
    environment?: EnvironmentData
): PlantStage {
    const override = getStageOverrideAtTimestamp(plant, timestamp);

    if (override) {
        return override.stage;
    }

    const profile = getProfile(plant.profile);

    if (profile.stageStrategy.mode === "PHOTOPERIOD") {
        return getPhotoperiodStage(plant, environment, timestamp) ?? profile.defaultStage;
    }

    if (profile.stageStrategy.mode === "AGE") {
        return getAgeDerivedBaseStage(plant, timestamp);
    }

    return profile.defaultStage;
}

export function getCurrentPlantStage(
    plant: PlantData,
    environment?: EnvironmentData,
    now = Date.now()
): PlantStage {
    return getPlantStageAtTimestamp(plant, now, environment);
}

export function isPlantStageAutomatic(
    plant: Pick<PlantData, "profile">,
    environment?: EnvironmentData
): boolean {
    const profile = getProfile(plant.profile);

    if (profile.stageStrategy.mode === "PHOTOPERIOD") {
        return Boolean(environment?.currentLightSchedule);
    }

    return profile.stageStrategy.mode === "AGE";
}

export function getPlantStageDescription(
    plant: PlantData,
    environment?: EnvironmentData,
    timestamp = Date.now()
): string {
    const profile = getProfile(plant.profile);

    if (profile.stageStrategy.mode === "PHOTOPERIOD") {
        const { floweringTrigger, maturityDays } = profile.stageStrategy;
        const lightSchedule = getLightScheduleAtTimestamp(environment, timestamp);
        const triggerLabel = floweringTrigger === "SHORT_DAY" ? "Kurztag" : "Langtag";

        if (!lightSchedule) {
            return `${triggerLabel}-Pflanze. Phase wird aus dem Lichtzyklus abgeleitet, sobald einer gesetzt ist.`;
        }

        const ageInDays = Math.floor((timestamp - getPlantStartTimestamp(plant)) / 86400000);

        if (ageInDays < maturityDays) {
            return `${triggerLabel}-Pflanze, noch nicht reif genug für Blüte (ca. ${maturityDays - ageInDays} Tage bis Reife).`;
        }

        return `${triggerLabel}-Pflanze. Phase wird automatisch aus ${lightSchedule.hoursLight}/${lightSchedule.hoursDark} abgeleitet.`;
    }

    if (profile.stageStrategy.mode === "AGE") {
        return "Phase wird automatisch aus Startstatus und Alter abgeleitet.";
    }

    return "Phase wird manuell gesteuert.";
}

export function getPlantStageSourceShort(
    plant: PlantData,
    environment?: EnvironmentData,
    timestamp = Date.now()
): string {
    const profile = getProfile(plant.profile);

    if (profile.stageStrategy.mode === "PHOTOPERIOD") {
        const ls = getLightScheduleAtTimestamp(environment, timestamp);
        const trigger = profile.stageStrategy.floweringTrigger === "SHORT_DAY" ? "Kurztag" : "Langtag";

        if (!ls) return "Lichtzyklus fehlt";

        const ageInDays = Math.floor((timestamp - getPlantStartTimestamp(plant)) / 86400000);

        if (ageInDays < profile.stageStrategy.maturityDays) {
            return `${trigger} · Noch nicht reif`;
        }

        return `${trigger} · ${ls.hoursLight}/${ls.hoursDark}`;
    }

    if (profile.stageStrategy.mode === "AGE") {
        return "Nach Alter";
    }

    return "Manuell";
}

export function resolvePlantPreviewStage(
    profileKey: PlantData["profile"],
    environment: EnvironmentData | undefined,
    startMode: PlantStartMode,
    startedAt: number
): PlantStage {
    return getPlantStageAtTimestamp(
        {
            id: "preview",
            title: "Preview",
            species: "",
            environmentId: environment?.id ?? "",
            profile: profileKey,
            startMode,
            startedAt,
        },
        Date.now(),
        environment
    );
}

export function getWaterMetricsForPlantStage(
    plant: PlantData,
    environment?: EnvironmentData,
    timestamp = Date.now()
): MetricProfile[] {
    const profile = getProfile(plant.profile);
    const stage = getPlantStageAtTimestamp(plant, timestamp, environment);

    return getProfileMetrics(profile, "water", stage);
}

export function getWaterMetricForPlantAtTimestamp(
    plant: PlantData,
    key: string,
    timestamp: number,
    environment?: EnvironmentData
): MetricProfile | undefined {
    const profile = getProfile(plant.profile);
    const stage = getPlantStageAtTimestamp(plant, timestamp, environment);

    return getProfileMetric(profile, "water", key, stage);
}

export function getClimateMetricsForPlantStage(
    plant: PlantData,
    environment?: EnvironmentData,
    timestamp = Date.now()
): MetricProfile[] {
    const profile = getProfile(plant.profile);
    const stage = getPlantStageAtTimestamp(plant, timestamp, environment);

    return getProfileMetrics(profile, "climate", stage);
}

export function getClimateMetricForPlantAtTimestamp(
    plant: PlantData,
    key: string,
    timestamp: number,
    environment?: EnvironmentData
): MetricProfile | undefined {
    const profile = getProfile(plant.profile);
    const stage = getPlantStageAtTimestamp(plant, timestamp, environment);

    return getProfileMetric(profile, "climate", key, stage);
}
