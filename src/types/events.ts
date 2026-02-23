import { iconMap } from "./environment";

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
}
export interface TimeSeriesEntry<EventType = any> {
  timestamp: number;
  entryKind: 'historical' | 'event';
  metrics?: Record<string, number | undefined>;
  notes?: string;
  eventDetails?: EventType;
}