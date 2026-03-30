import {
    AreaChart,
    Area,
    XAxis,
    YAxis,
    Tooltip,
    ResponsiveContainer,
} from "recharts";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";
import { TimeSeriesEntry } from "@/types/events";
import { DEVIATION_STYLES } from "@/config/icons";
import { UnitToggle } from "./UnitToggle";
import { formatDate, formatDateShort } from "@/helpers/date";
import { MetricConfig } from "./DataTab";
import {
    ChartDatum,
    getMetricValue,
    getTrend,
    getDeviationLevel,
    toRangePercent,
    toFahrenheit,
    getDisplayMetric,
} from "./dataTabUtils";
import { useHasMounted } from "@/hooks/useHasMounted";
import styles from "./DataTab.module.scss";

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

interface MetricRowProps {
    metric: MetricConfig;
    data: TimeSeriesEntry[];
    hasHistory: boolean;
    useFahrenheit?: boolean;
    onToggleFahrenheit?: (useFahrenheit: boolean) => void;
}

export function MetricRow({ metric, data, hasHistory, useFahrenheit = false, onToggleFahrenheit }: MetricRowProps) {
    const chartsMounted = useHasMounted();
    const rawLatest = getMetricValue(data[data.length - 1], metric.key);
    if (rawLatest === undefined) return null;

    const displayMetric = getDisplayMetric(metric, useFahrenheit);
    const displayLatest = metric.key === "temp" && useFahrenheit ? toFahrenheit(rawLatest) : rawLatest;

    const deviation = getDeviationLevel(rawLatest, metric);
    const deviationStyle = DEVIATION_STYLES[deviation];
    const trend = getTrend(data, metric.key);

    const valuePct = toRangePercent(displayLatest, displayMetric.min, displayMetric.max);
    const idealStartPct = toRangePercent(displayMetric.idealMin, displayMetric.min, displayMetric.max);
    const idealWidthPct = toRangePercent(displayMetric.idealMax, displayMetric.min, displayMetric.max) - idealStartPct;

    const chartData: ChartDatum[] = data
        .map(entry => {
            const rawValue = getMetricValue(entry, metric.key);
            if (rawValue === undefined) return undefined;
            const displayedValue = metric.key === "temp" && useFahrenheit ? toFahrenheit(rawValue) : rawValue;
            return { t: entry.timestamp, v: displayedValue };
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
                            onChange={(unit) => onToggleFahrenheit(unit === "f")}
                        />
                    )}
                    <span
                        className={styles.metricBadge}
                        style={{ color: deviationStyle.color, background: deviationStyle.background }}
                    >
                        {deviationStyle.statusText}
                    </span>
                </div>

                <div className={styles.metricValueRow}>
                    <span className={styles.metricValue} style={{ color: metric.color }}>
                        {displayMetric.format(displayLatest)}
                    </span>
                    {trend && (
                        <span
                            className={styles.metricTrend}
                            style={{ color: trendColor, background: `${trendColor}18` }}
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
                                <XAxis dataKey="t" hide={false} tickFormatter={(timestamp) => formatDate(timestamp)} />
                                <Tooltip content={(props) => <AreaTooltip {...props} metric={displayMetric} />} />
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