"use client";

import { useMemo, useState } from "react";
import { usePlantMonitor } from "@/context/PlantMonitorContext";
import PlantsTab from "./components/PlantsTab";
import DataTab from "./components/shared/DataTab";
import { ENVIRONMENT_ICONS } from "@/config/environment";
import PageLayout from "../../../components/PageLayout/PageLayout";
import DetailViewHeader from "./components/shared/DetailViewHeader";
import ClimateGrid from "@/components/climate/ClimateGrid";
import { ActivityIcon, Droplets, Sprout } from "lucide-react";
import EnvironmentEventTab from "./components/EnvironmentEventTab";
import { combineEnvironmentData } from "@/helpers/combineEnvironmentData";
import styles from './EnvironmentDetailView.module.scss';
import Modal from "@/components/Modal/Modal";
import EnvironmentEventForm from "./components/EnvironmentEventForm";
import { Button } from "@/components/Button/Button";

export type TabVariant = 'plants' | 'climate' | 'events'

export default function EnvironmentDetailView({ environmentId }: { environmentId: string }) {
    const { environments, getPlantsByEnvironment } = usePlantMonitor();
    const environment = environments.find(e => e.id === environmentId);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const plants = getPlantsByEnvironment(environmentId);
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

    const handleModalClose = () => setIsModalOpen(false);
    const handleEventSave = () => {
        setIsModalOpen(false);
    };

    return (
        <PageLayout>
            <DetailViewHeader
                title={environment.name}
                subtitle={environment.location}
                icon={ENVIRONMENT_ICONS[environment.type]}
                iconVariant={environment.type.toLowerCase()}
            >
                <Button onClick={() => setIsModalOpen(true)}>
                    Ereignis hinzufügen
                </Button>
            </DetailViewHeader>
            {environment.climate && (
                <div className={styles.climateGridWrapper}>
                    <ClimateGrid climate={environment.climate} />
                </div>
            )}
            <PlantsTab plants={plants} />
            <EnvironmentEventTab environmentId={environmentId} events={environment.events}/>
            <DataTab
                data={chartData}
                metrics={[
                    { key: 'temp', name: 'Temperatur', color: '#1e88e5' },
                    { key: 'humidity', name: 'Luftfeuchtigkeit', color: '#43a047' },
                    { key: 'vpd', name: 'VPD', color: '#fbc02d' },
                    { key: 'co2', name: 'CO₂', color: '#e53935' }
                ]}
            />

            <Modal isOpen={isModalOpen} onClose={handleModalClose}>
                <EnvironmentEventForm
                    environmentId={environmentId}
                    onCancel={handleModalClose}
                    onSave={handleEventSave}
                />
            </Modal>
        </PageLayout>
    );
}