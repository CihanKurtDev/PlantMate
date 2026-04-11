"use client";

import { useMemo, useState } from "react";
import { Pencil } from "lucide-react";
import { Button } from "@/components/Button/Button";
import MetricGrid from "@/components/MetricGrid/MetricGrid";
import Modal from "@/components/Modal/Modal";
import { PageLayout } from "@/components/PageLayout/PageLayout";
import { PlantForm } from "@/components/PlantForm/PlantForm";
import { useEnvironment } from "@/context/EnvironmentContext";
import { usePlant } from "@/context/PlantContext";
import { getPlantMetrics } from "@/helpers/getPlantMetrics";
import {
    getCurrentPlantStage,
    getWaterMetricForPlantAtTimestamp,
    getWaterMetricsForPlantStage,
} from "@/helpers/plantStages";
import type { PlantTimeSeriesEntry } from "@/types/plant";
import { STAGE_ICON, PlantStatusInfo } from "./components/PlantStatusHero/PlantStatusHero";
import PlantEventForm from "./components/PlantEventForm";
import PlantEventsTab from "./components/PlantEventsTab";
import WaterForm from "./components/WaterForm/WaterForm";
import DataTab from "../../components/shared/DataTab/DataTab";

type ModalType = "none" | "event" | "edit";

export default function PlantDetailView({ plantId }: { plantId: string }) {
    const { plants } = usePlant();
    const { environments } = useEnvironment();
    const [modalType, setModalType] = useState<ModalType>("none");

    const plant = plants.find((entry) => entry.id === plantId);
    const environment = environments.find((entry) => entry.id === plant?.environmentId);

    const items = useMemo(() => {
        if (!plant) {
            return [];
        }

        return getPlantMetrics(plant);
    }, [plant]);

    const chartData: PlantTimeSeriesEntry[] = useMemo(() => {
        if (!plant) {
            return [];
        }

        return (plant.historical ?? []).map((entry) => ({
            timestamp: entry.timestamp,
            entryKind: "historical",
            metrics: {
                ph: entry.water?.ph?.value,
                ec: entry.water?.ec?.value,
                height: entry.height?.value,
            },
            notes: entry.notes,
        }));
    }, [plant]);

    if (!plant) {
        return null;
    }

    const waterMetrics = getWaterMetricsForPlantStage(plant, environment);
    const currentStage = getCurrentPlantStage(plant, environment);
    const closeModal = () => setModalType("none");

    return (
        <PageLayout
            title={plant.title}
            icon={STAGE_ICON[currentStage]}
            iconVariant={currentStage.toLowerCase()}
            statusInfo={<PlantStatusInfo plant={plant} environment={environment} />}
            backLink={{
                label: environment?.name
                    ? `Zurück zum Environment: ${environment.name}`
                    : "Zurück zum Environment",
                href: `/environments/${plant.environmentId}`,
            }}
            actions={(
                <>
                    <Button variant="secondary" onClick={() => setModalType("edit")}>
                        <span><Pencil size={16} />Bearbeiten</span>
                    </Button>
                    <Button onClick={() => setModalType("event")} data-demo="add-event-btn">
                        Ereignis hinzufügen
                    </Button>
                </>
            )}
        >
            <MetricGrid items={items} />

            <div data-demo="data-tab">
                <DataTab
                    data={chartData}
                    metrics={waterMetrics}
                    resolveMetricForTimestamp={(metricKey, timestamp) =>
                        getWaterMetricForPlantAtTimestamp(plant, metricKey, timestamp, environment)
                    }
                    onAddMeasurement={() => setModalType("event")}
                    title="Wasserwerte"
                    emptyTitle="Wasserverlauf aktivieren"
                    emptyText="Trage mindestens 2 Wässerungen ein um pH, EC und Trends zu sehen."
                    ctaLabel="Wässerung eintragen"
                />
            </div>

            <div data-demo="event-tab">
                <PlantEventsTab events={plant.events} />
            </div>

            <Modal isOpen={modalType === "edit"} onClose={closeModal}>
                <PlantForm plantId={plant.id} />
            </Modal>
            <Modal
                isOpen={modalType === "event"}
                onClose={closeModal}
                tabs={[
                    { key: "messung", label: "📊 Wässerung", content: <WaterForm plantId={plantId} /> },
                    { key: "ereignis", label: "📋 Ereignis", content: <PlantEventForm plantId={plantId} /> },
                ]}
            />
        </PageLayout>
    );
}
