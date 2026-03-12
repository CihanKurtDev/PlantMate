"use client";

import { useState } from "react";
import { usePlantMonitor } from "@/context/PlantMonitorContext";
import PlantsTab from "./components/PlantsTab";
import DataTab from "./components/shared/DataTab";
import { ENVIRONMENT_ICONS } from "@/config/environment";
import MetricGrid, { MetricItem } from "@/components/MetricGrid/MetricGrid";
import EnvironmentEventTab from "./components/EnvironmentEventTab";
import Modal from "@/components/Modal/Modal";
import { Button } from "@/components/Button/Button";
import { Pencil } from "lucide-react";
import { EnvironmentTimeSeriesEntry } from "@/types/environment";
import { EnvironmentForm } from "@/components/EnvironmentForm/EnvironmentForm";
import { PlantForm } from "@/components/PlantForm/PlantForm";
import styles from './EnvironmentDetailView.module.scss';
import EnvironmentEventForm from "./components/EnvironmentEventForm";
import ClimateForm from "./components/ClimateForm";
import { PageLayout } from "@/components/PageLayout/PageLayout";
import { getProfile } from "@/config/profiles";

export function capitalize(word: string) {
    return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
}

type ModalType = "none" | "event" | "edit" | "newPlant";

export default function EnvironmentDetailView({ environmentId }: { environmentId: string }) {
    const { environments, getPlantsByEnvironment } = usePlantMonitor();
    const environment = environments.find(e => e.id === environmentId);
    const [modalType, setModalType] = useState<ModalType>("none");
    const plants = getPlantsByEnvironment(environmentId);

    if (!environment) return null;

    const profile = getProfile(environment.profile);

    const latestEntry = environment.historical?.at(-1);
    const lastClimateValues = latestEntry?.climate;

    const climateEntries = Object.entries(lastClimateValues ?? {});
    const validClimateEntries = climateEntries.filter(([, value]) => value != null);
    const climateItems: MetricItem[] = validClimateEntries.map(([key, value]) => ({
        key,
        value: `${value!.value}${value!.unit}`,
    }));

    const chartData: EnvironmentTimeSeriesEntry[] = (environment.historical ?? [])
        .map(entry => ({
            timestamp: entry.timestamp,
            entryKind: 'historical' as const,
            metrics: {
                temp: entry.climate.temp?.value,
                humidity: entry.climate.humidity?.value,
                vpd: entry.climate.vpd?.value,
                co2: entry.climate.co2?.value,
            },
        }))
        .sort((a, b) => a.timestamp - b.timestamp);

    const headerTitle = `${environment.name}`;
    const headerSubtitle = `${environment.location} - ${capitalize(environment.type)} ${profile.label} `;

    const closeModal = () => setModalType("none");

    return (
        <PageLayout
            title={headerTitle}
            subtitle={headerSubtitle}
            icon={ENVIRONMENT_ICONS[environment.type]}
            iconVariant={environment.type.toLowerCase()}
            actions={
                <>
                    <Button variant="secondary" onClick={() => setModalType("edit")}>
                        <span><Pencil size={16} />Bearbeiten</span>
                    </Button>
                    <Button onClick={() => setModalType("event")}>Ereignis hinzufügen</Button>
                </>
            }
        >
            {climateItems.length > 0 && (
                <div className={styles.climateGridWrapper}>
                    <MetricGrid items={climateItems} />
                </div>
            )}
            <PlantsTab plants={plants} onAddNew={() => setModalType("newPlant")} />
            <EnvironmentEventTab events={environment.events} />

            {chartData.length > 1 && (
                <DataTab data={chartData} metrics={profile.climate} />
            )}

            <Modal
                isOpen={modalType === "event"}
                onClose={closeModal}
                tabs={[
                    { key: "messung", label: "📊 Klimamessung", content: <ClimateForm environmentId={environmentId} /> },
                    { key: "ereignis", label: "📋 Ereignis", content: <EnvironmentEventForm environmentId={environmentId} /> },
                ]}
            />

            <Modal isOpen={modalType === "newPlant"} onClose={closeModal}>
                <PlantForm environmentId={environmentId} />
            </Modal>

            <Modal isOpen={modalType === "edit"} onClose={closeModal}>
                <EnvironmentForm environmentId={environmentId} onSaved={closeModal} />
            </Modal>
        </PageLayout>
    );
}