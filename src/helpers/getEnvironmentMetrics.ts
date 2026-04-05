import { EnvironmentData } from "@/types/environment";
import { MetricItem } from "@/components/MetricGrid/MetricGrid";

function getLatestClimateValues(historical: EnvironmentData["historical"] = []) {
    const result: Record<string, any> = {};

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

    const defaults = {
        temp: 0,
        humidity: 0,
        vpd: 0,
        co2: 0,
    };

    return Object.entries(defaults).map(([key, fallback]) => {
        const value = latestValues[key];

        return {
            key,
            value: value
                ? `${value.value}${value.unit}`
                : `${fallback}${key === "temp" ? "°C" : key === "humidity" ? "%" : key === "vpd" ? "kPa" : "ppm"}`,
        };
    });
}