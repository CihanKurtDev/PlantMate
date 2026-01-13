import { Home, Tent, Leaf, Thermometer, Wind, Droplet, LucideIcon, ActivityIcon } from "lucide-react";
import { EnvironmentType } from "@/types/environment";

export const ENVIRONMENT_ICONS: Record<EnvironmentType, any> = {
    TENT: Tent,
    ROOM: Home,
    GREENHOUSE: Leaf,
};

export const ENVIRONMENT_LABELS: Record<EnvironmentType, string> = {
    TENT: "Zelt",
    ROOM: "Raum",
    GREENHOUSE: "Gewächshaus",
};

export const ENVIRONMENT_EVENT_MAP: Record<
    string,
    {
        label: string;
        icon: LucideIcon;
    }
> = {
    Climate_Adjustment: {
        label: 'Climate Adjustment',
        icon: Thermometer,
    },
    Equipment_Change: {
        label: 'Equipment Change',
        icon: ActivityIcon,
    },
    Maintenance: {
        label: 'Maintenance',
        icon: Wind,
    },
    Cleaning: {
        label: 'Cleaning',
        icon: Droplet,
    },
} as const;

export type EnvironmentEventType = keyof typeof ENVIRONMENT_EVENT_MAP;