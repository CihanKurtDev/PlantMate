import { ArrowRight, Sprout } from "lucide-react";
import EnvironmentTypeIcon from "./EnvironmentTypeIcon";
import PlantCard from "./PlantCard";
import { usePlantMonitor } from "@/context/PlantMonitorContext";
import styles from './EnvironmentDetailView.module.scss' 
import { Button } from "@/components/Button/Button";
import ClimateGrid from "./ClimateGrid";

const EnvironmentDetailView = ({ environmentId }: { environmentId: string })  => {
    const { environments, getPlantsByEnvironment, setSelectedEnvironment } = usePlantMonitor();
    const environment = environments.find(e => e.id === environmentId);
    const plants = getPlantsByEnvironment(environmentId);

    if (!environment) return null;

    return (
        <div className={styles.container}>
            <div className={styles.content}>
                <Button
                    onClick={() => setSelectedEnvironment(null)}
                >
                    <ArrowRight />
                    Zurück zur Übersicht
                </Button>

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