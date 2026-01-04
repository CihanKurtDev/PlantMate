import { LucideIcon } from "lucide-react";
import styles from './ClimaMetric.module.scss';

interface ClimateMetricProps {
    icon: LucideIcon;
    value: string;
    label: string;
}

const ClimateMetric = ({ icon: Icon, value, label }: ClimateMetricProps) =>  {
    return (
        <div className={styles.metric}>
            <div  className={styles.iconWrapper}>
                <Icon/>
            </div>
            <div className={styles.content}>
                <div className={styles.value}>{value}</div>
                <div className={styles.label}>{label}</div>
            </div>
        </div>
    );
}

export default ClimateMetric