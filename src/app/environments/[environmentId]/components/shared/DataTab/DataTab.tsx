"use client";

import { useMemo, useState } from "react";
import { useHasMounted } from "@/hooks/useHasMounted";
import {
    AreaChart,
    Area,
    XAxis,
    YAxis,
    Tooltip,
    ResponsiveContainer,
} from "recharts";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import styles from "./DataTab.module.scss";
import { Card } from "@/components/Card/Card";
import { formatDate, formatDateShort } from "@/helpers/date";
import { TimeSeriesEntry } from "@/types/events";
import { DEVIATION_STYLES, DeviationLevel } from "@/config/icons";
import { UnitToggle } from "./UnitToggle";
import TabContent from "@/components/TabContent/TabContent";
import { GhostState } from "../GhostState/GhostState";
import { GhostCard } from "../GhostState/GhostCard";
import { Tooltip as BadgeTooltip } from "@/components/Tooltip/Tooltip";

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
    chartsMounted: boolean;
    useFahrenheit?: boolean;
    onToggleFahrenheit?: (v: boolean) => void;
}

interface GhostMetricRowProps {
    metric: MetricConfig;
    chartsMounted: boolean;
}

interface AreaTooltipProps {
    active?: boolean;
    payload?: readonly { value: number; name: string; color: string }[];
    label?: string | number;
    metric: MetricConfig;
}

interface DataTabProps {
    data: TimeSeriesEntry[];
    metrics: MetricConfig[];
    title: string;
    emptyTitle: string;
    emptyText: string;
    ctaLabel: string;
    onAddMeasurement?: () => void;
    id?: string;
}

const GHOST_BASE_TIMESTAMP = Date.UTC(2024, 0, 1, 12, 0, 0, 0);
const GHOST_OK_TEXT = "var(--color-text-success)";
const GHOST_OK_BG = "var(--color-flag-success)";

function toRangePercent(value: number, min: number, max: number): number {
    return Math.min(100, Math.max(0, ((value - min) / (max - min)) * 100));
}

