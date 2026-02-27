import type { ReactElement } from "react";
import { ResponsiveContainer, AreaChart, Area } from "recharts";

// 30 tage
const HISTORY_WINDOW_MS = 30 * 24 * 60 * 60 * 1000;

export function getLastEvent<T extends { timestamp: number }>(events?: T[]): T | undefined {
    return events && events.length > 0 ? events[events.length - 1] : undefined;
}

export function buildHistory<T extends { timestamp: number }>(
    historical: T[] | undefined | null,
    getValue: (entry: T) => number | null | undefined
): number[] {
    if (!historical) return [];

    const cutoff = Date.now() - HISTORY_WINDOW_MS;

    return historical
        .filter(h => h.timestamp >= cutoff)
        .map(h => getValue(h))
        .filter((v): v is number => v !== null && v !== undefined);
}


interface TableSparklineProps {
    data: number[];
    color: string;
    id: string;
}

export function TableSparkline({ data, color, id }: TableSparklineProps): ReactElement {
    if (data.length < 2) {
        return <span style={{ color: "#d1d5db", fontSize: 11 }}>–</span>;
    }

    const chartData = data.map(v => ({ v }));
    const gradId = `spark_${id}`;

    return (
        <div style={{ width: 76, height: 28 }}>
            <ResponsiveContainer width="100%" height="100%">
                <AreaChart
                    data={chartData}
                    margin={{ top: 2, right: 0, bottom: 2, left: 0 }}
                >
                    <defs>
                        <linearGradient id={gradId} x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor={color} stopOpacity={0.2} />
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
    );
}