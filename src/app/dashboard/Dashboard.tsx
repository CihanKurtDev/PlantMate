"use client"
import { usePlantMonitor } from "@/context/PlantMonitorContext";
import EnvironmentCard from "./components/EnvironmentCard";
import styles from "./Dashboard.module.scss"
import { Button } from "@/components/Button/Button";
import { useRouter } from "next/navigation";
import { Plus } from "lucide-react";

const Dashboard = () => {
    const { environments } = usePlantMonitor();
    const router = useRouter()

    return (
        <div className={styles.container}>
            <div className={styles.content}>
                <div  className={styles.header}>
                    <h1 >Dashboard</h1>
                    <p>Übersicht deiner Pflanzenumgebungen</p>
                </div>

                <div className={styles.grid}>
                    {environments.map(environment => (
                        <EnvironmentCard key={environment.id} environment={environment}/>
                    ))}
                </div>
            </div>
            <Button
                variant="floating"
                size="round"
                onClick={() => router.push("/environments/new")}
                aria-label="Neue Umgebung hinzufügen"
            >
                <Plus size={32} style={{ display: "block" }} />
            </Button>
        </div>
    );
}

export default Dashboard