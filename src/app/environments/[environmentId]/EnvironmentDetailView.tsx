"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { usePlantMonitor } from "@/context/PlantMonitorContext";
import PlantsTab from "./components/PlantsTab";
import DataTab from "./components/shared/DataTab";
import { ENVIRONMENT_ICONS } from "@/config/environment";
import PageLayout from "../../../components/PageLayout/PageLayout";
import DetailViewHeader from "./components/shared/DetailViewHeader";
import ClimateGrid from "@/components/climate/ClimateGrid";
import EnvironmentEventTab from "./components/EnvironmentEventTab";
import styles from './EnvironmentDetailView.module.scss';
import Modal from "@/components/Modal/Modal";
import { Button } from "@/components/Button/Button";
import { Pencil } from "lucide-react";
import AddEnvironmentModalContent from "./components/AddEnvrionmentModalContent";

const getLatestHistoricalForToday = <
  T extends { timestamp: number }
>(
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
    if (
      entry.timestamp >= today.getTime() &&
      entry.timestamp < tomorrow.getTime() &&
      entry.timestamp <= now
    ) {
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


export default function EnvironmentDetailView({ environmentId }: { environmentId: string }) {
    const { environments, getPlantsByEnvironment } = usePlantMonitor();
    const environment = environments.find(e => e.id === environmentId);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const plants = getPlantsByEnvironment(environmentId);
    const router = useRouter();
    
    if (!environment) return null;

    const latestTodayEntry = getLatestHistoricalForToday(environment.historical);
    const lastClimateValues = latestTodayEntry?.climate;

    const chartData =  environment.historical?.map(h => ({
        timestamp: h.timestamp,
        entryKind: 'historical',
        metrics: {
            temp: h.climate.temp?.value,
            humidity: h.climate.humidity?.value,
            vpd: h.climate.vpd?.value,
            co2: h.climate.co2?.value
        }
    })).sort((a, b) => a.timestamp - b.timestamp);

    const headerTitle = `${environment.name} ${capitalize(environment.type)}`;
    const headerSubtitle = `${environment.location} - ${capitalize(environment.type)}`;

    return (
        <PageLayout>
            <DetailViewHeader
                title={headerTitle}
                subtitle={headerSubtitle}
                icon={ENVIRONMENT_ICONS[environment.type]}
                iconVariant={environment.type.toLowerCase()}
            >
                <Button variant="secondary" onClick={() => router.push(`/environments/new?editId=${environmentId}`)}>
                    <span>
                        <Pencil size={16} />
                        Bearbeiten
                    </span>
                </Button>
                <Button onClick={() => setIsModalOpen(true)}>
                    Ereignis hinzufügen
                </Button>
            </DetailViewHeader>
            {lastClimateValues && (
                <div className={styles.climateGridWrapper}>
                    <ClimateGrid historical={lastClimateValues} />
                </div>
            )}
            <PlantsTab plants={plants} />
            <EnvironmentEventTab environmentId={environmentId} events={environment.events}/>
            <DataTab
                data={chartData}
                metrics={[
                    { key: 'temp', name: 'Temperatur', color: '#1e88e5' },
                    { key: 'humidity', name: 'Luftfeuchtigkeit', color: '#43a047' },
                    { key: 'vpd', name: 'VPD', color: '#fbc02d' },
                    { key: 'co2', name: 'CO₂', color: '#e53935' }
                ]}
            />

            <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
                <AddEnvironmentModalContent
                    environmentId={environmentId}
                    onClose={() => setIsModalOpen(false)}
                />
            </Modal>
        </PageLayout>
    );
}