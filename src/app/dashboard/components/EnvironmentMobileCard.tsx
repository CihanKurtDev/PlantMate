"use client"
import { CLIMATE_COLORS } from '@/config/icons';
import { ENVIRONMENT_LABELS } from '@/config/environment';
import { EnvironmentTableRow } from '@/components/Table/adapters/environmentTableAdapter';
import { MobileList, MobileCardData, HealthStatus, getMetricStatus } from '@/components/MobileCard/MobileCard';

const RANGES: Record<string, [number, number]> = {
    temp:     [20, 28],
    humidity: [40, 70],
    vpd:      [0.8, 1.6],
    co2:      [400, 1500],
};

function getHealth(row: EnvironmentTableRow): HealthStatus {
    const tempBad     = row.lastTemp !== null && (row.lastTemp < 20 || row.lastTemp > 28);
    const humidityBad = row.lastHumidity !== null && (row.lastHumidity < 40 || row.lastHumidity > 70);
    const co2Bad      = row.lastCo2 !== null && row.lastCo2 > 1500;
    if (tempBad || co2Bad) return 'danger';
    if (humidityBad || (row.lastVpd !== null && (row.lastVpd < 0.8 || row.lastVpd > 1.6))) return 'warn';
    if (!row.lastTemp && !row.lastHumidity) return 'warn';
    return 'ok';
}

function mapRowToCardData(row: EnvironmentTableRow): MobileCardData {
    const tempDisplay = row.lastTemp !== null
        ? `${row.lastTemp} ${row.lastTempUnit ?? '°C'}`
        : '—';

    return {
        key: row.key,
        href: `/environments/${row.key}`,
        title: row.name,
        subtitle: [
            ENVIRONMENT_LABELS[row.type as keyof typeof ENVIRONMENT_LABELS] ?? row.type,
            row.location,
        ].filter(Boolean).join(' · '),
        health: getHealth(row),
        metrics: [
            { label: 'TEMP', value: row.lastTemp,     display: row.lastTemp !== null     ? `${row.lastTemp}°`     : '—', status: getMetricStatus(row.lastTemp,     RANGES, 'temp')     },
            { label: 'RLF',  value: row.lastHumidity, display: row.lastHumidity !== null ? `${row.lastHumidity}%` : '—', status: getMetricStatus(row.lastHumidity, RANGES, 'humidity') },
            { label: 'VPD',  value: row.lastVpd,      display: row.lastVpd !== null      ? `${row.lastVpd}`       : '—', status: getMetricStatus(row.lastVpd,      RANGES, 'vpd')      },
            { label: 'CO₂',  value: row.lastCo2,      display: row.lastCo2 !== null      ? `${row.lastCo2}`       : '—', status: getMetricStatus(row.lastCo2,      RANGES, 'co2')      },
        ],
        sparkline: {
            data:         row.tempHistory,
            color:        CLIMATE_COLORS.temp.base,
            id:           `spark_${row.key}`,
            label:        'TEMPERATUR · 30 TAGE',
            currentValue: tempDisplay,
        },
        footerLabel: row.lastMeasurementDate,
    };
}


interface EnvironmentMobileListProps {
    rows: EnvironmentTableRow[];
    onAddNew?: () => void;
}

export function EnvironmentMobileList({ rows, onAddNew }: EnvironmentMobileListProps) {
    const items = rows.map(mapRowToCardData);

    return (
        <MobileList
            title="Environments"
            items={items}
            searchFields={item => [item.title, item.subtitle]}
            onAddNew={onAddNew}
        />
    );
}