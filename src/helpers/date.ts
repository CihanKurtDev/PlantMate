import { EnvironmentEvent } from "@/types/environment";

export const formatDate = (timestamp: number) => {
    const date = new Date(timestamp);
    return date.toLocaleDateString('de-DE', { weekday: 'short', day: '2-digit', month: 'short' });
};

export const formatTime = (timestamp: number) =>
    new Date(timestamp).toLocaleTimeString('de-DE', { hour: '2-digit', minute: '2-digit' });

export interface Timestamped {
    timestamp: number;
}

export const groupEventsByDate = <T extends Timestamped>(events: T[]) => {
    const groups: Record<string, T[]> = {};

    events.forEach(e => {
        const key = new Date(e.timestamp).toDateString();
        groups[key] = groups[key] || [];
        groups[key].push(e);
    });

    return Object.entries(groups).sort(
        (a, b) => new Date(b[0]).getTime() - new Date(a[0]).getTime()
    );
};