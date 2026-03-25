import { daysSince, formatDateShort } from "@/helpers/date";
import { EnvironmentData, EnvironmentEvent } from "@/types/environment";
import { buildHistory, getLastEvent } from "@/helpers/tableUtils";
import { getProfile, getProfileMetric, ProfileKey } from "@/config/profiles";

export interface EnvironmentTableRow {
    key: string;
    name: string;
    type: string;
    location: string | null;
    profile: ProfileKey | null;

    lastTemp: number | null;
    lastTempUnit: string | null;
    tempBad: boolean;

    lastHumidity: number | null;
    humidityBad: boolean;

    lastVpd: number | null;
    vpdBad: boolean;

    lastCo2: number | null;
    co2Bad: boolean;

    lastMeasurementTimestamp: number;
    lastMeasurementDate: string | null;
    daysSinceLastMeasurement: number;

    lastEventType: string | null;
    lastEventTimestamp: number;
    lastEventFormatted: string | null;

    events?: EnvironmentEvent[];

    tempHistory: number[];
    humidityHistory: number[];
    vpdHistory: number[];
    co2History: number[];
}

export const mapEnvironmentsToTableRows = (environments: EnvironmentData[]): EnvironmentTableRow[] => {
    return environments.map(env => {
        const lastHistorical = env.historical?.at(-1);
        const lastEvent = getLastEvent(env.events);
        // TODO: hier brauche ich die profile der pflanzen in dem environment
        const profile = getProfile(env.profile);

        const temp = lastHistorical?.climate?.temp?.value ?? null;
        const humidity = lastHistorical?.climate?.humidity?.value ?? null;
        const vpd = lastHistorical?.climate?.vpd?.value ?? null;
        const co2 = lastHistorical?.climate?.co2?.value ?? null;

        const tempMetric = getProfileMetric(profile, 'climate', 'temp');
        const humidityMetric = getProfileMetric(profile, 'climate', 'humidity');
        const vpdMetric = getProfileMetric(profile, 'climate', 'vpd');
        const co2Metric = getProfileMetric(profile, 'climate', 'co2');

        return {
            key: env.id ?? '',
            name: env.name,
            type: env.type,
            location: env.location ?? null,
            profile: env.profile ?? null,

            lastTemp: temp,
            lastTempUnit: lastHistorical?.climate?.temp?.unit ?? null,
            tempBad: temp !== null && tempMetric ? (temp < tempMetric.idealMin || temp > tempMetric.idealMax) : false,

            lastHumidity: humidity,
            humidityBad: humidity !== null && humidityMetric ? (humidity < humidityMetric.idealMin || humidity > humidityMetric.idealMax) : false,

            lastVpd: vpd,
            vpdBad: vpd !== null && vpdMetric ? (vpd < vpdMetric.idealMin || vpd > vpdMetric.idealMax) : false,

            lastCo2: co2,
            co2Bad: co2 !== null && co2Metric ? (co2 < co2Metric.idealMin || co2 > co2Metric.idealMax) : false,

            lastMeasurementTimestamp: lastHistorical?.timestamp ?? 0,
            lastMeasurementDate: lastHistorical
                ? formatDateShort(new Date(lastHistorical.timestamp))
                : null,
            daysSinceLastMeasurement: lastHistorical
                ? daysSince(lastHistorical.timestamp)
                : 999,

            lastEventType: lastEvent?.type ?? null,
            lastEventTimestamp: lastEvent?.timestamp ?? 0,
            lastEventFormatted: lastEvent?.type ?? null,

            events: env.events,

            tempHistory: buildHistory(env.historical, h => h.climate?.temp?.value),
            humidityHistory: buildHistory(env.historical, h => h.climate?.humidity?.value),
            vpdHistory: buildHistory(env.historical, h => h.climate?.vpd?.value),
            co2History: buildHistory(env.historical, h => h.climate?.co2?.value),
        };
    });
};