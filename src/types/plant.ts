import { ProfileKey } from "@/config/profiles";
import { BaseEvent, TimeSeriesEntry } from "./events";

export type ECUnit = 'mS/cm';
export type PHUnit = 'pH';

export interface MeasuredValue<Unit extends string> {
  value: number;
  unit: Unit;
}

export interface WaterDataInput { 
  amount?: string
  ph?: string
  ec?: string
}

export interface WaterData { 
  amount?: MeasuredValue<'ml' | 'L'>
  ph?: MeasuredValue<PHUnit>; 
  ec?: MeasuredValue<ECUnit> 
}

export interface PlantFormData {
  id: string;
  title: string;
  species: string;
  environmentId: string;
  profile?: ProfileKey;
  historical?: PlantData_Historical[];
}

export interface PlantData {
  id: string | undefined;
  title: string;
  species: string;
  environmentId: string;
  profile?: ProfileKey;
  historical?: PlantData_Historical[];
  events?: PlantEvent[];
}

export interface PlantData_Historical {
  id: string;
  plantId: string;
  timestamp: number;
  water?: WaterData;
  height?: MeasuredValue<'cm'>;
  notes?: string;
}

export type PlantEventType = 
  | 'REPOTTING' 
  | 'PEST_CONTROL'
  | 'FERTILIZING'
  | 'PRUNING'
  | string

export interface PlantEvent extends BaseEvent {
  plantId: string;

  repotting?: {
    oldPotSize?: MeasuredValue<'L'>;
    newPotSize: MeasuredValue<'L'>;
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