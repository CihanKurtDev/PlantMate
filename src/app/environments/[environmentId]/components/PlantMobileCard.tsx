"use client";

import { WATER_COLORS } from '@/config/icons';
import { PlantTableRow } from '@/components/Table/adapters/plantTableAdapter';
import { MobileList, MobileCardData, HealthStatus, getMetricStatus } from '@/components/MobileCard/MobileCard';

const RANGES: Record<string, [number, number]> = {
    ph: [5.5, 6.5],
    ec: [1.0, 2.5],
};

function getHealth(_row: PlantTableRow): HealthStatus {
    return 'ok';
}

function mapRowToCardData(row: PlantTableRow): MobileCardData {
    return {
        key: row.key,
        href: `/environments/${row.environmentId}/plants/${row.key}`,
        title: row.title,
        subtitle: row.species,
        health: getHealth(row),
        metrics: [
            {
                label: 'PH',
                value: row.phValue,
                display: row.phValue !== null ? `${row.phValue}` : '—',
                status: getMetricStatus(row.phValue, RANGES, 'ph'),
            },
            {
                label: 'EC',
                value: row.ecValue,
                display: row.ecValue !== null ? `${row.ecValue}` : '—',
                status: getMetricStatus(row.ecValue, RANGES, 'ec'),
            },
        ],
        sparkline: {
            data: row.phHistory,
            color: WATER_COLORS.ph.base,
            id: `spark_${row.key}`,
            label: 'PH · 30 TAGE',
            currentValue: row.phValue !== null
                ? `${row.phValue} ${row.phUnit ?? ''}`
                : '—',
        },
        footerLabel: row.lastWateringDate,
    };
}

interface PlantMobileListProps {
    rows: PlantTableRow[];
    onAddNew?: () => void;
}

export function PlantMobileList({ rows, onAddNew }: PlantMobileListProps) {
    return (
        <MobileList
            title="Pflanzen"
            items={rows.map(mapRowToCardData)}
            searchFields={item => [item.title, item.subtitle]}
            onAddNew={onAddNew}
        />
    );
}