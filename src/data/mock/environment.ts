import { EnvironmentData } from "@/types/environment";

export const environments: EnvironmentData[] = [
    {
        id: 'env-1',
        name: 'Grow Tent 120x120',
        type: 'TENT',
        location: 'Keller',

        climate: {
            temp: { value: 24, unit: '°C' },
            humidity: { value: 55, unit: '%' },
            vpd: { value: 1.2, unit: 'kPa' },
            co2: { value: 0.12, unit: '%' },
        },
    },
    {
        id: 'env-2',
        name: 'Wohnzimmer Fenster',
        type: 'ROOM',
        location: 'Wohnung',

        climate: {
            temp: { value: 21, unit: '°C' },
            humidity: { value: 45, unit: '%' },
            vpd: { value: 1.0, unit: 'kPa' },
        },
    },
    {
        id: 'env-3',
        name: 'Gewächshaus Garten',
        type: 'GREENHOUSE',
        location: 'Garten',

        climate: {
            temp: { value: 28, unit: '°C' },
            humidity: { value: 65, unit: '%' },
            vpd: { value: 1.4, unit: 'kPa' },
            co2: { value: 0.09, unit: '%' },
        },
    },
];
