import { PlantTableRow } from '@/components/Table/adapters/plantTableAdapter';
import { createGhostPlantRow } from '@/helpers/createGhostPlantRow';

export const PLANT_GHOST_ROWS: PlantTableRow[] = [
    createGhostPlantRow({
        key: 'ghost-1',
        title: 'Tomatenpflanze',
        species: 'Solanum lycopersicum',
        phValue: 6.1,
        phUnit: 'pH',
        ecValue: 1.8,
        ecUnit: 'mS/cm',
        lastWateringDate: 'Vor 1 Tag',
        phHistory: [5.9, 6.0, 6.1, 6.1],
        ecHistory: [1.6, 1.7, 1.8, 1.8],
    }),
    createGhostPlantRow({
        key: 'ghost-2',
        title: 'Basilikum',
        species: 'Ocimum basilicum',
        phValue: 5.8,
        phUnit: 'pH',
        ecValue: 1.2,
        ecUnit: 'mS/cm',
        lastWateringDate: 'Vor 3 Tagen',
        phHistory: [5.6, 5.7, 5.8, 5.8],
        ecHistory: [1.1, 1.2, 1.2, 1.2],
    }),
];