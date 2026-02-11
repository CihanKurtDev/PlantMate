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