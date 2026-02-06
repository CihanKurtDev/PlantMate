"use client";

import { useMemo, useState } from "react";
import { usePlantMonitor } from "@/context/PlantMonitorContext";
import PlantsTab from "./components/PlantsTab";
import DataTab from "./components/shared/DataTab";
import { ENVIRONMENT_ICONS } from "@/config/environment";
import PageLayout from "../../../components/PageLayout/PageLayout";
import DetailViewHeader from "./components/shared/DetailViewHeader";
import Tabs from "./components/shared/Tabs";
import ClimateGrid from "@/components/climate/ClimateGrid";
import { ActivityIcon, Droplets, Plus, Sprout } from "lucide-react";
import EnvironmentEventTab from "./components/EnvironmentEventTab";
import { combineEnvironmentData } from "@/helpers/combineEnvironmentData";
import styles from './EnvironmentDetailView.module.scss';
import { useRouter } from "next/navigation";

export type TabVariant = 'plants' | 'climate' | 'events'

export default function EnvironmentDetailView({ environmentId }: { environmentId: string }) {
    const { environments, getPlantsByEnvironment } = usePlantMonitor();
    const environment = environments.find(e => e.id === environmentId);
    const [activeTab, setActiveTab] = useState<'plants' | 'climate' | 'events'>('plants');
    const plants = getPlantsByEnvironment(environmentId);
    const router = useRouter();
    // tbh not really necessary i will look into how i memoize later or to be more specific i want to see the problems and then handle them instead of throwing around memoization
    // why? according to Josh W. Comeau you should only implement memoization if you need it since the memoization itself can apparently be more ressource heavy then rerendering small arrrays
    const tabs = useMemo(() => [
        { id: 'plants' as const, label: `Pflanzen (${plants.length})`, icon: <Sprout /> },
        { id: 'climate' as const, label: 'Klima-Verlauf', icon: <ActivityIcon /> },
        { id: 'events' as const, label: 'Ereignisse', icon: <Droplets /> }
    ], [plants.length, environment?.id]);

    if (!environment) return null;
    const combinedEnvData = combineEnvironmentData(environment.historical, environment.events);
    const chartData = combinedEnvData.map(entry => ({
        timestamp: entry.timestamp,
        temp: entry.metrics?.temp,
        humidity: entry.metrics?.humidity,
        vpd: entry.metrics?.vpd,
        co2: entry.metrics?.co2,
        notes: entry.notes,
    }));

    return (
        <PageLayout>
            <DetailViewHeader
                title={environment.name}
                subtitle={environment.location}
                icon={ENVIRONMENT_ICONS[environment.type]}
                iconVariant={environment.type.toLowerCase()}
            />
            {environment.climate && (
                <div className={styles.climateGridWrapper}>
                    <ClimateGrid climate={environment.climate} />
                </div>
            )}
            <Tabs activeTab={activeTab} setActiveTab={setActiveTab} tabs={tabs} />
            <PlantsTab plants={plants} hidden={activeTab !== 'plants'} />
            <DataTab
                isActive={activeTab === 'climate'}
                data={chartData}
                metrics={[
                    { key: 'temp', name: 'Temperatur', color: '#1e88e5' },
                    { key: 'humidity', name: 'Luftfeuchtigkeit', color: '#43a047' },
                    { key: 'vpd', name: 'VPD', color: '#fbc02d' },
                    { key: 'co2', name: 'CO₂', color: '#e53935' }
                ]}
            />
            <EnvironmentEventTab environmentId={environmentId} events={environment.events} hidden={activeTab !== 'events'}/>
        </PageLayout>
    );
}
