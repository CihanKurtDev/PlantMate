"use client"
import { useRouter } from 'next/navigation';
import { EnvironmentTableRow } from '@/components/Table/adapters/environmentTableAdapter';
import { CLIMATE_COLORS } from '@/config/icons';
import styles from './EnvironmentMobileCard.module.scss';
import { Card } from '@/components/Card/Card';
import { Button } from '@/components/Button/Button';
import Sparkline from '@/components/Sparkline/Sparkline';
import { ENVIRONMENT_LABELS } from '@/config/environment';

type Status = 'ok' | 'warn' | 'muted';

const RANGES: Record<string, [number, number]> = {
    temp:     [20, 28],
    humidity: [40, 70],
    vpd:      [0.8, 1.6],
    co2:      [400, 1500],
};

function getStatus(value: number | null, key: string): Status {
    if (value === null || value === undefined) return 'muted';
    const [lo, hi] = RANGES[key] ?? [];
    if (lo === undefined) return 'ok';
    return value < lo || value > hi ? 'warn' : 'ok';
}

function getHealthFromRow(row: EnvironmentTableRow): 'ok' | 'warn' | 'danger' {
    const tempBad     = row.lastTemp !== null && (row.lastTemp < 20 || row.lastTemp > 28);
    const humidityBad = row.lastHumidity !== null && (row.lastHumidity < 40 || row.lastHumidity > 70);
    const co2Bad      = row.lastCo2 !== null && row.lastCo2 > 1500;
    if (tempBad || co2Bad) return 'danger';
    if (humidityBad || (row.lastVpd !== null && (row.lastVpd < 0.8 || row.lastVpd > 1.6))) return 'warn';
    if (!row.lastTemp && !row.lastHumidity) return 'warn';
    return 'ok';
}

const HEALTH_LABELS = {
    ok:     '✓ OK',
    warn:   '⚠ Warnung',
    danger: '✗ Kritisch',
};

interface EnvironmentMobileCardProps {
    row: EnvironmentTableRow;
}

function EnvironmentMobileCard({ row }: EnvironmentMobileCardProps) {
    const router = useRouter();
    const health = getHealthFromRow(row);
    const noData = !row.tempHistory || row.tempHistory.length < 2;

    const metrics = [
        { label: 'TEMP', value: row.lastTemp, key: 'temp', display: row.lastTemp !== null ? `${row.lastTemp}°` : '—' },
        { label: 'FEUCHTE', value: row.lastHumidity, key: 'humidity', display: row.lastHumidity !== null ? `${row.lastHumidity}%`    : '—' },
        { label: 'VPD', value: row.lastVpd, key: 'vpd', display: row.lastVpd !== null ? `${row.lastVpd}` : '—' },
        { label: 'CO₂', value: row.lastCo2, key: 'co2', display: row.lastCo2 !== null ? `${row.lastCo2}` : '—' },
    ];

    const tempDisplay = row.lastTemp !== null
        ? `${row.lastTemp} ${row.lastTempUnit ?? '°C'}`
        : '—';

    return (
        <div
            className={styles.card}
            onClick={() => router.push(`/environments/${row.key}`)}
            role="button"
            tabIndex={0}
            onKeyDown={e => e.key === 'Enter' && router.push(`/environments/${row.key}`)}
        >
            <div className={styles.cardBody}>

                <div className={styles.cardTop}>
                    <div className={styles.cardInfo}>
                        <div className={styles.cardName}>{row.name}</div>
                        <div className={styles.cardMeta}>
                            {ENVIRONMENT_LABELS[row.type as keyof typeof ENVIRONMENT_LABELS] ?? row.type}
                            {row.location ? ` · ${row.location}` : ''}
                        </div>
                    </div>
                    <span className={`${styles.badge} ${styles[`badge_${health}`]}`}>
                        {HEALTH_LABELS[health]}
                    </span>
                </div>

                {noData ? (
                    <div className={styles.noData}>Noch keine Messdaten vorhanden</div>
                ) : (
                    <>
                        <div className={styles.metrics}>
                            {metrics.map(m => (
                                <div key={m.key} className={styles.metric}>
                                    <span className={styles.metricLabel}>{m.label}</span>
                                    <span className={`${styles.metricVal} ${styles[getStatus(m.value, m.key)]}`}>
                                        {m.display}
                                    </span>
                                </div>
                            ))}
                        </div>

                        <Sparkline
                            data={row.tempHistory}
                            color={CLIMATE_COLORS.temp.base}
                            id={`spark_${row.key}`}
                            width="100%"
                            height={42}
                            label="TEMPERATUR · 30 TAGE"
                            currentValue={tempDisplay}
                            className={styles.sparkWrap}
                        />
                    </>
                )}

                {row.lastMeasurementDate && (
                    <div className={styles.cardFooter}>
                        <span className={styles.measureLabel}>
                            Letzte Messung · {row.lastMeasurementDate}
                        </span>
                    </div>
                )}

            </div>
        </div>
    );
}

interface EnvironmentMobileListProps {
    rows: EnvironmentTableRow[];
    onAddNew?: () => void;
}

export function EnvironmentMobileList({ rows, onAddNew }: EnvironmentMobileListProps) {
    return (
        <Card title='Environments' collapsible={true}>
            <div className={styles.toolbar}>
                <input className={styles.search} placeholder="Suchen…" />
                {onAddNew && (
                    <Button onClick={onAddNew}>
                        + Neu
                    </Button>
                )}
            </div>

            <div className={styles.list}>
                {rows.map(row => (
                    <EnvironmentMobileCard key={row.key} row={row} />
                ))}
            </div>
        </Card>
    );
}