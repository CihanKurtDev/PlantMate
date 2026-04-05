import { PlantTableRow } from '@/components/Table/adapters/plantTableAdapter';

export function createGhostPlantRow(
    overrides: Partial<PlantTableRow>
): PlantTableRow {
    return {
        key: 'ghost',
        title: 'Ghost',
        species: '',
        environmentId: '',

        phValue: null,
        phUnit: null,
        phBad: false,

        ecValue: null,
        ecUnit: null,
        ecBad: false,

        lastEventType: null,
        lastEventTimestamp: 0,
        lastEventFormatted: null,

        lastWateringTimestamp: 0,
        lastWateringDate: null,
        daysSinceWatering: 999,

        events: [],

        phHistory: [],
        ecHistory: [],

        ...overrides,
    };
}