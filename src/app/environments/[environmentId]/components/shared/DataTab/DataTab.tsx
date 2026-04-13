"use client";

import { useMemo, useState } from "react";
import { Minus, TrendingDown, TrendingUp } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import {
    Area,
    AreaChart,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis,
} from "recharts";
import { Card } from "@/components/Card/Card";
import TabContent from "@/components/TabContent/TabContent";
import { Tooltip as BadgeTooltip } from "@/components/Tooltip/Tooltip";
import { useHasMounted } from "@/hooks/useHasMounted";
import { DEVIATION_STYLES } from "@/config/icons";
import { formatDate, formatDateShort } from "@/helpers/date";
import type { TimeSeriesEntry } from "@/types/events";
import { GhostCard } from "../GhostState/GhostCard";
import { GhostState } from "../GhostState/GhostState";
import { UnitToggle } from "./UnitToggle";
import {
    type ChartDatum,
    generateGhostData,
    getDeviationLevel,
    getDisplayMetric,
    getMetricValue,
    getTrend,
    toFahrenheit,
    toRangePercent,
} from "./dataTabUtils";
import styles from "./DataTab.module.scss";

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

interface MetricRowProps {
    metric: MetricConfig;
    data: TimeSeriesEntry[];
    hasHistory: boolean;
    chartsMounted: boolean;
    useFahrenheit?: boolean;
    onToggleFahrenheit?: (value: boolean) => void;
    resolveMetricForTimestamp?: (metricKey: string, timestamp: number) => MetricConfig | undefined;
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
    resolveMetricForTimestamp?: (metricKey: string, timestamp: number) => MetricConfig | undefined;
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
    resolveMetricForTimestamp?: (metricKey: string, timestamp: number) => MetricConfig | undefined;
}

const GHOST_OK_TEXT = "var(--color-text-success)";
const GHOST_OK_BG = "var(--color-flag-success)";

function AreaTooltipContent({
    active,
    payload,
    label,
    metric,
    resolveMetricForTimestamp,
}: AreaTooltipProps) {
    if (!active || !payload?.length || label === undefined) {
        return null;
    }

    const value = payload[0]?.value;

    if (typeof value !== "number") {
        return null;
    }

    const effectiveMetric = resolveMetricForTimestamp?.(metric.key, Number(label)) ?? metric;

    return (
        <div className={styles.customTooltip}>
            <p className={styles.tooltipLabel}>{formatDateShort(new Date(Number(label)))}</p>
            <p className={styles.tooltipItem} style={{ color: metric.color }}>
                {metric.label}: {metric.format(value)}
            </p>
            <p className={styles.tooltipLabel}>
                Ziel: {effectiveMetric.idealMin}–{effectiveMetric.idealMax} {effectiveMetric.unit}
            </p>
        </div>
    );
}

