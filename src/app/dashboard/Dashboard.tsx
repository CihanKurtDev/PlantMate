"use client"
import { usePlantMonitor } from "@/context/PlantMonitorContext";
import EnvironmentCard from "./EnvironmentCard";
import styles from "./Dashboard.module.scss"

const Dashboard = () => {
    const { environments } = usePlantMonitor();

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
        </div>
    );
}

export default Dashboard