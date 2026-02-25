import { CUSTOM_EVENT_EXTRA_FIELDS, EventTypeConfig } from '@/types/events';

export { 
    PLANT_EVENT_CONFIG as PLANT_EVENT_MAP,
    getEventConfig,
    getIconConfig,
} from './icons';

export type { PlantEventType } from './icons';

export const PLANT_EVENT_FORM_CONFIG: EventTypeConfig[] = [
  {
    value: "REPOTTING",
    label: "Umtopfen",
    extraFields: [
      {
        key: "newPotSize",
        label: "Neue Topfgröße (L)",
        type: "number",
        required: true,
        placeholder: "z.B. 5",
      },
      {
        key: "oldPotSize",
        label: "Alte Topfgröße (L)",
        type: "number",
        placeholder: "z.B. 3",
      },
      {
        key: "substrate",
        label: "Substrat",
        type: "text",
        placeholder: "z.B. Kokoserde",
      },
    ],
  },
  {
    value: "FERTILIZING",
    label: "Düngen",
    extraFields: [
      {
        key: "fertilizer",
        label: "Dünger",
        type: "text",
        required: true,
        placeholder: "z.B. BioBizz Grow",
      },
      {
        key: "amount",
        label: "Menge (ml)",
        type: "number",
        placeholder: "z.B. 10",
      },
    ],
  },
  {
    value: "PEST_CONTROL",
    label: "Schädlingsbekämpfung",
    extraFields: [
      {
        key: "pest",
        label: "Schädling",
        type: "text",
        required: true,
        placeholder: "z.B. Spinnmilben",
      },
      {
        key: "treatment",
        label: "Behandlung",
        type: "text",
        required: true,
        placeholder: "z.B. Neem-Öl",
      },
    ],
  },
  {
    value: "PRUNING",
    label: "Beschneiden",
  },
  {
    value: "custom",
    label: "Eigenes Event",
    extraFields: CUSTOM_EVENT_EXTRA_FIELDS,
  },
];