"use client"
import { useRouter } from 'next/navigation';
import { WATER_COLORS } from '@/config/icons';
import styles from './PlantMobileCard.module.scss';
import { Card } from '@/components/Card/Card';
import { Button } from '@/components/Button/Button';
import Sparkline from '@/components/Sparkline/Sparkline';
import { PlantTableRow } from '@/components/Table/adapters/plantTableAdapter';

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

function getHealthFromRow(row: PlantTableRow): 'ok' | 'warn' | 'danger' {
    return "ok"
}

const HEALTH_LABELS = {
    ok:     '✓ OK',
    warn:   '⚠ Warnung',
    danger: '✗ Kritisch',
};

interface PlantMobileCardProps {
    row: PlantTableRow;
}

function PlantMobileCard({ row }: PlantMobileCardProps) {
    const router = useRouter();
    const health = getHealthFromRow(row);
    const noData = !row.phHistory || row.phHistory.length < 2;

    const metrics = [
        { label: 'PH', value: row.phValue, key: 'ph', display: row.phValue !== null ? `${row.phValue}` : '—' },
        { label: 'EC', value: row.ecValue, key: 'ec', display: row.ecValue !== null ? `${row.ecValue}` : '—' },
    ];

    const tempDisplay = row.phValue !== null
        ? `${row.phValue} ${row.phUnit ?? ''}`
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
                        <div className={styles.cardName}>{row.title}</div>
                        <div className={styles.cardMeta}>
                            METADATA
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
                            data={row.phHistory}
                            color={WATER_COLORS.ph.base}
                            id={`spark_${row.key}`}
                            width="100%"
                            height={42}
                            label="PH · 30 TAGE"
                            currentValue={tempDisplay}
                            className={styles.sparkWrap}
                        />
                    </>
                )}

                {row.lastWateringDate && (
                    <div className={styles.cardFooter}>
                        <span className={styles.measureLabel}>
                            Letzte Messung · {row.lastWateringDate}
                        </span>
                    </div>
                )}

            </div>
        </div>
    );
}

interface PlantMobileListProps {
    rows: PlantTableRow[];
    onAddNew?: () => void;
}

export function PlantMobileList({ rows, onAddNew }: PlantMobileListProps) {
    return (
        <Card title='Pflanzen' collapsible={true}>
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
                    <PlantMobileCard key={row.key} row={row} />
                ))}
            </div>
        </Card>
    );
}