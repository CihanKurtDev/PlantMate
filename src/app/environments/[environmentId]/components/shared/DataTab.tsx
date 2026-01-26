import { Legend, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import EmptyState from "./EmptyState";
import TabContent from "./TabContent";
import { formatDateShort } from "@/helpers/date";
import styles from "./DataTab.module.scss";

export interface MetricConfig {
  key: string;
  name: string;
  color: string;
}

const CustomTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload || !payload.length) return null;
  
  return (
    <div className={styles.customTooltip}>
      <p className={styles.tooltipLabel}>
        {formatDateShort(new Date(label))}
      </p>
      {payload.map((entry: any, index: number) => (
        <p key={index} className={styles.tooltipItem} style={{ color: entry.color }}>
          {entry.name}: {entry.value}
        </p>
      ))}
    </div>
  );
};

export default function DataTab({ isActive, data, metrics } : { isActive: boolean; data: any[], metrics: MetricConfig[] }) {
  if (!isActive) return null
  return (
    <TabContent title="Klima">
      {data.length === 0 ? (
        <EmptyState message="Keine Klimadaten vorhanden"/>
        ) : (
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={data} margin={{ top: 20, right: 30, left: 50, bottom: 20 }}>
              <XAxis
                dataKey="timestamp"
                type="number"
                domain={['dataMin', 'dataMax']}
                tickFormatter={timestamp => formatDateShort(new Date(timestamp))}
              />
              <YAxis
                type="number"
              />
              {metrics.map(metric => (
                <Line
                  key={metric.key}
                  type="monotone"
                  dataKey={metric.key}
                  stroke={metric.color}
                  strokeWidth={1}
                  dot={{ r: 3}}
                  name={metric.name}
                />
              ))}
              <Tooltip content={<CustomTooltip />} />
              <Legend verticalAlign="top" height={36} iconType="circle" />
            </LineChart>
          </ResponsiveContainer>
        )}
    </TabContent>
  );
}
