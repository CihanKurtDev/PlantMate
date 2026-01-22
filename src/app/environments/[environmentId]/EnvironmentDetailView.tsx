"use client";

import { useMemo, useState } from "react";
import { usePlantMonitor } from "@/context/PlantMonitorContext";
import PlantsTab from "./components/PlantsTab";
import ClimateTab from "./components/ClimateTab";
import { ENVIRONMENT_ICONS } from "@/config/environment";
import DetailViewLayout from "./components/shared/DetailViewLayout";
import DetailViewHeader from "./components/shared/DetailViewHeader";
import Tabs from "./components/shared/Tabs";
import ClimateGrid from "@/components/climate/ClimateGrid";
import { ActivityIcon, Droplets, Sprout } from "lucide-react";
import EnvironmentEventTab from "./components/EnvironmentEventTab";
import styles from "./EnvironmentDetailView.module.scss";

export type TabVariant = 'plants' | 'climate' | 'events'

export default function EnvironmentDetailView({ environmentId }: { environmentId: string }) {
    const { environments, getPlantsByEnvironment } = usePlantMonitor();
    const environment = environments.find(e => e.id === environmentId);
    const [activeTab, setActiveTab] = useState<'plants' | 'climate' | 'events'>('plants');
    const plants = getPlantsByEnvironment(environmentId);
    // tbh not really necessary i will look into how i memoize later or to be more specific i want to see the problems and then handle them instead of throwing around memoization
    // why? according to Josh W. Comeau you should only implement memoization if you need it since the memoization itself can apparently be more ressource heavy then rerendering small arrrays
    const tabs = useMemo(() => [
        { id: 'plants' as const, label: `Pflanzen (${plants.length})`, icon: <Sprout /> },
        { id: 'climate' as const, label: 'Klima-Verlauf', icon: <ActivityIcon /> },
        { id: 'events' as const, label: 'Ereignisse', icon: <Droplets /> }
    ], [plants.length, environment?.id]);

    if (!environment) return null;

    return (
        <DetailViewLayout
            backUrl="/dashboard"
            backLabel="Zurück zur Übersicht"
        >
            <DetailViewHeader
                title={environment.name}
                subtitle={environment.location}
                icon={ENVIRONMENT_ICONS[environment.type]}
                iconVariant={environment.type.toLowerCase()}
            >
                {environment.climate && (
                    <div className={styles.climateGridWrapper}>
                        <ClimateGrid climate={environment.climate} />
                    </div>
                )}
            </DetailViewHeader>
            <Tabs activeTab={activeTab} setActiveTab={setActiveTab} tabs={tabs} />
            <PlantsTab plants={plants} hidden={activeTab !== 'plants'} />
            <ClimateTab climate={environment.climate} history={environment} hidden={activeTab !== 'climate'}/>
            <EnvironmentEventTab environmentId={environmentId} events={environment.events} hidden={activeTab !== 'events'}/>
        </DetailViewLayout>
    );
}
