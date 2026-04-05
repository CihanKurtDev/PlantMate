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
    FlaskConical,
    Zap,
    Clock,
    TriangleAlert,
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

export const WATER_COLORS = {
    ph: {
        base: '#d05959',
        soft: 'rgba(208, 89, 89, 0.18)',
    },
    ec: {
        base: '#087a6d',
        soft: 'rgba(8, 122, 109, 0.18)',
    },
} as const;

export const EVENT_COLORS = {
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
} as const;

export const DASHBOARD_COLORS = {
    environments: {
        base: '#82ac88',
        soft: 'rgba(130, 172, 136, 0.18)',
    },
    plants: {
        base: '#4e9a3d',
        soft: 'rgba(78, 154, 61, 0.18)',
    },
    warnings: {
        base: '#d05959',
        soft: 'rgba(208, 89, 89, 0.18)',
    },
    lastMeasurement: {
        base: '#087a6d',
        soft: 'rgba(8, 122, 109, 0.18)',
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

export const WATER_CONFIG = {
    ph: {
        label: 'pH',
        icon: FlaskConical,
        colors: WATER_COLORS.ph,
    },
    ec: {
        label: 'EC',
        icon: Zap,
        colors: WATER_COLORS.ec,
    },
} as const satisfies Record<string, IconConfig>;

export const DASHBOARD_CONFIG = {
    environments: {
        label: 'Environments',
        icon: Home,
        colors: DASHBOARD_COLORS.environments,
    },
    plants: {
        label: 'Pflanzen',
        icon: Sprout,
        colors: DASHBOARD_COLORS.plants,
    },
    warnings: {
        label: 'Warnungen',
        icon: TriangleAlert,
        colors: DASHBOARD_COLORS.warnings,
    },
    lastMeasurement: {
        label: 'Letzte Messung',
        icon: Clock,
        colors: DASHBOARD_COLORS.lastMeasurement,
    },
} as const satisfies Record<string, IconConfig>;

export const ALL_EVENT_CONFIG: Record<string, IconConfig> = {
    fertilizing: PLANT_EVENT_CONFIG.FERTILIZING,
    repotting: PLANT_EVENT_CONFIG.REPOTTING,
    pest_control: PLANT_EVENT_CONFIG.PEST_CONTROL,
    pruning: PLANT_EVENT_CONFIG.PRUNING,

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

    ph: WATER_CONFIG.ph,
    ec: WATER_CONFIG.ec,

    environments: DASHBOARD_CONFIG.environments,
    plants: DASHBOARD_CONFIG.plants,
    warnings: DASHBOARD_CONFIG.warnings,
    lastmeasurement: DASHBOARD_CONFIG.lastMeasurement,
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

export type DeviationLevel = 'ok' | 'warn' | 'critical';

export const DEVIATION_STYLES: Record<
    DeviationLevel,
    { color: string; background: string; statusText: string; description: string }
> = {
    ok: {
        color: '#2d7a3e',
        background: '#e8f5e9',
        statusText: 'OK',
        description: 'Wert liegt im optimalen Bereich',
    },
    warn: {
        color: '#8a5a00',
        background: '#fff3cd',
        statusText: '±',
        description: 'Wert leicht außerhalb des optimalen Bereichs',
    },
    critical: {
        color: '#b83232',
        background: '#ffeaea',
        statusText: '!',
        description: 'Wert deutlich außerhalb des optimalen Bereichs',
    },
};