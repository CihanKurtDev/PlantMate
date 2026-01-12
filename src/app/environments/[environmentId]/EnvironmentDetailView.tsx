"use client";

import { Activity, JSX, useState } from "react";
import { usePlantMonitor } from "@/context/PlantMonitorContext";
import PlantsTab from "./components/PlantsTab";
import ClimateTab from "./components/ClimateTab";
import EventsTab from "./components/EventTab";
import { mockEvents } from "@/data/mock/events";
import { ENVIRONMENT_ICONS } from "@/config/environment";
import DetailViewLayout from "./components/shared/DetailViewLayout";
import DetailViewHeader from "./components/shared/DetailViewHeader";
import Tabs from "./components/Tabs";
import ClimateGrid from "@/components/climate/ClimateGrid";
import { ActivityIcon, Droplets, Sprout } from "lucide-react";

export type TabVariant = 'plants' | 'climate' | 'events'

export default function EnvironmentDetailView({ environmentId }: { environmentId: string }) {
    const { environments, getPlantsByEnvironment } = usePlantMonitor();
    const environment = environments.find(e => e.id === environmentId);
    const [activeTab, setActiveTab] = useState<'plants' | 'climate' | 'events'>('plants');

    if (!environment) return null;

    const plants = getPlantsByEnvironment(environmentId);

    const tabs: { id: TabVariant; label: string; icon: JSX.Element }[]  = [
        { id: 'plants', label: `Pflanzen (${plants.length})`, icon: <Sprout /> },
        { id: 'climate', label: 'Klima-Verlauf', icon: <ActivityIcon /> },
        { id: 'events', label: 'Ereignisse', icon: <Droplets /> }
    ];

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
                {environment.climate && <ClimateGrid climate={environment.climate} />}
            </DetailViewHeader>
            <Tabs activeTab={activeTab} setActiveTab={setActiveTab} tabs={tabs} />
            {activeTab === 'plants' && <PlantsTab plants={plants} />}
            {activeTab === 'climate' && <ClimateTab climate={environment.climate} history={environment} />}
            {activeTab === 'events' && <EventsTab events={mockEvents} />}
        </DetailViewLayout>
    );
}
