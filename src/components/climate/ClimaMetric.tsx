import { LucideIcon } from "lucide-react";
import styles from './ClimaMetric.module.scss';

export const CLIMATE_STYLES: Record<string, { color: string }> = {
    temp: { color: '#d05959' },
    humidity: { color: '#087a6d' },
    vpd: { color: '#d3893e' },
    co2: { color: '#555252' }, 
};

interface ClimateMetricProps {
    icon: LucideIcon;
    value: string;
    label: string;
    climateKey: string;
}

const ClimateMetric = ({ icon: Icon, value, label, climateKey }: ClimateMetricProps) =>  {
    const stylesForKey = CLIMATE_STYLES[climateKey]

    return (
        <div 
            className={styles.metric}       
            style={{
                color: stylesForKey.color,
            }
        }>
            <div  className={styles.iconWrapper}>
                <Icon style={{ color: stylesForKey.color }} />
            </div>
            <div className={styles.content}>
                <div className={styles.value}>{value}</div>
                <div className={styles.label}>{label}</div>
            </div>
        </div>
    );
}

export default ClimateMetric