"use client"
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card } from '@/components/Card/Card';
import { Button } from '@/components/Button/Button';
import Sparkline from '@/components/Sparkline/Sparkline';
import styles from './MobileCard.module.scss';

export type HealthStatus = 'ok' | 'warn' | 'danger';
export type MetricStatus = 'ok' | 'warn' | 'muted';

export interface MetricConfig {
    label: string;
    value: number | null;
    display: string;
    status: MetricStatus;
}

export interface SparklineConfig {
    data: number[];
    color: string;
    id: string;
    label: string;
    currentValue: string;
}

export interface MobileCardData {
    key: string;
    href: string;
    title: string;
    subtitle: string;
    health: HealthStatus;
    metrics: MetricConfig[];
    sparkline: SparklineConfig;
    footerLabel: string | null;
}


const HEALTH_LABELS: Record<HealthStatus, string> = {
    ok:     '✓ OK',
    warn:   '⚠ Warnung',
    danger: '✗ Kritisch',
};


export function getMetricStatus(
    value: number | null,
    ranges: Record<string, [number, number]>,
    key: string
): MetricStatus {
    if (value === null || value === undefined) return 'muted';
    const range = ranges[key];
    if (!range) return 'ok';
    const [lo, hi] = range;
    return value < lo || value > hi ? 'warn' : 'ok';
}


interface MobileCardProps {
    data: MobileCardData;
}

export function MobileCard({ data }: MobileCardProps) {
    const router = useRouter();
    const noData = !data.sparkline.data || data.sparkline.data.length < 2;

    const navigate = () => router.push(data.href);

    return (
        <div
            className={styles.card}
            onClick={navigate}
            role="button"
            tabIndex={0}
            onKeyDown={e => e.key === 'Enter' && navigate()}
        >
            <div className={styles.cardBody}>

                <div className={styles.cardTop}>
                    <div className={styles.cardInfo}>
                        <div className={styles.cardName}>{data.title}</div>
                        <div className={styles.cardMeta}>{data.subtitle}</div>
                    </div>
                    <span className={`${styles.badge} ${styles[`badge_${data.health}`]}`}>
                        {HEALTH_LABELS[data.health]}
                    </span>
                </div>

                {noData ? (
                    <div className={styles.noData}>Noch keine Messdaten vorhanden</div>
                ) : (
                    <>
                        <div className={styles.metrics}>
                            {data.metrics.map(metric => (
                                <div key={metric.label} className={styles.metric}>
                                    <span className={styles.metricLabel}>{metric.label}</span>
                                    <span className={`${styles.metricVal} ${styles[metric.status]}`}>
                                        {metric.display}
                                    </span>
                                </div>
                            ))}
                        </div>

                        <Sparkline
                            data={data.sparkline.data}
                            color={data.sparkline.color}
                            id={data.sparkline.id}
                            width="100%"
                            height={42}
                            label={data.sparkline.label}
                            currentValue={data.sparkline.currentValue}
                            className={styles.sparkWrap}
                        />
                    </>
                )}

                {data.footerLabel && (
                    <div className={styles.cardFooter}>
                        <span className={styles.measureLabel}>
                            Letzte Messung · {data.footerLabel}
                        </span>
                    </div>
                )}

            </div>
        </div>
    );
}


interface MobileListProps {
    title: string;
    items: MobileCardData[];
    searchFields: (item: MobileCardData) => string[];
    onAddNew?: () => void;
}

export function MobileList({ title, items, searchFields, onAddNew }: MobileListProps) {
    const [searchQuery, setSearchQuery] = useState('');

    const filteredItems = items.filter(item => {
        const normalizedQuery = searchQuery.toLowerCase();
        return searchFields(item).some(field =>
            field.toLowerCase().includes(normalizedQuery)
        );
    });

    return (
        <Card title={title} collapsible={true}>
            <div className={styles.toolbar}>
                <input
                    className={styles.search}
                    placeholder="Suchen…"
                    value={searchQuery}
                    onChange={e => setSearchQuery(e.target.value)}
                />
                {onAddNew && (
                    <Button onClick={onAddNew}>
                        + Neu
                    </Button>
                )}
            </div>

            <div className={styles.list}>
                {filteredItems.map(item => (
                    <MobileCard key={item.key} data={item} />
                ))}
            </div>
        </Card>
    );
}