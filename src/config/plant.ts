import { Sprout, Droplets, Activity, Leaf, LucideIcon } from 'lucide-react';

export const PLANT_EVENT_MAP: Record<
    string,
    {
        label: string;
        icon: LucideIcon;
    }
> = {
    WATERING: {
        label: 'Bewässerung',
        icon: Droplets,
    },
    FERTILIZING: {
        label: 'Düngen',
        icon: Leaf,
    },
    REPOTTING: {
        label: 'Umtopfen',
        icon: Sprout,
    },
    PEST_CONTROL: {
        label: 'Schädlingsbekämpfung',
        icon: Activity,
    },
    PRUNING: {
        label: 'Rückschnitt',
        icon: Activity,
    },
} as const;

export type PlantEventType = keyof typeof PLANT_EVENT_MAP;