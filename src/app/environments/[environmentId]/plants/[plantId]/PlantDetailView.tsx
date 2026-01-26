"use client";

import { useMemo, useState } from "react";
import { usePlantMonitor } from "@/context/PlantMonitorContext";
import DetailViewLayout from "../../components/shared/DetailViewLayout";
import DetailViewHeader from "../../components/shared/DetailViewHeader";
import { ActivityIcon, Sprout } from "lucide-react";
import TabContent from "../../components/shared/TabContent";
import PlantEventsTab from "./components/PlantEventsTab";
import { combinePlantData } from "@/helpers/combinePlantData";
import DataTab from "../../components/shared/DataTab";
import Tabs, { TabItem } from "../../components/shared/Tabs";

export default function PlantDetailView({ plantId }: { plantId: string }) {
    const { plants } = usePlantMonitor();
    const [activeTab, setActiveTab] = useState<'overview' | 'history' | 'events'>('overview');
    const plant = plants.find(plant => plant.id === plantId);
    // tbh not really necessary i will look into how i memoize later or to be more specific i want to see the problems and then handle them instead of throwing around memoization
    // why? according to Josh W. Comeau you should only implement memoization if you need it since the memoization itself can apparently be more ressource heavy then rerendering small arrrays
    const tabs = useMemo<TabItem<'overview' | 'history' | 'events'>[]>(() => [
        { id: 'overview', label: 'Übersicht', icon: <Sprout /> },
        { id: 'history', label: 'Historie', icon: <ActivityIcon /> },
        { id: 'events', label: 'Ereignisse', icon: <ActivityIcon /> },
    ], []);

    if (!plant) return null;

    const combinedPlantData = combinePlantData(plant.historical, plant.events);
    const chartData = combinedPlantData.map(data => ({
        ...data,
        ph: data.metrics?.ph,
        ec: data.metrics?.ec
    }));
    return (
        <DetailViewLayout
            backUrl={`/environments/${plant.environmentId}`}
            backLabel="Zurück zur Übersicht"
        >
            <DetailViewHeader
                title={plant.title}
                icon={Sprout}
            />

            <Tabs activeTab={activeTab} setActiveTab={setActiveTab} tabs={tabs} />
            {activeTab === 'overview' && (
                <TabContent title="Basisinformationen">
                    <p><strong>Art / Spezies:</strong> {plant.species || '-'}</p>
                    {plant.water?.ph && <p>pH-Wert: {plant.water.ph.value} {plant.water.ph.unit}</p>}
                    {plant.water?.ec && <p>EC: {plant.water.ec.value} {plant.water.ec.unit}</p>}
                </TabContent>
            )}
            <DataTab 
                isActive={activeTab === 'history'}  
                data={chartData} 
                metrics={[
                    { key: "ph", name: "pH", color: "#1e88e5" },
                    { key: "ec", name: "EC", color: "#43a047" }
                ]}
            />
            <PlantEventsTab plantId={plantId} hidden={activeTab !== 'events'} events={plant.events} />
        </DetailViewLayout>
    );
}
