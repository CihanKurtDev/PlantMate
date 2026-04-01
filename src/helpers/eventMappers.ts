import { EnvironmentEvent } from "@/types/environment";
import { EventFormData, extractCustomFields } from "@/types/events";
import { MeasuredValue, PlantEvent } from "@/types/plant";

function toOptionalString(value: string | number | undefined): string | undefined {
    if (value === undefined || value === null) return undefined;
    const trimmed = String(value).trim();
    return trimmed.length ? trimmed : undefined;
}

function toOptionalNumber(value: string | number | undefined): number | undefined {
    if (value === undefined || value === null || value === "") return undefined;
    const parsed = typeof value === "number" ? value : Number(value);
    return Number.isFinite(parsed) ? parsed : undefined;
}

export function mapEventFormToPlantEvent(eventData: EventFormData, plantId: string): PlantEvent {
    const { type, timestamp, notes, extra } = eventData;
    const { resolvedType, ...customFields } = extractCustomFields(type, extra);

    const newPotSize  = toOptionalNumber(extra.newPotSize);
    const oldPotSize  = toOptionalNumber(extra.oldPotSize);
    const amount      = toOptionalNumber(extra.amount);
    const fertilizer  = toOptionalString(extra.fertilizer);
    const pest        = toOptionalString(extra.pest);
    const treatment   = toOptionalString(extra.treatment);

    const repotting = type === "REPOTTING" && newPotSize !== undefined
        ? {
            newPotSize: { value: newPotSize, unit: "L" } as MeasuredValue<"L">,
            oldPotSize: oldPotSize !== undefined
                ? ({ value: oldPotSize, unit: "L" } as MeasuredValue<"L">)
                : undefined,
            substrate: toOptionalString(extra.substrate),
        }
        : undefined;

    const pestControl = type === "PEST_CONTROL" && pest && treatment
        ? { pest, treatment }
        : undefined;

    const fertilizing = type === "FERTILIZING" && fertilizer
        ? {
            fertilizer,
            amount: amount !== undefined
                ? { value: amount, unit: "ml" as const }
                : undefined,
        }
        : undefined;

    return {
        id: Date.now().toString(),
        plantId,
        timestamp,
        notes: toOptionalString(notes),
        type: resolvedType,
        ...customFields,
        repotting,
        pestControl,
        fertilizing,
    };
}

export function mapEventFormToEnvironmentEvent(
    eventData: EventFormData,
    environmentId: string
): EnvironmentEvent {
    const { type, timestamp, notes, extra } = eventData;
    const { resolvedType, ...customFields } = extractCustomFields(type, extra);

    const equipment = toOptionalString(extra.equipment);
    const action    = toOptionalString(extra.action) as "ADDED" | "REMOVED" | "REPLACED" | undefined;

    const equipmentChange = type === "Equipment_Change" && equipment && action
        ? { equipment, action }
        : undefined;

    return {
        id: Date.now().toString(),
        environmentId,
        timestamp,
        notes: toOptionalString(notes),
        type: resolvedType,
        ...customFields,
        equipmentChange,
    };
}