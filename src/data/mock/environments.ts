import { EnvironmentData } from "@/types/environment";

const environments: EnvironmentData[] = [
    {
        id: 'env-1',
        name: 'Grow Tent 120x120',
        type: 'TENT',
        location: 'Keller',

        climate: {
            temp: { value: 24, unit: '°C' },
            humidity: { value: 55, unit: '%' },
            vpd: { value: 1.2, unit: 'kPa' },
            co2: { value: 0.12, unit: "ppm" },
        },
    },
    {
        id: 'env-2',
        name: 'Hydroponik Regal',
        type: 'ROOM',
        location: 'Arbeitszimmer',

        climate: {
            temp: { value: 22, unit: '°C' },
            humidity: { value: 48, unit: '%' },
            vpd: { value: 1.0, unit: 'kPa' },
            co2: { value: 0.10, unit: "ppm" },
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
            co2: { value: 0.09, unit: "ppm" },
        },
    },
    {
        id: 'env-4',
        name: 'Wintergarten Südseite',
        type: 'ROOM',
        location: 'Wohnzimmer',

        climate: {
            temp: { value: 23, unit: '°C' },
            humidity: { value: 50, unit: '%' },
            vpd: { value: 1.1, unit: 'kPa' },
            co2: { value: 0.11, unit: "ppm" },
        },
    },
    {
        id: 'env-5',
        name: 'Outdoor Hochbeet',
        type: 'GREENHOUSE',
        location: 'Terrasse',

        climate: {
            temp: { value: 20, unit: '°C' },
            humidity: { value: 58, unit: '%' },
            vpd: { value: 0.9, unit: 'kPa' },
            co2: { value: 0.08, unit: "ppm" },
        },
    },
    {
        id: 'env-6',
        name: 'Labor-Testsetup',
        type: 'ROOM',
        location: 'Technikraum',

        climate: {
            temp: { value: 25, unit: '°C' },
            humidity: { value: 40, unit: '%' },
            vpd: { value: 1.6, unit: 'kPa' },
            co2: { value: 0.14, unit: "ppm" },
        },
    },
];

export default environments;