"use client";

import { useMemo, useState } from "react";
import PlantsTab from "./components/PlantsTab";
import DataTab from "./components/shared/DataTab/DataTab";
import MetricGrid from "@/components/MetricGrid/MetricGrid";
import EnvironmentEventTab from "./components/EnvironmentEventTab";
import Modal from "@/components/Modal/Modal";
import { Button } from "@/components/Button/Button";
import { Pencil } from "lucide-react";
import { EnvironmentTimeSeriesEntry } from "@/types/environment";
import { EnvironmentForm } from "@/components/EnvironmentForm/EnvironmentForm";
import { PlantForm } from "@/components/PlantForm/PlantForm";
import EnvironmentEventForm from "./components/EnvironmentEventForm";
import ClimateForm from "./components/ClimateForm/ClimateForm";
import { PageLayout } from "@/components/PageLayout/PageLayout";
import { toC } from "@/helpers/validationUtils";
import { getIntersectedClimateMetrics } from "./components/shared/DataTab/dataTabUtils";
import { useEnvironment } from "@/context/EnvironmentContext";
import { usePlant } from "@/context/PlantContext";
import { getEnvironmentMetrics } from "@/helpers/getEnvironmentMetrics";
import { useLightCycleSnapshot, getLightIconVariant, LIGHT_CYCLE_ICON, LightStatusInfo } from "./components/LightHero/LightHero";

export function capitalize(word: string) {
    return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
}

type ModalType = "none" | "event" | "edit" | "newPlant";

export default function EnvironmentDetailView({ environmentId }: { environmentId: string }) {
    const { environments } = useEnvironment();
    const { getPlantsByEnvironment } = usePlant();
    const [modalType, setModalType] = useState<ModalType>("none");
    const environment = environments.find(e => e.id === environmentId);
    const plants = getPlantsByEnvironment(environmentId);
    const lightSnapshot = useLightCycleSnapshot(environment?.currentLightSchedule);
    const lightVariant = getLightIconVariant(lightSnapshot);
    const lightIcon = LIGHT_CYCLE_ICON[lightVariant];

    const items = useMemo(() => {
        if (!environment) return [];
        return getEnvironmentMetrics(environment);
    }, [environment]);

    const climateMetrics = useMemo(() => {
        return getIntersectedClimateMetrics(plants);
    }, [plants]);

    const chartData: EnvironmentTimeSeriesEntry[] = useMemo(() => {
        if (!environment) return [];

        return (environment.historical ?? [])
            .map(entry => ({
                timestamp: entry.timestamp,
                entryKind: 'historical' as const,
                metrics: {
                    temp: entry.climate.temp?.value !== undefined
                        ? toC(entry.climate.temp.value, entry.climate.temp.unit)
                        : undefined,
                    humidity: entry.climate.humidity?.value,
                    vpd: entry.climate.vpd?.value,
                    co2: entry.climate.co2?.value,
                },
            }))
            .sort((a, b) => a.timestamp - b.timestamp);
    }, [environment]);

    const closeModal = () => setModalType("none");

    if (!environment) return null;

    return (
        <PageLayout
            title={environment.name}
            icon={lightIcon.icon}
            iconVariant={lightIcon.variant}
            statusInfo={
                <LightStatusInfo
                    schedule={environment.currentLightSchedule}
                    snapshot={lightSnapshot}
                    locationLabel={`${environment.location} - ${capitalize(environment.type)}`}
                />
            }
            actions={
                <>
                    <Button variant="secondary" onClick={() => setModalType("edit")}>
                        <span><Pencil size={16} />Bearbeiten</span>
                    </Button>
                    <Button onClick={() => setModalType("event")} data-demo="add-event-btn">
                        Ereignis hinzufügen
                    </Button>
                </>
            }
            backLink={{ label: "Zurück zum Dashboard", href: "/dashboard" }}
        >
            <MetricGrid items={items} />

            <div data-demo="plants-tab">
                <PlantsTab plants={plants} onAddNew={() => setModalType("newPlant")} />
            </div>

            <div data-demo="event-tab">
                <EnvironmentEventTab 
                    events={environment.events} 
                    onAddEvent={() => setModalType("event")} 
                />
            </div>

            <div data-demo="data-tab">
                <DataTab
                    data={chartData}
                    metrics={climateMetrics}
                    onAddMeasurement={() => setModalType("event")}
                    title="Klimadaten"
                    emptyTitle="Klimaverlauf aktivieren"
                    emptyText="Trage mindestens 2 Messungen ein um Trends, Abweichungen und Verläufe zu sehen."
                    ctaLabel="Messung eintragen"
                />
            </div>

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
