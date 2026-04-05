import { EnvironmentTableRow } from '@/components/Table/adapters/environmentTableAdapter';
import { createGhostEnvironmentRow } from '@/helpers/createGhostEnvironmnetRow';

export const ENVIRONMENT_GHOST_ROWS: EnvironmentTableRow[] = [
    createGhostEnvironmentRow({
        key: 'ghost-1',
        name: 'Gewächshaus Nord',
        location: 'Keller',
        lastTemp: 22.4,
        lastHumidity: 58,
        lastVpd: 1.1,
        lastCo2: 820,
        lastMeasurementDate: 'Vor 2 Stunden',
        tempHistory: [21, 21.5, 22, 22.4],
    }),
    createGhostEnvironmentRow({
        key: 'ghost-2',
        name: 'Anzuchtstation',
        location: 'Dachboden',
        lastTemp: 19.8,
        lastHumidity: 72,
        lastVpd: 0.8,
        lastCo2: 650,
        lastMeasurementDate: 'Vor 5 Stunden',
        tempHistory: [18, 19, 19.5, 19.8],
    }),
];