// 30 tage
const HISTORY_WINDOW_MS = 30 * 24 * 60 * 60 * 1000;

export function getLastEvent<T extends { timestamp: number }>(events?: T[]): T | undefined {
    return events && events.length > 0 ? events[events.length - 1] : undefined;
}

export function buildHistory<T extends { timestamp: number }>(
    historical: T[] | undefined | null,
    getValue: (entry: T) => number | null | undefined
): number[] {
    if (!historical) return [];

    const latestTimestamp = historical.reduce(
        (latest, entry) => Math.max(latest, entry.timestamp),
        0
    );
    const referenceNow = latestTimestamp || Date.now();
    const cutoff = referenceNow - HISTORY_WINDOW_MS;

    return historical
        .filter(h => h.timestamp >= cutoff)
        .map(h => getValue(h))
        .filter((v): v is number => v !== null && v !== undefined);
}