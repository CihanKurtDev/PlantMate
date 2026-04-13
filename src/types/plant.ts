import type { ProfileKey } from "@/config/profiles";
import type { BaseEvent, TimeSeriesEntry } from "./events";

export type ECUnit = "mS/cm";
export type PHUnit = "pH";
export type PlantStage = "SEEDLING" | "VEGETATIVE" | "FLOWERING";
export type PlantStageSource = "initial" | "manual" | "derived";
export type PlantStartMode = "NEW" | "ESTABLISHED";

export interface MeasuredValue<Unit extends string> {
    value: number;
    unit: Unit;
}

export interface WaterDataInput {
    amount?: string;
    ph?: string;
    ec?: string;
}

export interface WaterData {
    amount?: MeasuredValue<"ml" | "L">;
    ph?: MeasuredValue<PHUnit>;
    ec?: MeasuredValue<ECUnit>;
}

export interface PlantStagePeriod {
    id: string;
    plantId: string;
    stage: PlantStage;
    startTimestamp: number;
    endTimestamp?: number;
    source: PlantStageSource;
    reason?: string;
}

export interface PlantFormData {
    id: string;
    title: string;
    species: string;
    environmentId: string;
    profile?: ProfileKey;
    startMode?: PlantStartMode;
    startedAt?: number;
    stageHistory?: PlantStagePeriod[];
    historical?: PlantData_Historical[];
}

export interface PlantData {
    id: string | undefined;
    title: string;
    species: string;
    environmentId: string;
    profile?: ProfileKey;
    startMode?: PlantStartMode;
    startedAt?: number;
    stageHistory?: PlantStagePeriod[];
    historical?: PlantData_Historical[];
    events?: PlantEvent[];
}

export interface PlantData_Historical {
    id: string;
    plantId: string;
    timestamp: number;
    water?: WaterData;
    height?: MeasuredValue<"cm">;
    notes?: string;
}

export type PlantEventType =
    | "REPOTTING"
    | "PEST_CONTROL"
    | "FERTILIZING"
    | "PRUNING"
    | "STAGE_CHANGE"
    | string;

export interface PlantEvent extends BaseEvent {
    plantId: string;

    stageChange?: {
        from?: PlantStage;
        to: PlantStage;
        source: PlantStageSource;
        reason?: string;
    };

    repotting?: {
        oldPotSize?: MeasuredValue<"L">;
        newPotSize: MeasuredValue<"L">;
        substrate?: string;
    };

    pestControl?: {
        pest: string;
        treatment: string;
    };

    fertilizing?: {
        fertilizer: string;
        amount?: MeasuredValue<"ml" | "g">;
    };
}

export type PlantTimeSeriesEntry = TimeSeriesEntry<PlantEvent>;
