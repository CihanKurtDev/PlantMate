"use client";

import { useState, useMemo } from "react";
import { Pencil, Sprout } from "lucide-react";
import PlantEventsTab from "./components/PlantEventsTab";
import DataTab from "../../components/shared/DataTab/DataTab";
import Modal from "@/components/Modal/Modal";
import { Button } from "@/components/Button/Button";
import { Card } from "@/components/Card/Card";
import { PlantForm } from "@/components/PlantForm/PlantForm";
import WaterForm from "./components/WaterForm/WaterForm";
import PlantEventForm from "./components/PlantEventForm";
import { PlantTimeSeriesEntry } from "@/types/plant";
import { PageLayout } from "@/components/PageLayout/PageLayout";
import MetricGrid from "@/components/MetricGrid/MetricGrid";
import { getProfile } from "@/config/profiles";
import TabContent from "@/components/TabContent/TabContent";
import { usePlant } from "@/context/PlantContext";
import { useEnvironment } from "@/context/EnvironmentContext";
import { getPlantMetrics } from "@/helpers/getPlantMetrics";

type ModalType = "none" | "event" | "edit";

export default function PlantDetailView({ plantId }: { plantId: string }) {
    const { plants } = usePlant();
    const { environments } = useEnvironment();
    const [modalType, setModalType] = useState<ModalType>("none");

    const plant = plants.find(p => p.id === plantId);
    if (!plant) return null;

    const environment = environments.find(e => e.id === plant.environmentId);
    const profile = getProfile(plant.profile);

    const items = useMemo(() => {
        return getPlantMetrics(plant);
    }, [plant]);

    const chartData: PlantTimeSeriesEntry[] = (plant.historical ?? []).map(entry => ({
        timestamp: entry.timestamp,
        entryKind: 'historical',
        metrics: {
            ph: entry.water?.ph?.value,
            ec: entry.water?.ec?.value,
            height: entry.height?.value,
        },
        notes: entry.notes,
    }));

    const closeModal = () => setModalType("none");

    return (
        <PageLayout
            title={plant.title}
            icon={Sprout}
            iconVariant="sprout"
            backLink={{
                label: environment?.name
                    ? `Zurück zum Environment: ${environment.name}`
                    : "Zurück zum Environment",
                href: `/environments/${plant.environmentId}`,
            }}
            actions={
                <>
                    <Button variant="secondary" onClick={() => setModalType("edit")}>
                        <span><Pencil size={16} />Bearbeiten</span>
                    </Button>
                    <Button onClick={() => setModalType("event")}>
                        Ereignis hinzufügen
                    </Button>
                </>
            }
        >
            <MetricGrid items={items} />

            <TabContent id="basicInfo">
                <Card title="Basisinformationen" collapsible>
                    <p><strong>Art / Spezies:</strong> {plant.species || '-'}</p>
                </Card>
            </TabContent>

            <DataTab
                data={chartData}
                metrics={profile.water}
                onAddMeasurement={() => setModalType("event")}
                title="Wasserwerte"
                emptyTitle="Wasserverlauf aktivieren"
                emptyText="Trage mindestens 2 Wässerungen ein um pH, EC und Trends zu sehen."
                ctaLabel="Wässerung eintragen"
            />

            <PlantEventsTab events={plant.events} />

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