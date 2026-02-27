"use client"
import { usePlantMonitor } from "@/context/PlantMonitorContext";
import { Button } from "@/components/Button/Button";
import { Plus } from "lucide-react";
import Modal from "@/components/Modal/Modal";
import { useState } from "react";
import { MultiStepForm } from "./components/MultiStepForm";
import EnvironmentTab from "./components/EnvironmentTab";
import { PageLayout } from "@/components/PageLayout/PageLayout";

const Dashboard = () => {
    const { environments } = usePlantMonitor();
    const [isModalOpen, setIsModalOpen] = useState(false);

    return (
        <PageLayout
            title="Dashboard"
            subtitle="Übersicht deiner Pflanzenumgebungen"
        >
            <EnvironmentTab environments={environments} onAddNew={() => setIsModalOpen(true)} />
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