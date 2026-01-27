import { PlantData_Historical, PlantEvent, PlantTimeSeriesEntry } from "@/types/plant";

export function combinePlantData(historical: PlantData_Historical[] = [], events: PlantEvent[] = []): PlantTimeSeriesEntry[] {
    const historicalEntries: PlantTimeSeriesEntry[] = historical.map(h => ({
        timestamp: h.timestamp,
        entryKind: 'historical',
        metrics: {
            ph: h.water?.ph?.value,
            ec: h.water?.ec?.value,
            height: h.height?.value,
        },
        notes: h.notes
    }));

    const eventEntries: PlantTimeSeriesEntry[] = events
        .map((e): PlantTimeSeriesEntry | null => {
            const ph = e.watering?.ph?.value;
            const ec = e.watering?.ec?.value;

            if (ph === undefined && ec === undefined) return null;

            return {
                timestamp: e.timestamp,
                entryKind: 'event',
                metrics: {
                    ph,
                    ec
                },
                notes: e.notes,
                eventDetails: e
            };
        }).filter((e): e is PlantTimeSeriesEntry => e !== null)

    const combined = [...historicalEntries, ...eventEntries];

    combined.sort((a, b) => a.timestamp - b.timestamp);

    return combined;
}
