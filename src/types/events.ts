import type { IconMapKey } from "./icons";

export interface BaseEvent {
  id: string;
  timestamp: number;
  type: string;
  notes?: string;
  customIconName?: IconMapKey;
  customBgColor?: string;
  customTextColor?: string;
  customBorderColor?: string;
}

export type ExtraValue = string | number | undefined;

export interface EventFormData {
  type: string;
  timestamp: number;
  notes?: string;
  extra: Record<string, ExtraValue>;
}

export type ExtraFieldType =
  | "text"
  | "number"
  | "select"
  | "color"
  | "icon-select";

export interface ExtraFieldOption {
  value: string;
  label: string;
}

export interface ExtraFieldConfig {
  key: string;
  label: string;
  type: ExtraFieldType;
  required?: boolean;
  placeholder?: string;
  options?: ExtraFieldOption[];
  defaultValue?: ExtraValue;
}

export interface EventTypeConfig {
  value: string;
  label: string;
  extraFields?: ExtraFieldConfig[];
}

export const CUSTOM_EXTRA_KEYS = {
  name: "customName",
  iconName: "customIconName",
  bgColor: "customBgColor",
  textColor: "customTextColor",
  borderColor: "customBorderColor",
} as const;

export const CUSTOM_EVENT_EXTRA_FIELDS: ExtraFieldConfig[] = [
  {
    key: CUSTOM_EXTRA_KEYS.name,
    label: "Name",
    type: "text",
    required: true,
    placeholder: "Name des Events",
  },
  {
    key: CUSTOM_EXTRA_KEYS.iconName,
    label: "Icon",
    type: "icon-select",
    defaultValue: "Leaf",
  },
  {
    key: CUSTOM_EXTRA_KEYS.bgColor,
    label: "Hintergrundfarbe",
    type: "color",
    defaultValue: "#e0e0e0",
  },
  {
    key: CUSTOM_EXTRA_KEYS.textColor,
    label: "Textfarbe",
    type: "color",
    defaultValue: "#424242",
  },
  {
    key: CUSTOM_EXTRA_KEYS.borderColor,
    label: "Borderfarbe",
    type: "color",
    defaultValue: "#bdbdbd",
  },
];

export interface TimeSeriesEntry<EventType = BaseEvent> {
  timestamp: number;
  entryKind: "historical" | "event";
  metrics?: Record<string, number | undefined>;
  notes?: string;
  eventDetails?: EventType;
}

export interface CustomEventFields {
  resolvedType: string;
  customIconName?: IconMapKey;
  customBgColor?: string;
  customTextColor?: string;
  customBorderColor?: string;
}

export function extractCustomFields(
  type: string,
  extra: Record<string, ExtraValue>
): CustomEventFields {
  const isCustom = type === "custom";
  return {
    resolvedType: isCustom ? (extra[CUSTOM_EXTRA_KEYS.name] as string) : type,
    customIconName: isCustom
      ? (extra[CUSTOM_EXTRA_KEYS.iconName] as IconMapKey)
      : undefined,
    customBgColor: isCustom
      ? (extra[CUSTOM_EXTRA_KEYS.bgColor] as string)
      : undefined,
    customTextColor: isCustom
      ? (extra[CUSTOM_EXTRA_KEYS.textColor] as string)
      : undefined,
    customBorderColor: isCustom
      ? (extra[CUSTOM_EXTRA_KEYS.borderColor] as string)
      : undefined,
  };
}