import { PlantData, PlantEvent, WaterData } from "@/types/plant";

const getLastEvent = (events?: PlantEvent[]) =>
    events && events.length > 0 ? events[events.length - 1] : undefined;

const daysSince = (timestamp: number): number => {
    return Math.floor((Date.now() - timestamp) / (1000 * 60 * 60 * 24));
};

const formatDateShort = (date: Date): string => {
    return new Intl.DateTimeFormat('de-DE', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
    }).format(date);
};

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
            lastEventFormatted: lastEvent
                ? `${lastEvent.type.charAt(0).toUpperCase()}${lastEvent.type.slice(1).toLowerCase()}`
                : null,

            lastWateringTimestamp: lastHistorical?.timestamp ?? 0,
            lastWateringDate: lastHistorical
                ? formatDateShort(new Date(lastHistorical.timestamp))
                : null,
            daysSinceWatering: lastHistorical
                ? daysSince(lastHistorical.timestamp)
                : 999,
        };
    });
};