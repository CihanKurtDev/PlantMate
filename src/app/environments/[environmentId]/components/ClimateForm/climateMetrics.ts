import { CultivationProfile, MetricProfile } from "@/config/profiles";

export const CLIMATE_KEYS = ["temp", "humidity", "vpd", "co2"] as const;

export type ClimateKey = typeof CLIMATE_KEYS[number];

export const CLIMATE_KEY_LABELS: Record<ClimateKey, string> = {
    temp: "Temperatur",
    humidity: "Luftfeuchtigkeit",
    vpd: "VPD",
    co2: "CO₂",
};

export interface ResolvedClimateProfile {
    profile: CultivationProfile;
    metrics: MetricProfile[];
}

export interface PreparedMetric {
    key: ClimateKey;
    label: string;
    intersected: MetricProfile;
    base: MetricProfile;
    perProfile: Array<{ profile: CultivationProfile; metric: MetricProfile }>;
    rangesConflict: boolean;
}

export function prepareMetrics(
    profiles: ResolvedClimateProfile[],
    intersectedMetrics: MetricProfile[],
    genericClimate: MetricProfile[]
): PreparedMetric[] {
    return CLIMATE_KEYS.flatMap((key) => {
        const intersected = intersectedMetrics.find((metric) => metric.key === key);
        const base = genericClimate.find((metric) => metric.key === key);

        if (!intersected || !base) {
            return [];
        }

        const perProfile = profiles.flatMap(({ profile, metrics }) => {
            const metric = metrics.find((entry) => entry.key === key);

            if (!metric) {
                return [];
            }

            return [{ profile, metric }];
        });

        const rangesConflict =
            intersected.idealMin === base.idealMin &&
            intersected.idealMax === base.idealMax &&
            perProfile.some(({ metric }) => {
                return (
                    metric.idealMin !== base.idealMin ||
                    metric.idealMax !== base.idealMax
                );
            });

        return [
            {
                key,
                label: CLIMATE_KEY_LABELS[key],
                intersected,
                base,
                perProfile,
                rangesConflict,
            },
        ];
    });
}