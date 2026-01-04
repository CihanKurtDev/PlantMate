"use client";
import { ArrowRight, Sprout } from "lucide-react";
import { usePlantMonitor } from "@/context/PlantMonitorContext";
import styles from './EnvironmentDetailView.module.scss' 
import { Button } from "@/components/Button/Button";
import ClimateGrid from "../ClimateGrid";
import PlantCard from "../PlantCard";
import EnvironmentTypeIcon from "../EnvironmentTypeIcon";
import { useRouter } from "next/navigation";

const EnvironmentDetailView = ({ environmentId }: { environmentId: string })  => {
    const { environments, getPlantsByEnvironment } = usePlantMonitor();
    const environment = environments.find(e => e.id === environmentId);
    const plants = getPlantsByEnvironment(environmentId);
    const router = useRouter()

    if (!environment) return null;

    return (
        <div className={styles.container}>
            <Button
                size="fill"
                onClick={() => router.push("/dashboard")}
            >
                <ArrowRight className={styles.arrow}/>
                Zurück zur Übersicht
            </Button>
            <div className={styles.content}>
                <div  className={styles.environmentHeader}>
                    <div className={styles.environmentInfo}>
                        <EnvironmentTypeIcon type={environment.type} />
                        <div className={styles.environmentTitle}>
                            <h1>{environment.name}</h1>
                            {environment.location && (
                                <p>{environment.location}</p>
                            )}
                        </div>
                    </div>
                    {environment.climate && <ClimateGrid climate={environment.climate} />}
                </div>

                <div className={styles.plantsSection}>
                    <h2>
                        Pflanzen ({plants.length})
                    </h2>
                    <div className={styles.plantsGrid}>
                        {plants.map(plant => (
                            <PlantCard key={plant.id} plant={plant} />
                        ))}
                    </div>
                    {plants.length === 0 && (
                        <div className={styles.emptyState}>
                            <Sprout/>
                            <p>Keine Pflanzen in dieser Umgebung</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default EnvironmentDetailView