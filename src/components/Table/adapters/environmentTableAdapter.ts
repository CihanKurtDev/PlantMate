import { daysSince, formatDateShort } from "@/helpers/date";
import { EnvironmentData, EnvironmentEvent } from "@/types/environment";
import { buildHistory, getLastEvent } from "@/helpers/tableUtils";

export interface EnvironmentTableRow {
    key: string;
    name: string;
    type: string;
    location: string | null;

    lastTemp: number | null;
    lastTempUnit: string | null;

    lastHumidity: number | null;

    lastVpd: number | null;

    lastCo2: number | null;

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

        return {
            key: env.id ?? '',
            name: env.name,
            type: env.type,
            location: env.location ?? null,

            lastTemp: lastHistorical?.climate?.temp?.value ?? null,
            lastTempUnit: lastHistorical?.climate?.temp?.unit ?? null,

            lastHumidity: lastHistorical?.climate?.humidity?.value ?? null,

            lastVpd: lastHistorical?.climate?.vpd?.value ?? null,

            lastCo2: lastHistorical?.climate?.co2?.value ?? null,

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