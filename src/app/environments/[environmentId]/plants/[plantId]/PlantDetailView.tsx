"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
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

export default function PlantDetailView({ plantId }: { plantId: string }) {
    const { plants } = usePlantMonitor();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const router = useRouter();

    const plant = plants.find(p => p.id === plantId);

    if (!plant) return null;

    const combinedPlantData = combinePlantData(plant.historical, plant.events);
    const chartData = combinedPlantData.map(data => ({
        ...data,
        ph: data.metrics?.ph,
        ec: data.metrics?.ec
    }));

    return (
        <PageLayout>
            <DetailViewHeader
                title={plant.title}
                icon={Sprout}
                iconVariant="sprout"
            >
                <Button variant="secondary" onClick={() => router.push(`/environments/${plant.environmentId}/plants/new?editId=${plant.id}`)}>
                    <span>
                        <Pencil size={16} />
                        Bearbeiten
                    </span>
                </Button>
                <Button onClick={() => setIsModalOpen(true)}>
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

            <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
                <PlantEventForm
                    plantId={plantId}
                    onCancel={() => setIsModalOpen(false)}
                    onSave={() => setIsModalOpen(false)}
                />
            </Modal>
        </PageLayout>
    );
}