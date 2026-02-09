"use client";

import { useState } from "react";
import { usePlantMonitor } from "@/context/PlantMonitorContext";
import PageLayout from "../../../../../components/PageLayout/PageLayout";
import DetailViewHeader from "../../components/shared/DetailViewHeader";
import { Sprout } from "lucide-react";
import TabContent from "../../components/shared/TabContent";
import PlantEventsTab from "./components/PlantEventsTab";
import { combinePlantData } from "@/helpers/combinePlantData";
import DataTab from "../../components/shared/DataTab";
import Modal from "@/components/Modal/Modal";
import PlantEventForm from "./components/PlantEventForm";
import { Button } from "@/components/Button/Button";

export default function PlantDetailView({ plantId }: { plantId: string }) {
    const { plants } = usePlantMonitor();
    const [isModalOpen, setIsModalOpen] = useState(false);
    
    const plant = plants.find(plant => plant.id === plantId);

    if (!plant) return null;

    const combinedPlantData = combinePlantData(plant.historical, plant.events);
    const chartData = combinedPlantData.map(data => ({
        ...data,
        ph: data.metrics?.ph,
        ec: data.metrics?.ec
    }));

    const handleModalClose = () => setIsModalOpen(false);
    const handleEventSave = () => {
        setIsModalOpen(false);
    };

    return (
        <PageLayout>
            <DetailViewHeader
                title={plant.title}
                icon={Sprout}
            >
                <Button onClick={() => setIsModalOpen(true)}>
                    Ereignis hinzufügen
                </Button>
            </DetailViewHeader>

            <TabContent title="Basisinformationen">
                <p><strong>Art / Spezies:</strong> {plant.species || '-'}</p>
                {plant.water?.ph && <p>pH-Wert: {plant.water.ph.value} {plant.water.ph.unit}</p>}
                {plant.water?.ec && <p>EC: {plant.water.ec.value} {plant.water.ec.unit}</p>}
            </TabContent>
            
            <DataTab 
                data={chartData} 
                metrics={[
                    { key: "ph", name: "pH", color: "#1e88e5" },
                    { key: "ec", name: "EC", color: "#43a047" }
                ]}
            />
            
            <PlantEventsTab plantId={plantId} events={plant.events} />

            <Modal isOpen={isModalOpen} onClose={handleModalClose}>
                <PlantEventForm
                    plantId={plantId}
                    onCancel={handleModalClose}
                    onSave={handleEventSave}
                />
            </Modal>
        </PageLayout>
    );
}