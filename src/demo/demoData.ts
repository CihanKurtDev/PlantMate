import type { EnvironmentData, EnvironmentData_Historical, EnvironmentEvent } from "@/types/environment";
import type { PlantData, PlantData_Historical, PlantEvent } from "@/types/plant";

export const DEMO_IDS = {
    environmentId: "demo-env-01",
    plantId: "demo-plant-01",
} as const;

const now = Date.now();
const day = 86_400_000;

export const DEMO_ENVIRONMENT: EnvironmentData = {
    id: DEMO_IDS.environmentId,
    name: "Demo Growzelt",
    type: "TENT",
    location: "Keller",
};

export const DEMO_PLANT: PlantData = {
    id: DEMO_IDS.plantId,
    title: "Basilikum Demo",
    species: "Ocimum basilicum",
    environmentId: DEMO_IDS.environmentId,
    profile: "kräuter",
};

export const DEMO_CLIMATE_ENTRIES: EnvironmentData_Historical[] = [
    {
        id: "demo-climate-1",
        environmentId: DEMO_IDS.environmentId,
        timestamp: now - day * 2,
        climate: {
            temp: { value: 22, unit: "°C" },
            humidity: { value: 65, unit: "%" },
            vpd: { value: 0.8, unit: "kPa" },
            co2: { value: 600, unit: "ppm" },
        },
    },
    {
        id: "demo-climate-2",
        environmentId: DEMO_IDS.environmentId,
        timestamp: now - day,
        climate: {
            temp: { value: 23.5, unit: "°C" },
            humidity: { value: 62, unit: "%" },
            vpd: { value: 0.9, unit: "kPa" },
            co2: { value: 650, unit: "ppm" },
        },
    },
    {
        id: "demo-climate-3",
        environmentId: DEMO_IDS.environmentId,
        timestamp: now,
        climate: {
            temp: { value: 21, unit: "°C" },
            humidity: { value: 68, unit: "%" },
            vpd: { value: 0.75, unit: "kPa" },
            co2: { value: 580, unit: "ppm" },
        },
    },
];

export const DEMO_ENVIRONMENT_EVENT: EnvironmentEvent = {
    id: "demo-env-event-1",
    environmentId: DEMO_IDS.environmentId,
    timestamp: now - day / 2,
    type: "Maintenance",
    notes: "Lüftung überprüft, Aktivkohlefilter gewechselt.",
};

export const DEMO_WATER_ENTRIES: PlantData_Historical[] = [
    {
        id: "demo-water-1",
        plantId: DEMO_IDS.plantId,
        timestamp: now - day * 2,
        water: {
            ph: { value: 6.2, unit: "pH" },
            ec: { value: 1.4, unit: "mS/cm" },
            amount: { value: 500, unit: "ml" },
        },
        notes: "Erste Wässerung nach Umtopfen",
    },
    {
        id: "demo-water-2",
        plantId: DEMO_IDS.plantId,
        timestamp: now - day,
        water: {
            ph: { value: 6.1, unit: "pH" },
            ec: { value: 1.5, unit: "mS/cm" },
            amount: { value: 600, unit: "ml" },
        },
    },
    {
        id: "demo-water-3",
        plantId: DEMO_IDS.plantId,
        timestamp: now,
        water: {
            ph: { value: 6.3, unit: "pH" },
            ec: { value: 1.3, unit: "mS/cm" },
            amount: { value: 550, unit: "ml" },
        },
    },
];

export const DEMO_PLANT_EVENT: PlantEvent = {
    id: "demo-plant-event-1",
    plantId: DEMO_IDS.plantId,
    timestamp: now - day / 2,
    type: "REPOTTING",
    notes: "Von 1L in 3L Topf umgetopft. Substrat: Coco + 30% Perlite.",
    repotting: {
        oldPotSize: { value: 1, unit: "L" },
        newPotSize: { value: 3, unit: "L" },
        substrate: "Coco + Perlite",
    },
};