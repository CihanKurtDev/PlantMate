import { daysSince, formatDateShort } from "@/helpers/date";
import { EnvironmentData, EnvironmentEvent } from "@/types/environment";
import { PlantData } from "@/types/plant";
import { buildHistory, getLastEvent } from "@/helpers/tableUtils";
import { getProfile, getProfileMetric, ProfileKey, CultivationProfile } from "@/config/profiles";

export interface EnvironmentTableRow {
    key: string;
    name: string;
    type: string;
    location: string | null;
    profiles: CultivationProfile[];

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

export const mapEnvironmentsToTableRows = (
    environments: EnvironmentData[],
    plants: PlantData[]
): EnvironmentTableRow[] => {
    return environments.map(env => {
        const envPlants = plants.filter(p => p.environmentId === env.id);
        const uniqueProfileKeys = [...new Set(envPlants.map(p => p.profile).filter(Boolean))] as ProfileKey[];
        const profiles: CultivationProfile[] = uniqueProfileKeys.length > 0 
            ? uniqueProfileKeys.map(getProfile) 
            : [getProfile("generic")];

        const lastHistorical = env.historical?.at(-1);
        const lastEvent = getLastEvent(env.events);

        const temp = lastHistorical?.climate?.temp?.value ?? null;
        const humidity = lastHistorical?.climate?.humidity?.value ?? null;
        const vpd = lastHistorical?.climate?.vpd?.value ?? null;
        const co2 = lastHistorical?.climate?.co2?.value ?? null;

        const isBadForProfiles = (value: number | null, key: string): boolean => {
            if (value === null) return false;
            return profiles.some(profile => {
                const metric = getProfileMetric(profile, "climate", key);
                return metric && (value < metric.idealMin || value > metric.idealMax);
            });
        };

        return {
            key: env.id ?? '',
            name: env.name,
            type: env.type,
            location: env.location ?? null,
            profiles,

            lastTemp: temp,
            lastTempUnit: lastHistorical?.climate?.temp?.unit ?? null,
            tempBad: isBadForProfiles(temp, "temp"),

            lastHumidity: humidity,
            humidityBad: isBadForProfiles(humidity, "humidity"),

            lastVpd: vpd,
            vpdBad: isBadForProfiles(vpd, "vpd"),

            lastCo2: co2,
            co2Bad: isBadForProfiles(co2, "co2"),

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