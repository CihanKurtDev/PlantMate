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

function toPastel(hex: string, alpha = 0.15) {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

const ClimateMetric = ({ icon: Icon, value, label, climateKey }: ClimateMetricProps) =>  {
    const stylesForKey = CLIMATE_STYLES[climateKey]
    const pastelColor = toPastel(stylesForKey.color, 0.18);

    return (
        <div 
            className={styles.metric}       
            style={{
                color: stylesForKey.color,
            }
        }>
            <div className={styles.content}>
                <div  className={styles.labelWrapper}>
                    <div className={styles.iconWrapper} style={{backgroundColor: pastelColor}}>
                        <Icon style={{ color: stylesForKey.color }} />
                    </div>
                    <div className={styles.label}>{label}</div>
                </div>
                <div className={styles.value}>{value}</div>
            </div>
        </div>
    );
}

export default ClimateMetric