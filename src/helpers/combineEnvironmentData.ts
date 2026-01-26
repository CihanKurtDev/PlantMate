import { EnvironmentData_Historical, EnvironmentEvent, EnvironmentTimeSeriesEntry } from "@/types/environment";

export function combineEnvironmentData(
  historical: EnvironmentData_Historical[] = [],
  events: EnvironmentEvent[] = []
): EnvironmentTimeSeriesEntry[] {
  const historicalEntries: EnvironmentTimeSeriesEntry[] = historical.map(h => ({
    timestamp: h.timestamp,
    entryKind: 'historical',
    metrics: {
      temp: h.climate.temp?.value,
      humidity: h.climate.humidity?.value,
      vpd: h.climate.vpd?.value,
      co2: h.climate.co2?.value
    }
  }));

  const eventEntries: EnvironmentTimeSeriesEntry[] = events.map(e => ({
    timestamp: e.timestamp,
    entryKind: 'event',
    eventType: e.type,
    metrics: e.climateAdjustment ? { temp: e.climateAdjustment.target.value } : {}
  }));

  const combined = [...historicalEntries, ...eventEntries];
  combined.sort((a, b) => a.timestamp - b.timestamp);
  return combined;
}
