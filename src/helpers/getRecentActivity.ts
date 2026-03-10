import { EnvironmentData, EnvironmentEvent } from "@/types/environment";
import { PlantData, PlantEvent } from "@/types/plant";
import { getIconConfig, IconConfig } from "@/config/icons";

export type ActivityEntryKind = "event" | "measurement";

export interface ActivityEntry {
    id: string;
    kind: ActivityEntryKind;
    timestamp: number;
    iconConfig: IconConfig;
    title: string;
    subTitle: string;
    notes?: string;
    href: string;
}

export function getRecentActivity(
    environments: EnvironmentData[],
    plants: PlantData[],
    limit = 10
): ActivityEntry[] {
    const entries: ActivityEntry[] = [];

    for (const env of environments) {
        for (const event of env.events ?? []) {
            const config = getIconConfig(event.type);
            if (!config) continue;
            entries.push({
                id: event.id,
                kind: "event",
                timestamp: event.timestamp,
                iconConfig: config,
                title: formatEnvEventTitle(event),
                subTitle: env.name,
                href: `/environments/${env.id}`,
            });
        }

        for (const h of env.historical ?? []) {
            const config = getIconConfig("temp");
            if (!config) continue;
            entries.push({
                id: h.id,
                kind: "measurement",
                timestamp: h.timestamp,
                iconConfig: config,
                title: "Messung eingetragen",
                subTitle: env.name,
                href: `/environments/${env.id}`,
            });
        }
    }

    for (const plant of plants) {
        const envName = environments.find(e => e.id === plant.environmentId)?.name
            ?? plant.environmentId;

        for (const event of plant.events ?? []) {
            const config = getIconConfig(event.type);
            if (!config) continue;
            entries.push({
                id: event.id,
                kind: "event",
                timestamp: event.timestamp,
                iconConfig: config,
                title: formatPlantEventTitle(event),
                subTitle: `${plant.title} · ${envName}`,
                href: `/environments/${plant.environmentId}/plants/${plant.id}`,
            });
        }

        for (const h of plant.historical ?? []) {
            if (!h.water) continue;
            const config = getIconConfig("ph");
            if (!config) continue;

            const parts: string[] = [];
            if (h.water.amount) parts.push(`${h.water.amount.value} ${h.water.amount.unit}`);
            if (h.water.ph)     parts.push(`pH ${h.water.ph.value}`);
            if (h.water.ec)     parts.push(`EC ${h.water.ec.value}`);

            entries.push({
                id: h.id,
                kind: "measurement",
                timestamp: h.timestamp,
                iconConfig: config,
                title: "Gegossen",
                subTitle: `${plant.title} · ${envName}`,
                notes: parts.length ? parts.join(" · ") : undefined,
                href: `/environments/${plant.environmentId}/plants/${plant.id}`,
            });
        }
    }

    return entries
        .sort((a, b) => b.timestamp - a.timestamp)
        .slice(0, limit);
}

function formatEnvEventTitle(event: EnvironmentEvent): string {
    switch (event.type) {
        case "Equipment_Change":
            if (event.equipmentChange) {
                const actionLabel = {
                    ADDED:    "hinzugefügt",
                    REMOVED:  "entfernt",
                    REPLACED: "ersetzt",
                }[event.equipmentChange.action] ?? event.equipmentChange.action;
                return `${event.equipmentChange.equipment} ${actionLabel}`;
            }
            return "Equipment Change";
        case "Maintenance": return "Wartung";
        case "Cleaning":    return "Reinigung";
        default:            return event.type;
    }
}

function formatPlantEventTitle(event: PlantEvent): string {
    switch (event.type) {
        case "REPOTTING":
            return event.repotting
                ? `Umtopfen → ${event.repotting.newPotSize.value} ${event.repotting.newPotSize.unit}`
                : "Umtopfen";
        case "FERTILIZING":
            return event.fertilizing
                ? `Düngen · ${event.fertilizing.fertilizer}`
                : "Düngen";
        case "PEST_CONTROL":
            return event.pestControl
                ? `Schädlinge · ${event.pestControl.pest}`
                : "Schädlingsbekämpfung";
        case "PRUNING": return "Rückschnitt";
        default:        return event.type;
    }
}