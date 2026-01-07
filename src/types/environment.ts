import type { MeasuredValue } from "./plant";

export type PercentUnit = '%';
export type PPMUnit = 'ppm';
export type KPaUnit = 'kPa';
export type EnvironmentType = 'ROOM' | 'TENT' | 'GREENHOUSE';
export type TempUnit = '°C' | '°F';

export interface EnvironmentData {
  id: string;
  name: string;
  type: EnvironmentType;
  location?: string;

  climate?: {
    temp?: MeasuredValue<TempUnit>;
    humidity?: MeasuredValue<PercentUnit>;
    vpd?: MeasuredValue<KPaUnit>;
    co2?: MeasuredValue<PPMUnit>;
  };
}
