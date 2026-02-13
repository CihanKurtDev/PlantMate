"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { usePlantMonitor } from "@/context/PlantMonitorContext";
import PlantsTab from "./components/PlantsTab";
import DataTab from "./components/shared/DataTab";
import { ENVIRONMENT_ICONS } from "@/config/environment";
import PageLayout from "../../../components/PageLayout/PageLayout";
import DetailViewHeader from "./components/shared/DetailViewHeader";
import ClimateGrid from "@/components/climate/ClimateGrid";
import EnvironmentEventTab from "./components/EnvironmentEventTab";
import { combineEnvironmentData } from "@/helpers/combineEnvironmentData";
import styles from './EnvironmentDetailView.module.scss';
import Modal from "@/components/Modal/Modal";
import EnvironmentEventForm from "./components/EnvironmentEventForm";
import { Button } from "@/components/Button/Button";
import { Pencil } from "lucide-react";

export function capitalize(word: string) {
    return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
}

export default function EnvironmentDetailView({ environmentId }: { environmentId: string }) {
    const { environments, getPlantsByEnvironment } = usePlantMonitor();
    const environment = environments.find(e => e.id === environmentId);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const plants = getPlantsByEnvironment(environmentId);
    const router = useRouter();

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

    const headerTitle = `${environment.name} ${capitalize(environment.type)}`
    const headerSubtitle = `${environment.location} - ${capitalize(environment.type)}`

    return (
        <PageLayout>
            <DetailViewHeader
                title={headerTitle}
                subtitle={headerSubtitle}
                icon={ENVIRONMENT_ICONS[environment.type]}
                iconVariant={environment.type.toLowerCase()}
            >
                <Button variant="secondary" onClick={() => router.push(`/environments/new?editId=${environmentId}`)}>
                    <span>
                        <Pencil size={16} />
                        Bearbeiten
                    </span>
                </Button>
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

            <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
                <EnvironmentEventForm
                    environmentId={environmentId}
                    onCancel={() => setIsModalOpen(false)}
                    onSave={() => setIsModalOpen(false)}
                />
            </Modal>
        </PageLayout>
    );
}