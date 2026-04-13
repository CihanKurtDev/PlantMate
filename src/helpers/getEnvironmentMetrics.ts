import { EnvironmentData } from "@/types/environment";
import { MetricItem } from "@/components/MetricGrid/MetricGrid";

const CLIMATE_KEYS = ["temp", "humidity", "vpd", "co2"] as const;

function getLatestClimateValues(historical: EnvironmentData["historical"] = []) {
    const result: Record<string, { value: number; unit: string }> = {};

    for (const entry of [...historical].reverse()) {
        for (const [key, value] of Object.entries(entry.climate)) {
            if (!(key in result) && value != null) {
                result[key] = value;
            }
        }
    }

    return result;
}

export function getEnvironmentMetrics(
    environment: EnvironmentData
): MetricItem[] {
    const latestValues = getLatestClimateValues(environment.historical);

    return CLIMATE_KEYS
        .filter((key) => key in latestValues)
        .map((key) => {
            const { value, unit } = latestValues[key];
            return {
                key,
                value: `${value}${unit}`,
            };
        });
}