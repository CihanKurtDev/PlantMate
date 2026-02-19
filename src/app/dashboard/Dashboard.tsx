"use client"
import { usePlantMonitor } from "@/context/PlantMonitorContext";
import EnvironmentCard from "./components/EnvironmentCard";
import styles from "./Dashboard.module.scss"
import { Button } from "@/components/Button/Button";
import { Plus } from "lucide-react";
import PageLayout from "@/components/PageLayout/PageLayout";
import Modal from "@/components/Modal/Modal";
import { useState } from "react";
import { MultiStepForm } from "./components/MultiStepForm";

const Dashboard = () => {
    const { environments } = usePlantMonitor();
    const [isModalOpen, setIsModalOpen] = useState(false);

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
                onClick={() => setIsModalOpen(true)}
                aria-label="Neue Umgebung hinzufügen"
            >
                <Plus size={32} style={{ display: "block" }} />
            </Button>
            <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
                <MultiStepForm />
            </Modal>
        </PageLayout>
    );
}

export default Dashboard