import { CUSTOM_EVENT_EXTRA_FIELDS, EventTypeConfig } from "@/types/events";
import { Home, Tent, Leaf, LucideIcon } from "lucide-react";

export type EnvironmentType = 'TENT' | 'ROOM' | 'GREENHOUSE';

export const ENVIRONMENT_ICONS: Record<EnvironmentType, LucideIcon> = {
    TENT: Tent,
    ROOM: Home,
    GREENHOUSE: Leaf,
};

export const ENVIRONMENT_LABELS: Record<EnvironmentType, string> = {
    TENT: "Zelt",
    ROOM: "Raum",
    GREENHOUSE: "Gewächshaus",
};

export { 
    ENVIRONMENT_EVENT_CONFIG as ENVIRONMENT_EVENT_MAP,
    getIconConfig,
    getEventConfig,
} from './icons';

export type { EnvironmentEventType } from './icons';

export const ENVIRONMENT_EVENT_FORM_CONFIG: EventTypeConfig[] = [
  {
    value: "Equipment_Change",
    label: "Gerätewechsel",
    extraFields: [
      {
        key: "equipment",
        label: "Gerät",
        type: "text",
        required: true,
        placeholder: "z.B. LED-Lampe",
      },
      {
        key: "action",
        label: "Aktion",
        type: "select",
        required: true,
        options: [
          { value: "ADDED", label: "Hinzugefügt" },
          { value: "REMOVED", label: "Entfernt" },
          { value: "REPLACED", label: "Ersetzt" },
        ],
      },
    ],
  },
  {
    value: "Maintenance",
    label: "Wartung",
  },
  {
    value: "Cleaning",
    label: "Reinigung",
  },
  {
    value: "custom",
    label: "Eigenes Event",
    extraFields: CUSTOM_EVENT_EXTRA_FIELDS,
  },
];