function GhostMetricRow({ metric, chartsMounted }: GhostMetricRowProps) {
    const mid = (metric.idealMin + metric.idealMax) / 2;
    const ghostData = useMemo(() => generateGhostData(metric.idealMin, metric.idealMax), [metric.idealMax, metric.idealMin]);
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
                            <Area
                                type="monotone"
                                dataKey="v"
                                stroke={metric.color}
                                strokeWidth={2}
                                fill={`url(#ghost-grad-${metric.key})`}
                                dot={false}
                                isAnimationActive={false}
                            />
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

function MetricRow({
    metric,
    data,
    hasHistory,
    chartsMounted,
    useFahrenheit = false,
    onToggleFahrenheit,
    resolveMetricForTimestamp,
}: MetricRowProps) {
    const latestEntry = data[data.length - 1];
    const rawLatest = getMetricValue(latestEntry, metric.key);

    if (rawLatest === undefined) {
        return null;
    }

    const effectiveMetric = resolveMetricForTimestamp?.(metric.key, latestEntry.timestamp) ?? metric;
    const displayMetric = getDisplayMetric(effectiveMetric, useFahrenheit);
    const displayLatest = metric.key === "temp" && useFahrenheit ? toFahrenheit(rawLatest) : rawLatest;
    const deviation = getDeviationLevel(rawLatest, effectiveMetric);
    const deviationStyle = DEVIATION_STYLES[deviation];
    const trend = getTrend(data, metric.key);
    const valuePct = toRangePercent(displayLatest, displayMetric.min, displayMetric.max);
    const idealStartPct = toRangePercent(displayMetric.idealMin, displayMetric.min, displayMetric.max);
    const idealWidthPct = toRangePercent(displayMetric.idealMax, displayMetric.min, displayMetric.max) - idealStartPct;

    const chartData: ChartDatum[] = data
        .map((entry) => {
            const value = getMetricValue(entry, metric.key);

            if (value === undefined) {
                return undefined;
            }

            const displayedValue = metric.key === "temp" && useFahrenheit ? toFahrenheit(value) : value;

            return {
                t: entry.timestamp,
                v: displayedValue,
            };
        })
        .filter(Boolean) as ChartDatum[];

    const healthSummary = data.reduce(
        (summary, entry) => {
            const value = getMetricValue(entry, metric.key);

            if (value === undefined) {
                return summary;
            }

            const entryMetric = resolveMetricForTimestamp?.(metric.key, entry.timestamp) ?? metric;
            const level = getDeviationLevel(value, entryMetric);

            summary.total += 1;
            summary[level] += 1;

            return summary;
        },
        { total: 0, ok: 0, warn: 0, critical: 0 }
    );

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
                            onChange={(value) => onToggleFahrenheit(value === "f")}
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

                {healthSummary.total > 1 && (
                    <div style={{ marginTop: 8, fontSize: "0.875rem", opacity: 0.8 }}>
                        Verlauf: {healthSummary.ok} ok · {healthSummary.warn} warn · {healthSummary.critical} kritisch
                    </div>
                )}

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
                                    <Area
                                        type="monotone"
                                        dataKey="v"
                                        stroke={metric.color}
                                        strokeWidth={1.5}
                                        fill={`url(#spark-${metric.key})`}
                                        dot={false}
                                        isAnimationActive={false}
                                    />
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
                                <Area
                                    type="monotone"
                                    dataKey="v"
                                    stroke={metric.color}
                                    strokeWidth={2}
                                    fill={`url(#grad-${metric.key})`}
                                    dot={false}
                                    isAnimationActive={false}
                                />
                                <YAxis domain={["auto", "auto"]} hide />
                                <XAxis dataKey="t" tickFormatter={(value) => formatDate(value)} />
                                <Tooltip
                                    content={(props) => (
                                        <AreaTooltipContent
                                            {...props}
                                            metric={displayMetric}
                                            resolveMetricForTimestamp={resolveMetricForTimestamp}
                                        />
                                    )}
                                />
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

export default function DataTab({
    data,
    metrics,
    onAddMeasurement,
    title,
    emptyTitle,
    emptyText,
    ctaLabel,
    resolveMetricForTimestamp,
}: DataTabProps) {
    const hasHistory = data.length > 1;
    const isEmpty = data.length < 2;
    const [useFahrenheit, setUseFahrenheit] = useState(false);
    const chartsMounted = useHasMounted();

    return (
        <TabContent>
            <Card title={title} collapsible>
                <GhostState
                    isEmpty={isEmpty}
                    overlay={(
                        <GhostCard
                            title={emptyTitle}
                            text={emptyText}
                            cta={ctaLabel}
                            onClick={onAddMeasurement}
                        />
                    )}
                >
                    <div className={styles.metricList}>
                        {isEmpty
                            ? metrics.map((metric) => (
                                <GhostMetricRow key={metric.key} metric={metric} chartsMounted={chartsMounted} />
                            ))
                            : metrics.map((metric) => (
                                <MetricRow
                                    key={metric.key}
                                    metric={metric}
                                    data={data}
                                    hasHistory={hasHistory}
                                    chartsMounted={chartsMounted}
                                    useFahrenheit={useFahrenheit}
                                    onToggleFahrenheit={metric.key === "temp" ? setUseFahrenheit : undefined}
                                    resolveMetricForTimestamp={resolveMetricForTimestamp}
                                />
                            ))}
                    </div>
                </GhostState>
            </Card>
        </TabContent>
    );
}
