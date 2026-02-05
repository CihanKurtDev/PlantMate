import { PlantData, PlantEvent, WaterData } from "@/types/plant";
import { EnvironmentData } from "@/types/environment";

const getLastEvent = (events?: PlantEvent[]) =>
    events && events.length > 0 ? events[events.length - 1] : undefined;

const getLastWatering = (events?: PlantEvent[]) =>
    events
        ?.slice()
        .reverse()
        .find((e) => e.type === "WATERING");

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
    
    water?: WaterData;
    events?: PlantEvent[];
    
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

export const mapPlantsToTableRows = (
    plants: PlantData[],
): PlantTableRow[] => {
    return plants.map(plant => {
        const lastEvent = getLastEvent(plant.events);
        const lastWatering = getLastWatering(plant.events);
        
        return {
            key: plant.id ?? '',
            title: plant.title,
            species: plant.species,
            environmentId: plant.environmentId,
            
            water: plant.water,
            events: plant.events,
            
            phValue: plant.water?.ph?.value ?? null,
            phUnit: plant.water?.ph?.unit ?? null,
            
            ecValue: plant.water?.ec?.value ?? null,
            ecUnit: plant.water?.ec?.unit ?? null,
            
            lastEventType: lastEvent?.type ?? null,
            lastEventTimestamp: lastEvent?.timestamp ?? 0,
            lastEventFormatted: lastEvent 
                ? `${lastEvent.type.charAt(0).toUpperCase()}${lastEvent.type.slice(1).toLowerCase()}`
                : null,
            
            lastWateringTimestamp: lastWatering?.timestamp ?? 0,
            lastWateringDate: lastWatering 
                ? formatDateShort(new Date(lastWatering.timestamp)) 
                : null,
            daysSinceWatering: lastWatering 
                ? daysSince(lastWatering.timestamp) 
                : 999
        };
    });
};