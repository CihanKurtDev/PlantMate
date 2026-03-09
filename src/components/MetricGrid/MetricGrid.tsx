import { getIconConfig } from "@/config/icons";
import TypeIcon from "@/components/TypeIcon/TypeIcon";
import styles from './MetricGrid.module.scss';

export interface MetricItem {
    key: string;
    value: string;
    subValue?: string;
}

interface MetricGridProps {
    items: MetricItem[];
}

const MetricGrid = ({ items }: MetricGridProps) => {
    if (!items.length) return null;

    return (
        <div className={styles.metricGrid} style={{ gridTemplateColumns: `repeat(${items.length}, minmax(0, 1fr))` }}>
            {items.map(({ key, value, subValue }) => {
                const config = getIconConfig(key);
                if (!config) return null;

                return (
                    <div key={key} className={styles.metric}>
                        <div className={styles.content}>
                            <div className={styles.labelWrapper}>
                                <TypeIcon icon={config.icon} variant={key} />
                                <div className={styles.label}>{config.label}</div>
                            </div>
                            <div className={styles.value}>{value}</div>
                            {subValue && (
                                <div className={styles.subValue}>{subValue}</div>
                            )}
                        </div>
                    </div>
                );
            })}
        </div>
    );
};

export default MetricGrid;