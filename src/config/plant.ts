import { Sprout, Droplets, Activity, Leaf } from 'lucide-react';

export const PLANT_EVENT_MAP = {
    WATERING: {
        label: 'Bewässerung',
        icon: Droplets,
        color: 'watering',
    },
    FERTILIZING: {
        label: 'Düngen',
        icon: Leaf,
        color: 'fertilizing',
    },
    REPOTTING: {
        label: 'Umtopfen',
        icon: Sprout,
        color: 'repotting',
    },
    PEST_CONTROL: {
        label: 'Schädlingsbekämpfung',
        icon: Activity,
        color: 'pest',
    },
    PRUNING: {
        label: 'Rückschnitt',
        icon: Activity,
        color: 'pruning',
    },
} as const;

export type PlantEventType = keyof typeof PLANT_EVENT_MAP;