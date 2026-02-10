import { LucideIcon } from "lucide-react";
import styles from './ClimaMetric.module.scss';
import TypeIcon from "../TypeIcon/TypeIcon";

interface ClimateMetricProps {
    icon: LucideIcon;
    value: string;
    label: string;
    climateKey: string;
}

const ClimateMetric = ({ icon, value, label, climateKey }: ClimateMetricProps) => (
    <div 
        className={styles.metric}       
    >
        <div className={styles.content}>
            <div  className={styles.labelWrapper}>
                <TypeIcon icon={icon} variant={climateKey} />
                <div className={styles.label}>{label}</div>
            </div>
            <div className={styles.value}>{value}</div>
        </div>
    </div>
);

export default ClimateMetric