function getMetricValue(entry: TimeSeriesEntry, key: string): number | undefined {
    return entry?.metrics?.[key];
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

export function toF(c: number): number {
    return (c * 9) / 5 + 32;
}

function getDisplayMetric(metric: MetricConfig, useFahrenheit: boolean): MetricConfig {
    if (metric.key !== "temp" || !useFahrenheit) return metric;
    return {
        ...metric,
        unit: "°F",
        min: toF(metric.min),
        max: toF(metric.max),
        idealMin: toF(metric.idealMin),
        idealMax: toF(metric.idealMax),
        format: (v) => `${v.toFixed(1)} °F`,
    };
}

function generateGhostData(idealMin: number, idealMax: number): ChartDatum[] {
    const mid = (idealMin + idealMax) / 2;
    const range = (idealMax - idealMin) * 0.4;
    const offsets = [0.2, -0.1, 0.4, 0.1, -0.2, 0.5, 0.3, -0.15, 0.35, 0.2, -0.05, 0.25];
    return offsets.map((o, i) => ({
        t: GHOST_BASE_TIMESTAMP - (offsets.length - 1 - i) * 3600000,
        v: mid + o * range,
    }));
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

function GhostMetricRow({ metric, chartsMounted }: GhostMetricRowProps) {
    const mid = (metric.idealMin + metric.idealMax) / 2;
    const ghostData = useMemo(
        () => generateGhostData(metric.idealMin, metric.idealMax),
        [metric.idealMin, metric.idealMax]
    );
    const valuePct = toRangePercent(mid, metric.min, metric.max);
    const idealStartPct = toRangePercent(metric.idealMin, metric.min, metric.max);
    const idealWidthPct = toRangePercent(metric.idealMax, metric.min, metric.max) - idealStartPct;
    const Icon = metric.icon;

    return (
        <div className={styles.metricRow}>
            <div className={styles.metricLeft}>
                <div className={styles.metricHeader}>
                    <div className={styles.metricIconWrap} style={{ background: `${metric.color}18` }}>
                        <Icon size={14} color={metric.color} />
                    </div>
                    <span className={styles.metricLabel}>{metric.label}</span>
                    <span className={styles.metricBadge} style={{ color: GHOST_OK_TEXT, background: GHOST_OK_BG }}>
                        OK
                    </span>
                </div>

                <div className={styles.metricValueRow}>
                    <span className={styles.metricValue} style={{ color: metric.color }}>
                        {metric.format(mid)}
                    </span>
                </div>

                <div className={styles.rangeBar}>
                    <div
                        className={styles.rangeIdeal}
                        style={{ left: `${idealStartPct}%`, width: `${idealWidthPct}%`, background: `${metric.color}30` }}
                    />
                    <div
                        className={styles.rangeMarker}
                        style={{ left: `calc(${valuePct}% - 6px)`, background: metric.color }}
                    />
                </div>

                <div className={styles.rangeLabels}>
                    <span>{metric.min.toFixed(0)} {metric.unit}</span>
                    <span>Ziel: {metric.idealMin.toFixed(0)}–{metric.idealMax.toFixed(0)}</span>
                    <span>{metric.max.toFixed(0)} {metric.unit}</span>
                </div>
            </div>

            <div className={styles.metricChart}>
                {chartsMounted ? (
                    <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={ghostData} margin={{ top: 4, right: 4, left: 0, bottom: 0 }}>
                            <defs>
                                <linearGradient id={`ghost-grad-${metric.key}`} x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="0%" stopColor={metric.color} stopOpacity={0.25} />
                                    <stop offset="100%" stopColor={metric.color} stopOpacity={0} />
                                </linearGradient>
                            </defs>
                            <Area type="monotone" dataKey="v" stroke={metric.color} strokeWidth={2} fill={`url(#ghost-grad-${metric.key})`} dot={false} isAnimationActive={false} />
                            <YAxis domain={["auto", "auto"]} hide />
                            <XAxis dataKey="t" hide />
                        </AreaChart>
                    </ResponsiveContainer>
                ) : (
                    <div className={styles.chartMountPlaceholder} aria-hidden />
                )}
            </div>
        </div>
    );
}

function MetricRow({ metric, data, hasHistory, chartsMounted, useFahrenheit = false, onToggleFahrenheit }: MetricRowProps) {
    const rawLatest = getMetricValue(data[data.length - 1], metric.key);
    if (rawLatest === undefined) return null;

    const displayMetric = getDisplayMetric(metric, useFahrenheit);
    const displayLatest = metric.key === "temp" && useFahrenheit ? toF(rawLatest) : rawLatest;
    const deviation = getDeviationLevel(rawLatest, metric);
    const deviationStyle = DEVIATION_STYLES[deviation];
    const trend = getTrend(data, metric.key);
    const valuePct = toRangePercent(displayLatest, displayMetric.min, displayMetric.max);
    const idealStartPct = toRangePercent(displayMetric.idealMin, displayMetric.min, displayMetric.max);
    const idealWidthPct = toRangePercent(displayMetric.idealMax, displayMetric.min, displayMetric.max) - idealStartPct;

    const chartData: ChartDatum[] = data
        .map(entry => {
            const v = getMetricValue(entry, metric.key);
            if (v === undefined) return undefined;
            const displayed = metric.key === "temp" && useFahrenheit ? toF(v) : v;
            return { t: entry.timestamp, v: displayed };
        })
        .filter(Boolean) as ChartDatum[];

    const TrendIcon = !trend ? Minus : trend.diff > 0 ? TrendingUp : TrendingDown;
    const trendColor = !trend ? undefined : deviationStyle.color;
    const Icon = metric.icon;

    return (
        <div className={styles.metricRow}>
            <div className={styles.metricLeft}>
                <div className={styles.metricHeader}>
                    <div className={styles.metricIconWrap} style={{ background: `${metric.color}18` }}>
                        <Icon size={14} color={metric.color} />
                    </div>
                    <span className={styles.metricLabel}>{metric.label}</span>
                    {metric.key === "temp" && onToggleFahrenheit && (
                        <UnitToggle
                            options={[{ label: "°C", value: "c" }, { label: "°F", value: "f" }]}
                            value={useFahrenheit ? "f" : "c"}
                            onChange={(v) => onToggleFahrenheit(v === "f")}
                        />
                    )}
                    <BadgeTooltip content={deviationStyle.description}>
                        <span
                            className={styles.metricBadge}
                            style={{ color: deviationStyle.color, background: deviationStyle.background }}
                        >
                            {deviationStyle.statusText}
                        </span>
                    </BadgeTooltip>
                </div>

                <div className={styles.metricValueRow}>
                    <span className={styles.metricValue} style={{ color: metric.color }}>
                        {displayMetric.format(displayLatest)}
                    </span>
                    {trend && (
                        <span className={styles.metricTrend} style={{ color: trendColor, background: `${trendColor}18` }}>
                            <TrendIcon size={13} />
                            {trend.diff > 0 ? "+" : ""}{trend.pct}%
                        </span>
                    )}
                </div>

                <div className={styles.rangeBar}>
                    <div className={styles.rangeIdeal} style={{ left: `${idealStartPct}%`, width: `${idealWidthPct}%`, background: `${metric.color}30` }} />
                    <div className={styles.rangeMarker} style={{ left: `calc(${valuePct}% - 6px)`, background: metric.color, boxShadow: `0 0 6px ${metric.color}88` }} />
                </div>

                <div className={styles.rangeLabels}>
                    <span>{displayMetric.min.toFixed(0)} {displayMetric.unit}</span>
                    <span>Ziel: {displayMetric.idealMin.toFixed(0)}–{displayMetric.idealMax.toFixed(0)}</span>
                    <span>{displayMetric.max.toFixed(0)} {displayMetric.unit}</span>
                </div>

                {hasHistory && (
                    <div className={styles.metricSparkline}>
                        {chartsMounted ? (
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
                        ) : (
                            <div className={styles.chartMountPlaceholder} aria-hidden />
                        )}
                    </div>
                )}
            </div>

            {hasHistory && (
                <div className={styles.metricChart}>
                    {chartsMounted ? (
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
                                <Tooltip content={props => <AreaTooltip {...props} metric={displayMetric} />} />
                            </AreaChart>
                        </ResponsiveContainer>
                    ) : (
                        <div className={styles.chartMountPlaceholder} aria-hidden />
                    )}
                </div>
            )}
        </div>
    );
}

export default function DataTab({ data, metrics, onAddMeasurement, title, emptyTitle, emptyText, ctaLabel }: DataTabProps) {
    const hasHistory = data.length > 1;
    const isEmpty = data.length < 2;
    const [useFahrenheit, setUseFahrenheit] = useState(false);
    const chartsMounted = useHasMounted();

    return (
        <TabContent>
            <Card title={title} collapsible={true}>
                <GhostState
                    isEmpty={isEmpty}
                    overlay={
                        <GhostCard
                            title={emptyTitle}
                            text={emptyText}
                            cta={ctaLabel}
                            onClick={onAddMeasurement}
                        />
                    }
                >
                    <div className={styles.metricList}>
                        {isEmpty
                            ? metrics.map(metric => (
                                <GhostMetricRow key={metric.key} metric={metric} chartsMounted={chartsMounted} />
                            ))
                            : metrics.map(metric => (
                                <MetricRow
                                    key={metric.key}
                                    metric={metric}
                                    data={data}
                                    hasHistory={hasHistory}
                                    chartsMounted={chartsMounted}
                                    useFahrenheit={useFahrenheit}
                                    onToggleFahrenheit={metric.key === "temp" ? setUseFahrenheit : undefined}
                                />
                            ))
                        }
                    </div>
                </GhostState>
            </Card>
        </TabContent>
    );
}