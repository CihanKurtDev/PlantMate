import { PlantData } from "@/types/plant";

export const plants: PlantData[] = [
    {
        id: 'plant1',
        title: 'Tomate Cherry',
        species: 'Solanum lycopersicum',
        environmentId: 'env2',
        water: {
            ph: { value: 6.2, unit: 'pH' },
            ec: { value: 2.1, unit: 'mS/cm' },
        },
    },
    {
        id: 'plant2',
        title: 'Basilikum Genovese',
        species: 'Ocimum basilicum',
        environmentId: 'env2',
        water: {
            ph: { value: 6.5, unit: 'pH' },
            ec: { value: 1.8, unit: 'mS/cm' },
        },
    },
    {
        id: 'plant3',
        title: 'Gurke Salatgurke',
        species: 'Cucumis sativus',
        environmentId: 'env3',
        water: {
            ph: { value: 6.0, unit: 'pH' },
            ec: { value: 2.0, unit: 'mS/cm' },
        },
    },
    {
        id: 'plant4',
        title: 'Orchidee Phalaenopsis',
        species: 'Phalaenopsis spp.',
        environmentId: 'env1',
        water: {
            ph: { value: 5.8, unit: 'pH' },
            ec: { value: 0.8, unit: 'mS/cm' },
        },
    },
    {
        id: 'plant5',
        title: 'Salat Kopfsalat',
        species: 'Lactuca sativa',
        environmentId: 'env4',
        water: {
            ph: { value: 6.4, unit: 'pH' },
            ec: { value: 1.5, unit: 'mS/cm' },
        },
    },
    {
        id: 'plant6',
        title: 'Paprika Sweet Pepper',
        species: 'Capsicum annuum',
        environmentId: 'env3',
        water: {
            ph: { value: 6.3, unit: 'pH' },
            ec: { value: 2.2, unit: 'mS/cm' },
        },
    },
    {
        id: 'plant7',
        title: 'Minze Pfefferminze',
        species: 'Mentha × piperita',
        environmentId: 'env1',
        water: {
            ph: { value: 6.1, unit: 'pH' },
            ec: { value: 1.0, unit: 'mS/cm' },
        },
    },
];