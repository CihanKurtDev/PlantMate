"use client";

import { useState, useMemo } from "react";
import Modal from "@/components/Modal/Modal";
import { MultiStepForm } from "./components/MultiStepForm";
import EnvironmentTab from "./components/EnvironmentTab";
import { PageLayout } from "@/components/PageLayout/PageLayout";
import MetricGrid from "@/components/MetricGrid/MetricGrid";
import RecentActivityTab from "./components/RecentActivity";
import { getDashboardMetrics } from "@/helpers/getDashboardMetrics";
import { useEnvironment } from "@/context/EnvironmentContext";
import { usePlant } from "@/context/PlantContext";

const Dashboard = () => {
    const { environments } = useEnvironment();
    const { plants } = usePlant();
    const [isModalOpen, setIsModalOpen] = useState(false);

    const items = useMemo(() => {
        return getDashboardMetrics(environments, plants);
    }, [environments, plants]);

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