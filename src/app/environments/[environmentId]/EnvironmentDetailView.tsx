"use client";

import { useState } from "react";
import { usePlantMonitor } from "@/context/PlantMonitorContext";
import PlantsTab from "./components/PlantsTab";
import DataTab, { MetricConfig } from "./components/shared/DataTab";
import { ENVIRONMENT_ICONS } from "@/config/environment";
import PageLayout from "@/components/PageLayout/PageLayout";
import DetailViewHeader from "./components/shared/DetailViewHeader";
import ClimateGrid from "@/components/climate/ClimateGrid";
import EnvironmentEventTab from "./components/EnvironmentEventTab";
import Modal from "@/components/Modal/Modal";
import { Button } from "@/components/Button/Button";
import { Droplets, Leaf, Pencil, Thermometer, Wind } from "lucide-react";
import { EnvironmentData_Historical, EnvironmentTimeSeriesEntry } from "@/types/environment";
import { EnvironmentForm } from "@/components/EnvironmentForm/EnvironmentForm";
import { PlantForm } from "@/components/PlantForm/PlantForm";
import styles from './EnvironmentDetailView.module.scss';
import EnvironmentEventForm from "./components/EnvironmentEventForm";
import ClimateForm from "./components/ClimateForm";

export const getLatestHistoricalForToday = <T extends { timestamp: number }>(
    entries?: T[]
): T | undefined => {
    if (!entries?.length) return undefined;
    const now = Date.now();
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    let latest: T | undefined;
    for (const entry of entries) {
        if (entry.timestamp >= today.getTime() && entry.timestamp < tomorrow.getTime() && entry.timestamp <= now) {
            if (!latest || entry.timestamp > latest.timestamp) {
                latest = entry;
            }
        }
    }
    return latest;
};

export function capitalize(word: string) {
    return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
}

function buildEnvironmentChartData(historical?: EnvironmentData_Historical[]): EnvironmentTimeSeriesEntry[] {
    if (!historical?.length) return []
    return historical
        .map((entry): EnvironmentTimeSeriesEntry => ({
            timestamp: entry.timestamp,
            entryKind: 'historical',
            metrics: {
                temp: entry.climate.temp?.value,
                humidity: entry.climate.humidity?.value,
                vpd: entry.climate.vpd?.value,
                co2: entry.climate.co2?.value,
            },
        }))
        .sort((a, b) => a.timestamp - b.timestamp);
}

type modalType = "none" | "event" | "edit" | "newPlant"

export default function EnvironmentDetailView({ environmentId }: { environmentId: string }) {
    const { environments, getPlantsByEnvironment } = usePlantMonitor();
    const environment = environments.find(e => e.id === environmentId);
    const [modalType, setModalType] = useState<modalType>("none");
    const plants = getPlantsByEnvironment(environmentId);
    
    if (!environment) return null;

    const latestTodayEntry = getLatestHistoricalForToday(environment.historical);
    const lastClimateValues = latestTodayEntry?.climate;
    const chartData = buildEnvironmentChartData(environment.historical)
    const headerTitle = `${environment.name} ${capitalize(environment.type)}`;
    const headerSubtitle = `${environment.location} - ${capitalize(environment.type)}`;

    const closeModal = () => setModalType("none")

    const metrics: MetricConfig[] = [
        { key: 'temp', label: 'Temperatur', color: '#1e88e5', icon: Thermometer, min: 0, max: 50, idealMin: 20, idealMax: 28, unit: '°C', format: (v) => `${v.toFixed(1)} °C` },
        { key: 'humidity', label: 'Luftfeuchtigkeit', color: '#43a047', icon: Droplets, min: 0, max: 100, idealMin: 40, idealMax: 70, unit: '%', format: (v) => `${v.toFixed(0)} %` },
        { key: 'vpd', label: 'VPD', color: '#fbc02d', icon: Wind, min: 0, max: 3, idealMin: 0.8, idealMax: 1.6, unit: 'kPa', format: (v) => `${v.toFixed(2)} kPa` },
        { key: 'co2', label: 'CO₂', color: '#e53935', icon: Leaf, min: 300, max: 2000, idealMin: 400, idealMax: 800, unit: 'ppm', format: (v) => `${v.toFixed(0)} ppm` },
    ];

    return (
        <PageLayout>
            <DetailViewHeader title={headerTitle} subtitle={headerSubtitle} icon={ENVIRONMENT_ICONS[environment.type]} iconVariant={environment.type.toLowerCase()}>
                <Button variant="secondary" onClick={() => setModalType("edit")}>
                    <span>
                        <Pencil size={16} />
                        Bearbeiten
                    </span>
                </Button>
                <Button onClick={() => setModalType("event")}>Ereignis hinzufügen</Button>
            </DetailViewHeader>

            {lastClimateValues && (
                <div className={styles.climateGridWrapper}>
                    <ClimateGrid climate={lastClimateValues} />
                </div>
            )}

            <PlantsTab plants={plants} onAddNew={() => setModalType("newPlant")} />
            <EnvironmentEventTab environmentId={environmentId} events={environment.events} />

            <DataTab data={chartData} metrics={metrics} />

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