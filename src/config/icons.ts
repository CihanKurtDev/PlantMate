import {
    Droplets,
    Leaf,
    Sprout,
    Activity,
    Thermometer,
    Settings,
    Wrench,
    Sparkles,
    Home,
    Tent,
    Wind,
    type LucideIcon,
} from 'lucide-react';

export const LOCATION_COLORS = {
    greenhouse: {
        base: '#2d7a3e',
        soft: 'rgba(45, 122, 62, 0.18)',
    },
    tent: {
        base: '#7b8f2a',
        soft: 'rgba(123, 143, 42, 0.18)',
    },
    room: {
        base: '#82ac88',
        soft: 'rgba(130, 172, 136, 0.18)',
    },
} as const;

export const CLIMATE_COLORS = {
    temp: {
        base: '#d05959',
        soft: 'rgba(208, 89, 89, 0.18)',
    },
    humidity: {
        base: '#087a6d',
        soft: 'rgba(8, 122, 109, 0.18)',
    },
    vpd: {
        base: '#d3893e',
        soft: 'rgba(211, 137, 62, 0.18)',
    },
    co2: {
        base: '#546e7a',
        soft: 'rgba(84, 110, 122, 0.18)',
    },
} as const;

export const EVENT_COLORS = {
    watering: {
        base: '#597fd0',
        soft: 'rgba(89, 127, 208, 0.18)',
    },
    fertilizing: {
        base: '#4e9a3d',
        soft: 'rgba(78, 154, 61, 0.18)',
    },
    repotting: {
        base: '#6b8e23',
        soft: 'rgba(107, 142, 35, 0.18)',
    },
    pest_control: {
        base: '#1f6f5a',
        soft: 'rgba(31, 111, 90, 0.18)',
    },
    pruning: {
        base: '#3f8f4e',
        soft: 'rgba(63, 143, 78, 0.18)',
    },
    equipment_change: {
        base: '#8d6e63',
        soft: 'rgba(141, 110, 99, 0.18)',
    },
    maintenance: {
        base: '#c77d00',
        soft: 'rgba(199, 125, 0, 0.18)',
    },
    cleaning: {
        base: '#2d7a3e',
        soft: 'rgba(45, 122, 62, 0.18)',
    },
    climate_adjustment: {
        base: '#d05959',
        soft: 'rgba(208, 89, 89, 0.18)',
    },
} as const;


export interface IconConfig {
    label: string;
    icon: LucideIcon;
    colors: {
        base: string;
        soft: string;
    };
}

export const PLANT_EVENT_CONFIG = {
    WATERING: {
        label: 'Bewässerung',
        icon: Droplets,
        colors: EVENT_COLORS.watering,
    },
    FERTILIZING: {
        label: 'Düngen',
        icon: Leaf,
        colors: EVENT_COLORS.fertilizing,
    },
    REPOTTING: {
        label: 'Umtopfen',
        icon: Sprout,
        colors: EVENT_COLORS.repotting,
    },
    PEST_CONTROL: {
        label: 'Schädlingsbekämpfung',
        icon: Activity,
        colors: EVENT_COLORS.pest_control,
    },
    PRUNING: {
        label: 'Rückschnitt',
        icon: Activity,
        colors: EVENT_COLORS.pruning,
    },
} as const satisfies Record<string, IconConfig>;

export type PlantEventType = keyof typeof PLANT_EVENT_CONFIG;

export const ENVIRONMENT_EVENT_CONFIG = {
    Climate_Adjustment: {
        label: 'Climate Adjustment',
        icon: Thermometer,
        colors: EVENT_COLORS.climate_adjustment,
    },
    Equipment_Change: {
        label: 'Equipment Change',
        icon: Settings,
        colors: EVENT_COLORS.equipment_change,
    },
    Maintenance: {
        label: 'Maintenance',
        icon: Wrench,
        colors: EVENT_COLORS.maintenance,
    },
    Cleaning: {
        label: 'Cleaning',
        icon: Sparkles,
        colors: EVENT_COLORS.cleaning,
    },
} as const satisfies Record<string, IconConfig>;

export type EnvironmentEventType = keyof typeof ENVIRONMENT_EVENT_CONFIG;

export const LOCATION_CONFIG = {
    greenhouse: {
        label: 'Gewächshaus',
        icon: Leaf,
        colors: LOCATION_COLORS.greenhouse,
    },
    tent: {
        label: 'Zelt',
        icon: Tent,
        colors: LOCATION_COLORS.tent,
    },
    room: {
        label: 'Raum',
        icon: Home,
        colors: LOCATION_COLORS.room,
    },
} as const satisfies Record<string, IconConfig>;

export const CLIMATE_CONFIG = {
    temp: {
        label: 'Temperatur',
        icon: Thermometer,
        colors: CLIMATE_COLORS.temp,
    },
    humidity: {
        label: 'Luftfeuchtigkeit',
        icon: Droplets,
        colors: CLIMATE_COLORS.humidity,
    },
    vpd: {
        label: 'VPD',
        icon: Wind,
        colors: CLIMATE_COLORS.vpd,
    },
    co2: {
        label: 'CO₂',
        icon: Wind,
        colors: CLIMATE_COLORS.co2,
    },
} as const satisfies Record<string, IconConfig>;


export const ALL_EVENT_CONFIG: Record<string, IconConfig> = {
    watering: PLANT_EVENT_CONFIG.WATERING,
    fertilizing: PLANT_EVENT_CONFIG.FERTILIZING,
    repotting: PLANT_EVENT_CONFIG.REPOTTING,
    pest_control: PLANT_EVENT_CONFIG.PEST_CONTROL,
    pruning: PLANT_EVENT_CONFIG.PRUNING,
    
    climate_adjustment: ENVIRONMENT_EVENT_CONFIG.Climate_Adjustment,
    equipment_change: ENVIRONMENT_EVENT_CONFIG.Equipment_Change,
    maintenance: ENVIRONMENT_EVENT_CONFIG.Maintenance,
    cleaning: ENVIRONMENT_EVENT_CONFIG.Cleaning,
};

export const ALL_ICON_CONFIG: Record<string, IconConfig> = {
    ...ALL_EVENT_CONFIG,
    greenhouse: LOCATION_CONFIG.greenhouse,
    tent: LOCATION_CONFIG.tent,
    room: LOCATION_CONFIG.room,

    temp: CLIMATE_CONFIG.temp,
    humidity: CLIMATE_CONFIG.humidity,
    vpd: CLIMATE_CONFIG.vpd,
    co2: CLIMATE_CONFIG.co2,
};

export function getEventConfig(eventType: string): IconConfig | undefined {
    const normalized = eventType.toLowerCase();
    return ALL_EVENT_CONFIG[normalized];
}

export function getIconConfig(type: string): IconConfig | undefined {
    const normalized = type.toLowerCase();
    return ALL_ICON_CONFIG[normalized];
}

export function isEventType(type: string): boolean {
    return getEventConfig(type) !== undefined;
}

export function isIconType(type: string): boolean {
    return getIconConfig(type) !== undefined;
}