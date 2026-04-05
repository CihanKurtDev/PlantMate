import { EnvironmentTableRow } from '@/components/Table/adapters/environmentTableAdapter';
import { getProfile } from '@/config/profiles';

export function createGhostEnvironmentRow(
  overrides: Partial<EnvironmentTableRow>
): EnvironmentTableRow {
  return {
    key: 'ghost',
    name: 'Ghost',
    type: 'indoor',
    location: null,
    profiles: [getProfile('generic')],

    lastTemp: null,
    lastTempUnit: '°C',
    tempBad: false,

    lastHumidity: null,
    humidityBad: false,

    lastVpd: null,
    vpdBad: false,

    lastCo2: null,
    co2Bad: false,

    lastMeasurementTimestamp: 0,
    lastMeasurementDate: null,
    daysSinceLastMeasurement: 0,

    lastEventType: null,
    lastEventTimestamp: 0,
    lastEventFormatted: null,

    profilesLabel: '—',

    events: [],

    tempHistory: [],
    humidityHistory: [],
    vpdHistory: [],
    co2History: [],

    ...overrides,
  };
}