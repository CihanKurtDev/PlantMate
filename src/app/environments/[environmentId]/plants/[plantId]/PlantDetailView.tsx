"use client";

import { useState } from "react";
import { usePlantMonitor } from "@/context/PlantMonitorContext";
import PageLayout from "@/components/PageLayout/PageLayout";
import DetailViewHeader from "../../components/shared/DetailViewHeader";
import { Pencil, Sprout } from "lucide-react";
import TabContent from "../../components/shared/TabContent";
import PlantEventsTab from "./components/PlantEventsTab";
import DataTab, { MetricConfig } from "../../components/shared/DataTab";
import Modal from "@/components/Modal/Modal";
import { Button } from "@/components/Button/Button";
import { Card } from "@/components/Card/Card";
import { PlantForm } from "@/components/PlantForm/PlantForm";
import WaterForm from "./components/WaterForm";
import PlantEventForm from "./components/PlantEventForm";
import { PlantTimeSeriesEntry } from "@/types/plant";

type modalType = "none" | "event" | "edit";

export default function PlantDetailView({ plantId }: { plantId: string }) {
    const { plants, environments } = usePlantMonitor();
    const [modalType, setModalType] = useState<modalType>("none");

    const plant = plants.find(p => p.id === plantId);
    if (!plant) return null;
    const environment = environments.find(e => e.id === plant.environmentId);

    const chartData: PlantTimeSeriesEntry[] = (plant.historical ?? []).map(h => ({
        timestamp: h.timestamp,
        entryKind: 'historical',
        metrics: {
            ph: h.water?.ph?.value,
            ec: h.water?.ec?.value,
            height: h.height?.value,
        },
        notes: h.notes,
    }));

    const closeModal = () => setModalType("none");

    const metrics: MetricConfig[] = [
        { key: 'ph', label: 'pH', unit: 'pH', color: '#1e88e5', icon: Sprout, min: 0, max: 14, idealMin: 5.5, idealMax: 6.5, format: v => v.toFixed(1) },
        { key: 'ec', label: 'EC', unit: 'mS/cm', color: '#43a047', icon: Sprout, min: 0, max: 5, idealMin: 1, idealMax: 2, format: v => v.toFixed(2) }
    ];

    return (
        <PageLayout>
            <DetailViewHeader
                title={plant.title}
                icon={Sprout}
                iconVariant="sprout"
                backLink={{
                    label: environment?.name ? `Zurück zum Environment: ${environment?.name}` : "Zurück zum Environment",
                    href: `/environments/${plant.environmentId}`,
                }}
            >
                <Button variant="secondary" onClick={() => setModalType("edit")}>
                    <span>
                        <Pencil size={16} />
                        Bearbeiten
                    </span>
                </Button>
                <Button onClick={() => setModalType("event")}>Ereignis hinzufügen</Button>
            </DetailViewHeader>

            <TabContent id="basicInfo">
                <Card title="Basisinformationen" collapsible>
                    <p><strong>Art / Spezies:</strong> {plant.species || '-'}</p>
                </Card>
            </TabContent>

            <DataTab data={chartData} metrics={metrics} />

            <PlantEventsTab plantId={plantId} events={plant.events} />

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