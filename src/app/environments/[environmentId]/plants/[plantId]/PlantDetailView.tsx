"use client";

import { useMemo, useState } from "react";
import { usePlantMonitor } from "@/context/PlantMonitorContext";
import DetailViewLayout from "../../components/shared/DetailViewLayout";
import DetailViewHeader from "../../components/shared/DetailViewHeader";
import { ActivityIcon, Droplets, Sprout } from "lucide-react";
import Tabs, { TabItem } from "../../components/Tabs";
import { PlantData_Historical } from "@/types/plant";
import EmptyState from "../../components/shared/EmptyState";
import TabContent from "../../components/TabContent";
import PlantEventsTab from "./components/PlantEventsTab";
import { Button } from "@/components/Button/Button";
import PlantEventForm from "./components/PlantEventForm";

export default function PlantDetailView({ plantId }: { plantId: string }) {
    const { plants } = usePlantMonitor();
    const [activeTab, setActiveTab] = useState<'overview' | 'history' | 'events'>('overview');
    const [isAddingEvent, setIsAddingEvent] = useState(false);
    const plant = plants.find(plant => plant.id === plantId);

    if (!plant) return null;

    // tbh not really necessary i will look into how i memoize later or to be more specific i want to see the problems and then handle them instead of throwing around memoization
    // why? according to Josh W. Comeau you should only implement memoization if you need it since the memoization itself can apparently be more ressource heavy then rerendering small arrrays
    const tabs = useMemo<TabItem<'overview' | 'history' | 'events'>[]>(() => [
        { id: 'overview', label: 'Übersicht', icon: <Sprout /> },
        { id: 'history', label: 'Historie', icon: <ActivityIcon /> },
        { id: 'events', label: 'Ereignisse', icon: <ActivityIcon /> },
    ], []);

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
            {/* I will write real components as soon as i data */}
            {activeTab === 'overview' && (
                <TabContent title="Basisinformationen">
                    <p><strong>Art / Spezies:</strong> {plant.species || '-'}</p>
                    {plant.water?.ph && <p>pH-Wert: {plant.water.ph.value} {plant.water.ph.unit}</p>}
                    {plant.water?.ec && <p>EC: {plant.water.ec.value} {plant.water.ec.unit}</p>}
                </TabContent>
            )}

            {activeTab === 'history' && (
                <TabContent title="Historische Messungen">
                    {plant.historical && plant.historical.length > 0 ? (
                        <table>
                            <thead>
                                <tr>
                                <th>Datum</th>
                                <th>pH</th>
                                <th>EC</th>
                                <th>Höhe</th>
                                <th>Notizen</th>
                                </tr>
                            </thead>
                            <tbody>
                                {plant.historical.map((h: PlantData_Historical) => (
                                    <tr key={h.id}>
                                        <td>{new Date(h.timestamp).toLocaleDateString()}</td>
                                        <td>{h.water?.ph?.value ?? '-'}</td>
                                        <td>{h.water?.ec?.value ?? '-'}</td>
                                        <td>{h.height?.value ?? '-'}</td>
                                        <td>{h.notes ?? '-'}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    ) : (
                        <EmptyState message="Keine historischen Daten vorhanden" />
                    )}
                </TabContent>
            )}
            {activeTab === 'events' && (
                <TabContent title="Ereignisse">
                    {!isAddingEvent ? (
                        <>
                            <Button onClick={() => setIsAddingEvent(true)}>Neues Event</Button>
                            <PlantEventsTab events={plant.events} />
                        </>
                    ) : (
                        <PlantEventForm
                            plantId={plantId}
                            onCancel={() => setIsAddingEvent(false)}
                            onSave={() => setIsAddingEvent(false)}
                        />
                    )}
                </TabContent>
            )}
        </DetailViewLayout>
    );
}
