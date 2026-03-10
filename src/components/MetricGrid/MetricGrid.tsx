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
        <dl
            className={styles.metricGrid}
            style={{ gridTemplateColumns: `repeat(${items.length}, minmax(0, 1fr))` }}
        >
            {items.map(({ key, value, subValue }) => {
                const config = getIconConfig(key);
                if (!config) return null;

                return (
                    <div key={key} className={styles.metric}>
                        <div className={styles.content}>
                            <dt className={styles.labelWrapper}>
                                <TypeIcon icon={config.icon} variant={key} />
                                <span className={styles.label}>{config.label}</span>
                            </dt>
                            <dd className={styles.value}>{value}</dd>
                            {subValue && (
                                <dd className={styles.subValue}>
                                    {subValue}
                                </dd>
                            )}
                        </div>
                    </div>
                );
            })}
        </dl>
    );
};

export default MetricGrid;