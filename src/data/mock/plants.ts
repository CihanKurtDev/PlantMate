import { PlantData } from "@/types/plant";

const plants: PlantData[] = [
    {
        id: 'plant1',
        title: 'Tomate Cherry',
        species: 'Solanum lycopersicum',
        environmentId: 'env-2',
        water: {
            ph: { value: 6.2, unit: 'pH' },
            ec: { value: 2.1, unit: 'mS/cm' },
        },
    },
    {
        id: 'plant2',
        title: 'Basilikum Genovese',
        species: 'Ocimum basilicum',
        environmentId: 'env-2',
        water: {
            ph: { value: 6.0, unit: 'pH' },
            ec: { value: 1.4, unit: 'mS/cm' },
        },
    },
    {
        id: 'plant3',
        title: 'Paprika Sweet Red',
        species: 'Capsicum annuum',
        environmentId: 'env-1',
        water: {
            ph: { value: 6.3, unit: 'pH' },
            ec: { value: 2.3, unit: 'mS/cm' },
        },
    },
    {
        id: 'plant4',
        title: 'Zucchini Black Beauty',
        species: 'Cucurbita pepo',
        environmentId: 'env-5',
        water: {
            ph: { value: 6.5, unit: 'pH' },
            ec: { value: 1.8, unit: 'mS/cm' },
        },
    },
    {
        id: 'plant5',
        title: 'Erdbeere Elsanta',
        species: 'Fragaria × ananassa',
        environmentId: 'env-3',
        water: {
            ph: { value: 5.8, unit: 'pH' },
            ec: { value: 1.2, unit: 'mS/cm' },
        },
    },
    {
        id: 'plant6',
        title: 'Gurke Salatgurke',
        species: 'Cucumis sativus',
        environmentId: 'env-3',
        water: {
            ph: { value: 6.1, unit: 'pH' },
            ec: { value: 2.0, unit: 'mS/cm' },
        },
    },
    {
        id: 'plant7',
        title: 'Minze Pfefferminze',
        species: 'Mentha × piperita',
        environmentId: 'env-1',
        water: {
            ph: { value: 6.1, unit: 'pH' },
            ec: { value: 1.0, unit: 'mS/cm' },
        },
    },
    {
        id: 'plant8',
        title: 'Rosmarin',
        species: 'Salvia rosmarinus',
        environmentId: 'env-4',
        water: {
            ph: { value: 6.8, unit: 'pH' },
            ec: { value: 0.9, unit: 'mS/cm' },
        },
    },
    {
        id: 'plant9',
        title: 'Chili Habanero',
        species: 'Capsicum chinense',
        environmentId: 'env-6',
        water: {
            ph: { value: 6.0, unit: 'pH' },
            ec: { value: 2.6, unit: 'mS/cm' },
        },
    },
    {
        id: 'plant10',
        title: 'Salat Lollo Bionda',
        species: 'Lactuca sativa',
        environmentId: 'env-2',
        water: {
            ph: { value: 5.9, unit: 'pH' },
            ec: { value: 1.3, unit: 'mS/cm' },
        },
    },
    {
        id: 'plant11',
        title: 'Lavendel Provence',
        species: 'Lavandula angustifolia',
        environmentId: 'env-5',
        water: {
            ph: { value: 7.0, unit: 'pH' },
            ec: { value: 0.8, unit: 'mS/cm' },
        },
    },
    {
        id: 'plant12',
        title: 'Koriander',
        species: 'Coriandrum sativum',
        environmentId: 'env-4',
        water: {
            ph: { value: 6.4, unit: 'pH' },
            ec: { value: 1.1, unit: 'mS/cm' },
        },
    },
];

export default plants;