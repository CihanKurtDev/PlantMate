import { Atom, Droplets, Thermometer, Wind } from "lucide-react";
import { EnvironmentData } from "@/types/environment";
import styles from './ClimateGrid.module.scss'
import ClimateMetric from "./ClimaMetric";

interface ClimateGridProps {
    climate?: EnvironmentData["climate"];
}

const ICONS: Record<string, any> = {
    temp: Thermometer,
    humidity: Droplets,
    vpd: Wind,
    co2: Atom,
};

const LABELS: Record<string, string> = {
    temp: "Temp.",
    humidity: "RLF",
    vpd: "VPD",
    co2: "CO₂",
};

const ClimateGrid = ({ climate }: ClimateGridProps) => {
    if (!climate || Object.keys(climate).length === 0) return null;

    return (
        <div className={styles.climateGrid}>
            {Object.entries(climate).map(([key, value]) =>  
                value ? (
                    <ClimateMetric
                        key={key}
                        climateKey={key} 
                        icon={ICONS[key]}
                        value={
                            key === "co2"
                                ? `${(value.value * 100).toFixed(0)}${value.unit}`
                                : `${value.value}${value.unit}`
                        }
                        label={LABELS[key]}
                    />
                ) : null
            )}
        </div>
    );
}

export default ClimateGrid;
