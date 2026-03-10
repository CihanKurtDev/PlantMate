"use client"
import { usePlantMonitor } from "@/context/PlantMonitorContext";
import Modal from "@/components/Modal/Modal";
import { useState } from "react";
import { MultiStepForm } from "./components/MultiStepForm";
import EnvironmentTab from "./components/EnvironmentTab";
import { PageLayout } from "@/components/PageLayout/PageLayout";
import { EnvironmentData } from "@/types/environment";
import { PlantData } from "@/types/plant";
import MetricGrid, { MetricItem } from "@/components/MetricGrid/MetricGrid";

export function getDashboardMetrics(
    environments: EnvironmentData[],
    plants: PlantData[]
): MetricItem[] {
    const envsWithWarning = environments.filter(env => {
        const latest = env.historical
            ?.slice()
            .sort((a, b) => b.timestamp - a.timestamp)[0];
        if (!latest) return false;
        const { temp, humidity, co2 } = latest.climate;
        return (
            (temp && temp.value > 28) || (humidity && (humidity.value < 40 || humidity.value > 70)) || (co2 && co2.value > 800)
        );
    }).length;

    const criticalPlants = plants.filter(plant => {
        const latest = plant.historical
            ?.slice()
            .sort((a, b) => b.timestamp - a.timestamp)[0];
        if (!latest?.water) return false;
        return (
            (latest.water.ph && (latest.water.ph.value < 5.5 || latest.water.ph.value > 7.0)) ||
            (latest.water.ec && latest.water.ec.value > 3.0)
        );
    }).length;

    const lastTimestamp = environments
        .flatMap(e => e.historical ?? [])
        .sort((a, b) => b.timestamp - a.timestamp)[0]?.timestamp ?? null;

    return [
        {
            key: 'environments',
            value: String(environments.length),
            subValue: envsWithWarning > 0 ? `${envsWithWarning} mit Warnung` : 'Alle OK',
        },
        {
            key: 'plants',
            value: String(plants.length),
            subValue: criticalPlants > 0 ? `${criticalPlants} kritisch` : 'Alle OK',
        },
        {
            key: 'warnings',
            value: String(envsWithWarning + criticalPlants),
            subValue: (envsWithWarning + criticalPlants) > 0 ? 'Handlung erforderlich' : 'Keine Warnungen',
        },
        {
            key: 'lastMeasurement',
            value: lastTimestamp ? formatTimestamp(lastTimestamp) : '–',
            subValue: 'Letzte Messung',
        },
    ];
}

function formatTimestamp(timestamp: number): string {
    const diffMin = Math.floor((Date.now() - timestamp) / 60_000);
    if (diffMin < 1)  return 'Gerade eben';
    if (diffMin < 60) return `vor ${diffMin} Min`;
    const diffH = Math.floor(diffMin / 60);
    if (diffH < 24)   return `vor ${diffH} Std`;
    return new Date(timestamp).toLocaleDateString('de-DE', { day: '2-digit', month: '2-digit' });
}

const Dashboard = () => {
    const { environments, plants } = usePlantMonitor();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const items = getDashboardMetrics(environments, plants);

    return (
        <PageLayout
            title="Dashboard"
            subtitle="Übersicht deiner Pflanzenumgebungen"
        >
            <MetricGrid items={items} />
            <EnvironmentTab environments={environments} onAddNew={() => setIsModalOpen(true)} />
            <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
                <MultiStepForm />
            </Modal>
        </PageLayout>
    );
}

export default Dashboard