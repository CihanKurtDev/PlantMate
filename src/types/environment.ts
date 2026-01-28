import type { MeasuredValue } from "./plant";
import { BaseEvent, TimeSeriesEntry } from "./events";
import { ActivityIcon, Droplet, Leaf, Thermometer, Wind } from "lucide-react";

export type PercentUnit = '%';
export type PPMUnit = 'ppm';
export type KPaUnit = 'kPa';
export type EnvironmentType = 'ROOM' | 'TENT' | 'GREENHOUSE';
export type TempUnit = '°C' | '°F';

export const iconMap = { Leaf, Thermometer, ActivityIcon, Droplet, Wind } as const;

export interface ClimateData {
  temp?: MeasuredValue<TempUnit>;
  humidity?: MeasuredValue<PercentUnit>;
  vpd?: MeasuredValue<KPaUnit>;
  co2?: MeasuredValue<PPMUnit>;
}
export interface ClimateDataInput {
  temp?: {
    value?: string;
    unit?: TempUnit;
  };
  humidity?: string;
  vpd?: string;
  co2?: string;
}

export interface EnvironmentFormData {
  id: string;
  name: string;
  type: EnvironmentType;
  location?: string;
  climate?: ClimateDataInput;
}

export interface EnvironmentData {
  id: string;
  name: string;
  type: EnvironmentType;
  location?: string;
  climate?: ClimateData;
  historical?: EnvironmentData_Historical[];
  events?: EnvironmentEvent[]
}

export interface EnvironmentData_Historical {
  id: string;
  environmentId: string;
  timestamp: number;
  climate: ClimateData
}

export type EnvironmentEventType = 
  "Climate_Adjustment" 
  | "Equipment_Change" 
  | "Cleaning" 
  | "Maintenance"
  | string

export interface EnvironmentEvent extends BaseEvent {
  environmentId: string;

  climateAdjustment?: {
    setting: string;
    target: MeasuredValue<TempUnit | PercentUnit | KPaUnit | PPMUnit>;
  }

  equipmentChange?: {
    equipment: string;
    action: 'ADDED' | 'REMOVED' | 'REPLACED';
  }
}

export type EnvironmentTimeSeriesEntry  = TimeSeriesEntry<EnvironmentEvent>