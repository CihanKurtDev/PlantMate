"use client";

import { useState } from "react";
import { usePlantMonitor } from "@/context/PlantMonitorContext";
import DetailViewLayout from "../../components/shared/DetailViewLayout";
import DetailViewHeader from "../../components/shared/DetailViewHeader";
import { ActivityIcon, Droplets, Sprout } from "lucide-react";
import Tabs from "../../components/Tabs";
import { PlantData_Historical, PlantEvent } from "@/types/plant";
import EmptyState from "../../components/shared/EmptyState";
import EventTab from "./components/EventTab";
import TabContent from "../../components/TabContent";

export default function PlantDetailView({ plantId }: { plantId: string }) {
    const { plants } = usePlantMonitor();
    const [activeTab, setActiveTab] = useState<'overview' | 'water' | 'history' | 'events'>('overview');
    const plant = plants.find(plant => plant.id === plantId);

    if (!plant) return null;

    return (
        <DetailViewLayout
            backUrl="/dashboard"
            backLabel="Zurück zur Übersicht"
        >
            <DetailViewHeader
                title={plant.title}
                icon={Sprout}
            />

            <Tabs activeTab={activeTab} setActiveTab={setActiveTab} tabs={[
                { id: 'overview', label: 'Übersicht', icon: <Sprout /> },
                { id: 'water', label: 'Wasser', icon: <Droplets /> },
                { id: 'history', label: 'Historie', icon: <ActivityIcon /> },
                { id: 'events', label: 'Ereignisse', icon: <ActivityIcon /> },
            ]} />
            
            {activeTab === 'overview' && (
                <TabContent title="Basisinformationen">
                    <p><strong>Art / Spezies:</strong> {plant.species || '-'}</p>
                    {plant.water?.ph && <p>pH-Wert: {plant.water.ph.value} {plant.water.ph.unit}</p>}
                    {plant.water?.ec && <p>EC: {plant.water.ec.value} {plant.water.ec.unit}</p>}
                </TabContent>
            )}

            {activeTab === 'water' && (
                <TabContent title="Wasserinformationen">
                    {plant.water?.ph || plant.water?.ec ? (
                        <ul>
                            {plant.water.ph && <li>pH-Wert: {plant.water.ph.value} {plant.water.ph.unit}</li>}
                            {plant.water.ec && <li>EC: {plant.water.ec.value} {plant.water.ec.unit}</li>}
                        </ul>
                    ) : (
                        <EmptyState message="Keine aktuellen Wasserinformationen vorhanden" />
                    )}
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


            {/* TODO: Hier EventTab von Environment und Plant vereinheilichen */}
            {activeTab === 'events' && <EventTab events={plant.events} />}
        </DetailViewLayout>
    );
}
