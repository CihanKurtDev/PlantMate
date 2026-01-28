"use client"
import { usePlantMonitor } from "@/context/PlantMonitorContext";
import EnvironmentCard from "./components/EnvironmentCard";
import styles from "./Dashboard.module.scss"
import { Button } from "@/components/Button/Button";
import { useRouter } from "next/navigation";
import { Plus } from "lucide-react";
import PageLayout from "@/components/PageLayout/PageLayout";

const Dashboard = () => {
    const { environments } = usePlantMonitor();
    const router = useRouter()

    return (
        <PageLayout
            title="Dashboard"
            subtitle="Übersicht deiner Pflanzenumgebungen"
        >

            <div className={styles.grid}>
                {environments.map(environment => (
                    <EnvironmentCard key={environment.id} environment={environment}/>
                ))}
            </div>
            <Button
                    variant="floating"
                    size="round"
                    onClick={() => router.push("/environments/new")}
                    aria-label="Neue Umgebung hinzufügen"
                >
                    <Plus size={32} style={{ display: "block" }} />
                </Button>
        </PageLayout>
    );
}

export default Dashboard