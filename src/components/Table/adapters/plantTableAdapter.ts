import { daysSince, formatDateShort } from "@/helpers/date";
import { PlantData, PlantEvent } from "@/types/plant";
import { EnvironmentData } from "@/types/environment";
import { buildHistory, getLastEvent } from "@/helpers/tableUtils";
import { getProfile, getProfileMetric } from "@/config/profiles";

export interface PlantTableRow {
    key: string;
    title: string;
    species: string;
    environmentId: string;

    phValue: number | null;
    phUnit: string | null;
    phBad: boolean;

    ecValue: number | null;
    ecUnit: string | null;
    ecBad: boolean;

    lastEventType: string | null;
    lastEventTimestamp: number;
    lastEventFormatted: string | null;

    lastWateringTimestamp: number;
    lastWateringDate: string | null;
    daysSinceWatering: number;

    events?: PlantEvent[];

    phHistory: number[];
    ecHistory: number[];
}

export const mapPlantsToTableRows = (plants: PlantData[], environments: EnvironmentData[]): PlantTableRow[] => {
    return plants.map(plant => {
        const lastHistorical = plant.historical?.at(-1);
        const lastEvent = getLastEvent(plant.events);

        const environment = environments.find(e => e.id === plant.environmentId);
        const profile = getProfile(environment?.profile);

        const ph = lastHistorical?.water?.ph?.value ?? null;
        const ec = lastHistorical?.water?.ec?.value ?? null;

        const phMetric = getProfileMetric(profile, 'water', 'ph');
        const ecMetric = getProfileMetric(profile, 'water', 'ec');

        return {
            key: plant.id ?? '',
            title: plant.title,
            species: plant.species,
            environmentId: plant.environmentId,

            phValue: ph,
            phUnit: lastHistorical?.water?.ph?.unit ?? null,
            phBad: ph !== null && phMetric ? (ph < phMetric.idealMin || ph > phMetric.idealMax) : false,

            ecValue: ec,
            ecUnit: lastHistorical?.water?.ec?.unit ?? null,
            ecBad: ec !== null && ecMetric ? (ec < ecMetric.idealMin || ec > ecMetric.idealMax) : false,

            lastEventType: lastEvent?.type ?? null,
            lastEventTimestamp: lastEvent?.timestamp ?? 0,
            lastEventFormatted: lastEvent?.type ?? null,

            lastWateringTimestamp: lastHistorical?.timestamp ?? 0,
            lastWateringDate: lastHistorical
                ? formatDateShort(new Date(lastHistorical.timestamp))
                : null,
            daysSinceWatering: lastHistorical
                ? daysSince(lastHistorical.timestamp)
                : 999,

            events: plant.events,

            phHistory: buildHistory(plant.historical, h => h.water?.ph?.value),
            ecHistory: buildHistory(plant.historical, h => h.water?.ec?.value),
        };
    });
};