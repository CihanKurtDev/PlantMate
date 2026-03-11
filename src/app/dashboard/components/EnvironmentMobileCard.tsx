"use client";

import { CLIMATE_COLORS } from '@/config/icons';
import { ENVIRONMENT_LABELS } from '@/config/environment';
import { EnvironmentTableRow } from '@/components/Table/adapters/environmentTableAdapter';
import { MobileList, MobileCardData, HealthStatus, getMetricStatus } from '@/components/MobileCard/MobileCard';

function getHealth(row: EnvironmentTableRow): HealthStatus {
    if (row.tempBad || row.co2Bad) return 'danger';
    if (row.humidityBad || row.vpdBad) return 'warn';
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
            { label: 'TEMP', value: row.lastTemp, display: row.lastTemp !== null ? `${row.lastTemp}°` : '—', status: row.tempBad ? 'warn' : 'ok' },
            { label: 'RLF', value: row.lastHumidity, display: row.lastHumidity !== null ? `${row.lastHumidity}%` : '—', status: row.humidityBad ? 'warn' : 'ok' },
            { label: 'VPD', value: row.lastVpd, display: row.lastVpd !== null ? `${row.lastVpd}` : '—', status: row.vpdBad ? 'warn' : 'ok' },
            { label: 'CO₂', value: row.lastCo2, display: row.lastCo2 !== null ? `${row.lastCo2}` : '—', status: row.co2Bad ? 'warn' : 'ok' },
        ],
        sparkline: {
            data: row.tempHistory,
            color: CLIMATE_COLORS.temp.base,
            id: `spark_${row.key}`,
            label: 'TEMPERATUR · 30 TAGE',
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