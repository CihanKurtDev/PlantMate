import { CSSProperties, ReactElement } from "react";
import { Area, AreaChart, ResponsiveContainer } from "recharts";
import styles from "./Sparkline.module.scss";

export interface SparklineProps {
    data: number[];
    color: string;
    id: string;
    width?: number | string;
    height?: number;
    label?: string;
    currentValue?: string;
    className?: string;
    style?: CSSProperties;
}

export default function Sparkline({
    data,
    color,
    id,
    width = 76,
    height = 28,
    label,
    currentValue,
    className,
    style,
}: SparklineProps): ReactElement {
    const hasHeader = Boolean(label || currentValue);
    const gradId = `spark_${id}`;

    const header = hasHeader ? (
        <div className={styles.header}>
            {label && (
                <span className={styles.label}>
                    {label}
                </span>
            )}
            {currentValue && (
                <span className={styles.value}>
                    {currentValue}
                </span>
            )}
        </div>
    ) : null;

    if (data.length < 2) {
        return (
            <div className={className} style={style}>
                {header}
                <span className={styles.emptyValue}>–</span>
            </div>
        );
    }

    const chartData = data.map(v => ({ v }));

    return (
        <div
            className={className}
            style={{ width: typeof width === "number" ? width : undefined, ...style }}
        >
            {header}
            <div style={{ width, height }}>
                <ResponsiveContainer width="100%" height="100%">
                    <AreaChart
                        data={chartData}
                        margin={{ top: 2, right: 0, bottom: 2, left: 0 }}
                    >
                        <defs>
                            <linearGradient id={gradId} x1="0" y1="0" x2="0" y2="1">
                                <stop offset="0%"   stopColor={color} stopOpacity={0.2} />
                                <stop offset="100%" stopColor={color} stopOpacity={0} />
                            </linearGradient>
                        </defs>
                        <Area
                            type="monotone"
                            dataKey="v"
                            stroke={color}
                            strokeWidth={1.7}
                            fill={`url(#${gradId})`}
                            dot={false}
                            isAnimationActive={false}
                        />
                    </AreaChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
}