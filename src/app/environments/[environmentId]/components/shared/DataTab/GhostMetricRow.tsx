import { useMemo } from "react";
import { AreaChart, Area, XAxis, YAxis, ResponsiveContainer } from "recharts";
import { MetricConfig } from "./DataTab";
import { toRangePercent, generateGhostData } from "./dataTabUtils";
import { useHasMounted } from "@/hooks/useHasMounted";
import styles from "./DataTab.module.scss";

interface GhostMetricRowProps {
    metric: MetricConfig;
}

export function GhostMetricRow({ metric }: GhostMetricRowProps) {
    const chartsMounted = useHasMounted();
    const midValue = (metric.idealMin + metric.idealMax) / 2;
    const ghostData = useMemo(
        () => generateGhostData(metric.idealMin, metric.idealMax),
        [metric.idealMin, metric.idealMax]
    );

    const valuePct = toRangePercent(midValue, metric.min, metric.max);
    const idealStartPct = toRangePercent(metric.idealMin, metric.min, metric.max);
    const idealWidthPct = toRangePercent(metric.idealMax, metric.min, metric.max) - idealStartPct;

    const Icon = metric.icon;

    return (
        <div className={`${styles.metricRow} ${styles.metricRowGhost}`}>
            <div className={styles.metricLeft}>
                <div className={styles.metricHeader}>
                    <div className={styles.metricIconWrap} style={{ background: `${metric.color}18` }}>
                        <Icon size={14} color={metric.color} />
                    </div>
                    <span className={styles.metricLabel}>{metric.label}</span>
                    <span className={styles.metricBadge}>
                        OK
                    </span>
                </div>

                <div className={styles.metricValueRow}>
                    <span className={styles.metricValue} style={{ color: metric.color }}>
                        {metric.format(midValue)}
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