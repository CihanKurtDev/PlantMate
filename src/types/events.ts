import { iconMap } from "./environment";
import { MeasuredValue, WaterData } from "./plant";

export interface BaseEvent {
  id: string;
  timestamp: number;
  type: string;
  notes?: string;
  customName?: string;
  customIconName?: keyof typeof iconMap;
  customBgColor?: string;
  customTextColor?: string;
  customBorderColor?: string;
}

export interface EventFormData {
  type: string;
  timestamp: number;
  notes?: string;

  customName?: string;
  customIconName?: keyof typeof iconMap;
  customBgColor?: string;
  customTextColor?: string;
  customBorderColor?: string;

  watering?: WaterData
}

export interface TimeSeriesEntry<EventType = any> {
  timestamp: number;
  entryKind: 'historical' | 'event';
  metrics?: {
    temp?: number;
    humidity?: number;
    vpd?: number;
    co2?: number;
    ph?: number;
    ec?: number;
    height?: number;
  };
  notes?: string;
  eventDetails?: EventType;
}