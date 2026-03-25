import type { MeasuredValue } from "./plant";
import { BaseEvent, TimeSeriesEntry } from "./events";
import { iconMap } from "./icons";

export type PercentUnit = '%';
export type PPMUnit = 'ppm';
export type KPaUnit = 'kPa';
export type EnvironmentType = 'ROOM' | 'TENT' | 'GREENHOUSE';
export type TempUnit = '°C' | '°F';

export { iconMap };

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
  historical?: EnvironmentData_Historical[];
}

export interface EnvironmentData {
  id: string;
  name: string;
  type: EnvironmentType;
  location?: string;
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
  | "Equipment_Change"
  | "Cleaning"
  | "Maintenance"
  | string;

export interface EnvironmentEvent extends BaseEvent {
  environmentId: string;

  equipmentChange?: {
    equipment: string;
    action: 'ADDED' | 'REMOVED' | 'REPLACED';
  }
}

export type EnvironmentTimeSeriesEntry = TimeSeriesEntry<EnvironmentEvent>;