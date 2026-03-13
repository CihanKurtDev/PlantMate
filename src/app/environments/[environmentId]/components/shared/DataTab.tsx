"use client";

import {
    AreaChart,
    Area,
    XAxis,
    YAxis,
    Tooltip,
    ResponsiveContainer,
} from "recharts";
import {
    TrendingUp,
    TrendingDown,
    Minus,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import EmptyState from "./EmptyState";
import TabContent from "./TabContent";
import styles from "./DataTab.module.scss";
import { Card } from "@/components/Card/Card";
import { formatDate, formatDateShort } from "@/helpers/date";
import { TimeSeriesEntry } from "@/types/events";
import { DeviationLevel, DEVIATION_STYLES } from "@/config/icons";

export interface MetricConfig {
    key: string;
    label: string;
    unit: string;
    color: string;
    icon: LucideIcon;
    min: number;
    max: number;
    idealMin: number;
    idealMax: number;
    format: (v: number) => string;
}

interface ChartDatum {
    t: number;
    v: number;
}

interface Trend {
    diff: number;
    pct: string;
}

interface MetricRowProps {
    metric: MetricConfig;
    data: TimeSeriesEntry[];
    hasHistory: boolean;
}

function toRangePercent(value: number, min: number, max: number): number {
    return Math.min(100, Math.max(0, ((value - min) / (max - min)) * 100));
}

function getMetricValue(entry: TimeSeriesEntry, key: string): number | undefined {
    return entry.metrics?.[key];
}

function getTrend(data: TimeSeriesEntry[], key: string): Trend | null {
    if (data.length < 2) return null;
    const first = getMetricValue(data[0], key);
    const last = getMetricValue(data[data.length - 1], key);
    if (first === undefined || last === undefined || first === 0) return null;
    const diff = last - first;
    const pct = ((diff / first) * 100).toFixed(1);
    return { diff, pct };
}

function getDeviationLevel(value: number, metric: MetricConfig): DeviationLevel {
    const { idealMin, idealMax } = metric;
    const warnBuffer = (idealMax - idealMin) * 0.2;
    if (value >= idealMin && value <= idealMax) return "ok";
    if (value >= idealMin - warnBuffer && value <= idealMax + warnBuffer) return "warn";
    return "critical";
}

interface AreaTooltipProps {
    active?: boolean;
    payload?: readonly { value: number; name: string; color: string }[];
    label?: string | number;
    metric: MetricConfig;
}

function AreaTooltip({ active, payload, label, metric }: AreaTooltipProps) {
    if (!active || !payload?.length || label === undefined) return null;
    const value = payload[0]?.value;
    if (typeof value !== "number") return null;

    return (
        <div className={styles.customTooltip}>
            <p className={styles.tooltipLabel}>{formatDateShort(new Date(Number(label)))}</p>
            <p className={styles.tooltipItem} style={{ color: metric.color }}>
                {metric.label}: {metric.format(value)}
            </p>
        </div>
    );
}

function MetricRow({ metric, data, hasHistory }: MetricRowProps) {
    const latest = getMetricValue(data[data.length - 1], metric.key);
    if (latest === undefined) return null;

    const deviation = getDeviationLevel(latest, metric);
    const deviationStyle = DEVIATION_STYLES[deviation];

    const trend = getTrend(data, metric.key);
    const valuePct = toRangePercent(latest, metric.min, metric.max);
    const idealStartPct = toRangePercent(metric.idealMin, metric.min, metric.max);
    const idealWidthPct = toRangePercent(metric.idealMax, metric.min, metric.max) - idealStartPct;

    const chartData: ChartDatum[] = data
        .map(entry => {
            const v = getMetricValue(entry, metric.key);
            return v !== undefined ? { t: entry.timestamp, v } : undefined;
        })
        .filter(Boolean) as ChartDatum[];

    const TrendIcon = !trend ? Minus : trend.diff > 0 ? TrendingUp : TrendingDown;
    const trendColor = !trend ? undefined : deviationStyle.color;
    const Icon = metric.icon;

    return (
        <div className={styles.metricRow}>
            <div className={styles.metricLeft}>
                <div className={styles.metricHeader}>
                    <div
                        className={styles.metricIconWrap}
                        style={{ background: `${metric.color}18` }}
                    >
                        <Icon size={14} color={metric.color} />
                    </div>
                    <span className={styles.metricLabel}>{metric.label}</span>
                    <span
                        className={styles.metricBadge}
                        style={{
                            color: deviationStyle.color,
                            background: deviationStyle.background,
                        }}
                    >
                        {deviationStyle.statusText}
                    </span>
                </div>

                <div className={styles.metricValueRow}>
                    <span className={styles.metricValue} style={{ color: metric.color }}>
                        {metric.format(latest)}
                    </span>
                    {trend && (
                        <span
                            className={styles.metricTrend}
                            style={{
                                color: trendColor,
                                background: `${trendColor}18`,
                            }}
                        >
                            <TrendIcon size={13} />
                            {trend.diff > 0 ? "+" : ""}
                            {trend.pct}%
                        </span>
                    )}
                </div>

                <div className={styles.rangeBar}>
                    <div
                        className={styles.rangeIdeal}
                        style={{
                            left: `${idealStartPct}%`,
                            width: `${idealWidthPct}%`,
                            background: `${metric.color}30`,
                        }}
                    />
                    <div
                        className={styles.rangeMarker}
                        style={{
                            left: `calc(${valuePct}% - 6px)`,
                            background: metric.color,
                            boxShadow: `0 0 6px ${metric.color}88`,
                        }}
                    />
                </div>

                <div className={styles.rangeLabels}>
                    <span>{metric.min} {metric.unit}</span>
                    <span>Ziel: {metric.idealMin}–{metric.idealMax}</span>
                    <span>{metric.max} {metric.unit}</span>
                </div>

                {hasHistory && (
                    <div className={styles.metricSparkline}>
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={chartData} margin={{ top: 2, right: 0, left: 0, bottom: 0 }}>
                                <defs>
                                    <linearGradient id={`spark-${metric.key}`} x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="0%" stopColor={metric.color} stopOpacity={0.25} />
                                        <stop offset="100%" stopColor={metric.color} stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <Area type="monotone" dataKey="v" stroke={metric.color} strokeWidth={1.5} fill={`url(#spark-${metric.key})`} dot={false} isAnimationActive={false} />
                                <YAxis domain={["auto", "auto"]} hide />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                )}
            </div>

            {hasHistory && (
                <div className={styles.metricChart}>
                    <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={chartData} margin={{ top: 4, right: 4, left: 0, bottom: 0 }}>
                            <defs>
                                <linearGradient id={`grad-${metric.key}`} x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="0%" stopColor={metric.color} stopOpacity={0.25} />
                                    <stop offset="100%" stopColor={metric.color} stopOpacity={0} />
                                </linearGradient>
                            </defs>
                            <Area type="monotone" dataKey="v" stroke={metric.color} strokeWidth={2} fill={`url(#grad-${metric.key})`} dot={false} isAnimationActive={false} />
                            <YAxis domain={["auto", "auto"]} hide />
                            <XAxis dataKey="t" hide={false} tickFormatter={value => formatDate(value)} />
                            <Tooltip content={props => <AreaTooltip {...props} metric={metric} />} />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>
            )}
        </div>
    );
}

interface DataTabProps {
    data: TimeSeriesEntry[];
    metrics: MetricConfig[];
}

export default function DataTab({ data, metrics }: DataTabProps) {
    const hasHistory = data.length > 1;
    const isEmpty = data.length === 0;

    return (
        <TabContent id="Klima">
            <Card title="Klimadaten" collapsible={true}>
                {isEmpty ? (
                    <EmptyState message="Keine Klimadaten vorhanden" />
                ) : (
                    <div className={styles.metricList}>
                        {metrics.map(metric => (
                            <MetricRow
                                key={metric.key}
                                metric={metric}
                                data={data}
                                hasHistory={hasHistory}
                            />
                        ))}
                    </div>
                )}
            </Card>
        </TabContent>
    );
}