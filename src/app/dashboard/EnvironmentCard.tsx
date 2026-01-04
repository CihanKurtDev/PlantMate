"use client"
import { EnvironmentData } from "@/types/environment";
import EnvironmentTypeIcon from "./EnvironmentTypeIcon";
import { Sprout } from "lucide-react";
import { usePlantMonitor } from "@/context/PlantMonitorContext";
import styles from "./EnvironmentCard.module.scss"
import ClimateGrid from "./ClimateGrid";

const EnvironmentCard = ({ environment }: { environment: EnvironmentData }) => {
    const { getPlantsByEnvironment, setSelectedEnvironment } = usePlantMonitor();
    const plantCount = getPlantsByEnvironment(environment.id).length;
    const climate = environment.climate;

    return (
        <div
            className={styles.card}
            onClick={() => setSelectedEnvironment(environment.id)}
        >
            <div>
                <div className={styles.header}>
                    <EnvironmentTypeIcon type={environment.type} />
                    <div className={styles.titleGroup}>
                        <h3 className={styles.title}>{environment.name}</h3>
                        {environment.location && (
                            <p className={styles.location}>{environment.location}</p>
                        )}
                    </div>
                </div>
            </div>
            {climate &&  <ClimateGrid climate={climate} />}
            <div className={styles.footer}>
                <Sprout/>
                <span>
                    {plantCount} {plantCount === 1 ? 'Pflanze' : 'Pflanzen'}
                </span>
            </div>
        </div>
    );
}

export default EnvironmentCard