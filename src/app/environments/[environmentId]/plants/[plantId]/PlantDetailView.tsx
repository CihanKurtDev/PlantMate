"use client";

import { useState } from "react";
import { usePlantMonitor } from "@/context/PlantMonitorContext";
import PageLayout from "../../../../../components/PageLayout/PageLayout";
import DetailViewHeader from "../../components/shared/DetailViewHeader";
import { Pencil, Sprout } from "lucide-react";
import TabContent from "../../components/shared/TabContent";
import PlantEventsTab from "./components/PlantEventsTab";
import { combinePlantData } from "@/helpers/combinePlantData";
import DataTab from "../../components/shared/DataTab";
import Modal from "@/components/Modal/Modal";
import PlantEventForm from "./components/PlantEventForm";
import { Button } from "@/components/Button/Button";
import { Card } from "@/components/Card/Card";
import { PlantForm } from "@/app/environments/new/components/PlantForm";

type modalType = "none" | "event" | "edit"

export default function PlantDetailView({ plantId }: { plantId: string }) {
    const { plants, environments  } = usePlantMonitor();
    const [modalType, setModalType] = useState<modalType>("none");

    const plant = plants.find(p => p.id === plantId);

    if (!plant) return null;

    const environment = environments.find(e => e.id === plant.environmentId);

    const combinedPlantData = combinePlantData(plant.historical, plant.events);
    const chartData = combinedPlantData.map(data => ({
        ...data,
        ph: data.metrics?.ph,
        ec: data.metrics?.ec
    }));

    const closeModal = () => setModalType("none")

    return (
        <PageLayout>
            <DetailViewHeader
                title={plant.title}
                icon={Sprout}
                iconVariant="sprout"
                backLink={{
                    label: environment?.name ? `Zurück zum Environment: ${environment?.name}`: "Zurück zum Environment",
                    href: `/environments/${plant.environmentId}`,
                }}
            >
                <Button variant="secondary" onClick={() => setModalType("edit")}>
                    <span>
                        <Pencil size={16} />
                        Bearbeiten
                    </span>
                </Button>
                <Button onClick={() => setModalType("event")}>
                    Ereignis hinzufügen
                </Button>
            </DetailViewHeader>

            <TabContent id="basicInfo">
                <Card title="Basisinformationen" collapsible={true}>
                    <p><strong>Art / Spezies:</strong> {plant.species || '-'}</p>
                    {plant.water?.ph && <p>pH-Wert: {plant.water.ph.value} {plant.water.ph.unit}</p>}
                    {plant.water?.ec && <p>EC: {plant.water.ec.value} {plant.water.ec.unit}</p>}
                </Card>
            </TabContent>
            
            <DataTab 
                data={chartData} 
                metrics={[
                    { key: "ph", name: "pH", color: "#1e88e5" },
                    { key: "ec", name: "EC", color: "#43a047" }
                ]}
            />
            
            <PlantEventsTab plantId={plantId} events={plant.events} />

            <Modal isOpen={modalType === "edit"} onClose={closeModal}>
                <PlantForm
                    environmentId={environment?.id}
                />
            </Modal>
            <Modal isOpen={modalType === "event"} onClose={closeModal}>
                <PlantEventForm
                    plantId={plantId}
                />
            </Modal>
        </PageLayout>
    );
}