"use client"
import { EnvironmentData } from "@/types/environment";
import { Sprout } from "lucide-react";
import { usePlantMonitor } from "@/context/PlantMonitorContext";
import styles from "./EnvironmentCard.module.scss"
import ClimateGrid from "@/components/climate/ClimateGrid";
import { useRouter } from "next/navigation";
import TypeIcon from "@/components/TypeIcon/TypeIcon";
import { ENVIRONMENT_ICONS } from "@/config/environment";

const EnvironmentCard = ({ environment }: { environment: EnvironmentData }) => {
    const { getPlantsByEnvironment } = usePlantMonitor();
    const plantCount = getPlantsByEnvironment(environment.id).length;
    const climate = environment.climate;
    const router = useRouter()

    return (
        <div
            className={styles.card}
            onClick={() => router.push(`environments/${environment.id}`)}
        >
            <div>
                <div className={styles.header}>
                    <TypeIcon icon={ENVIRONMENT_ICONS[environment.type]} variant={environment.type.toLowerCase()} />
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