import type { MeasuredValue } from "./plant";

type PercentUnit = '%';
type KPaUnit = 'kPa';
export type EnvironmentType = 'ROOM' | 'TENT' | 'GREENHOUSE';
type TempUnit = '°C' | 'F';

export interface EnvironmentData {
  id: string;
  name: string;
  type: EnvironmentType;
  location?: string;        // optional: z. B. "Keller", "Wohnzimmer"

  climate?: {
    temp?: MeasuredValue<TempUnit>;
    humidity?: MeasuredValue<PercentUnit>;
    vpd?: MeasuredValue<KPaUnit>;
    co2?: MeasuredValue<PercentUnit>;
  };
}
