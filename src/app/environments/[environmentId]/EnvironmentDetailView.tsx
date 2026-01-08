"use client";
import { ArrowRight } from "lucide-react";
import { usePlantMonitor } from "@/context/PlantMonitorContext";
import styles from './EnvironmentDetailView.module.scss' 
import { Button } from "@/components/Button/Button";
import { useRouter } from "next/navigation";
import Tabs from "./Tabs";
import PlantsTab from "./PlantsTab";
import ClimateTab from "./ClimateTab";
import EventsTab from "./EventTab";
import { useState } from "react";
import { mockEvents } from "@/data/mock/events";
import EnvironmentHeader from "./EnvironmentHeader";

export type TabVariant = 'plants' | 'climate' | 'events'

const EnvironmentDetailView = ({ environmentId }: { environmentId: string })  => {
    const { environments, getPlantsByEnvironment } = usePlantMonitor();
    const environment = environments.find(e => e.id === environmentId);
    const plants = getPlantsByEnvironment(environmentId);
    const router = useRouter()
    const [activeTab, setActiveTab] = useState<TabVariant>('plants');

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
                <EnvironmentHeader environment={environment} />
                <nav aria-label="Ansicht wechseln">
                    <Tabs activeTab={activeTab} setActiveTab={setActiveTab} plantsCount={plants.length} />
                </nav>
                {activeTab === 'plants' && <PlantsTab plants={plants} />}
                {activeTab === 'climate' && (
                    <ClimateTab climate={environment.climate} history={environment} />
                )}
                {activeTab === 'events' && <EventsTab events={mockEvents} />}
            </div>
        </div>
    );
}

export default EnvironmentDetailView