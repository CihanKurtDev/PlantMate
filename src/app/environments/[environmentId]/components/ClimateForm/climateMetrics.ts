import { CultivationProfile, MetricProfile } from "@/config/profiles";

export const CLIMATE_KEYS = ["temp", "humidity", "vpd", "co2"] as const;
export type ClimateKey = typeof CLIMATE_KEYS[number];

export const CLIMATE_KEY_LABELS: Record<ClimateKey, string> = {
    temp: "Temperatur",
    humidity: "Luftfeuchtigkeit",
    vpd: "VPD",
    co2: "CO₂",
};

export interface PreparedMetric {
    key: ClimateKey;
    label: string;
    intersected: MetricProfile;
    base: MetricProfile;
    perProfile: Array<{ profile: CultivationProfile; metric: MetricProfile }>;
    rangesConflict: boolean;
}

export function prepareMetrics(
    profiles: CultivationProfile[],
    intersectedMetrics: MetricProfile[],
    genericClimate: MetricProfile[]
): PreparedMetric[] {
    return CLIMATE_KEYS.flatMap((key) => {
        const intersected = intersectedMetrics.find((m) => m.key === key);
        const base = genericClimate.find((m) => m.key === key);

        if (!intersected || !base) return [];

        const perProfile = profiles.flatMap((profile) => {
            const metric = profile.climate.find((m) => m.key === key);
            return metric ? [{ profile, metric }] : [];
        });

        const rangesConflict =
            intersected.idealMin !== base.idealMin &&
            intersected.idealMax === base.idealMax;

        return [{ key, label: CLIMATE_KEY_LABELS[key], intersected, base, perProfile, rangesConflict }];
    });
}