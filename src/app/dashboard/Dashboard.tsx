"use client"
import { usePlantMonitor } from "@/context/PlantMonitorContext";
import Modal from "@/components/Modal/Modal";
import { useState } from "react";
import { MultiStepForm } from "./components/MultiStepForm";
import EnvironmentTab from "./components/EnvironmentTab";
import { PageLayout } from "@/components/PageLayout/PageLayout";
import MetricGrid from "@/components/MetricGrid/MetricGrid";
import RecentActivityTab from "./components/RecentActivity";
import { getDashboardMetrics } from "@/helpers/getDashboardMetrics";

const Dashboard = () => {
    const { environments, plants } = usePlantMonitor();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const items = getDashboardMetrics(environments, plants);

    return (
        <PageLayout
            title="Dashboard"
            subtitle="Übersicht deiner Pflanzenumgebungen"
        >
            <MetricGrid items={items} />
            <EnvironmentTab environments={environments} onAddNew={() => setIsModalOpen(true)} />
            <RecentActivityTab environments={environments} plants={plants} limit={10} />
            <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
                <MultiStepForm />
            </Modal>
        </PageLayout>
    );
}

export default Dashboard