import { Atom, Droplets, Thermometer, Wind } from "lucide-react";
import { EnvironmentData_Historical } from "@/types/environment";
import styles from './ClimateGrid.module.scss'
import ClimateMetric from "./ClimaMetric";

interface ClimateGridProps {
    historical?: EnvironmentData_Historical["climate"];
}

const ICONS: Record<string, any> = {
    temp: Thermometer,
    humidity: Droplets,
    vpd: Wind,
    co2: Atom,
};

const LABELS: Record<string, string> = {
    temp: "Temperatur",
    humidity: "Luftfeuchtigkeit",
    vpd: "VPD",
    co2: "CO₂",
};

const ClimateGrid = ({ historical }: ClimateGridProps) => {
    if (!historical || Object.keys(historical).length === 0) return null;

    return (
        <div className={styles.climateGrid}>
            {Object.entries(historical).map(([key, value]) =>
                value ? (
                    <ClimateMetric
                        key={key}
                        climateKey={key} 
                        icon={ICONS[key]}
                        value={
                            key === "co2"
                                ? `${value.value}${value.unit}`
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
