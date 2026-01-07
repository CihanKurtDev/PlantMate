import type { MeasuredValue } from "./plant";

export type PercentUnit = '%';
export type PPMUnit = 'ppm';
export type KPaUnit = 'kPa';
export type EnvironmentType = 'ROOM' | 'TENT' | 'GREENHOUSE';
export type TempUnit = '°C' | '°F';

interface ClimateData {
  temp?: MeasuredValue<TempUnit>;
  humidity?: MeasuredValue<PercentUnit>;
  vpd?: MeasuredValue<KPaUnit>;
  co2?: MeasuredValue<PPMUnit>;
}

export interface EnvironmentData {
  id: string;
  name: string;
  type: EnvironmentType;
  location?: string;
  climate?: ClimateData;
}

export interface EnvironmentData_Historical {
  id: string;
  environmentId: string;
  timetamp: number;
  climate: ClimateData
}

export type EnvironmentEventType = 
  "Climate_Adjustment" 
  | "Equipment_Change" 
  | "Cleaning" 
  | "Maintenance"

export interface EnvironmentEvent {
  id: string;
  environmentId: string;
  timestamp: number;
  type: EnvironmentEventType;
  notes?: string;

  climateAdjustment?: {
    setting: string;
    target: MeasuredValue<TempUnit | PercentUnit | PPMUnit>
  }

  equipmentChange?: {
    equipment: string;
    action: 'ADDED' | 'REMOVED' | 'REPLACED';
  }
}