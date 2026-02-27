import { daysSince, formatDateShort } from "@/helpers/date";
import { PlantData, PlantEvent } from "@/types/plant";
import { buildHistory, getLastEvent } from "@/helpers/tableUtils";

export interface PlantTableRow {
    key: string;
    title: string;
    species: string;
    environmentId: string;

    phValue: number | null;
    phUnit: string | null;

    ecValue: number | null;
    ecUnit: string | null;

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

export const mapPlantsToTableRows = (plants: PlantData[]): PlantTableRow[] => {
    return plants.map(plant => {
        const lastHistorical = plant.historical?.at(-1);
        const lastEvent = getLastEvent(plant.events);

        return {
            key: plant.id ?? '',
            title: plant.title,
            species: plant.species,
            environmentId: plant.environmentId,

            phValue: lastHistorical?.water?.ph?.value ?? null,
            phUnit: lastHistorical?.water?.ph?.unit ?? null,

            ecValue: lastHistorical?.water?.ec?.value ?? null,
            ecUnit: lastHistorical?.water?.ec?.unit ?? null,

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