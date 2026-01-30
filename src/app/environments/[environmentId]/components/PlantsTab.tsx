import { PlantData } from '@/types/plant';
import styles from './PlantsTab.module.scss';
import TabContent from './shared/TabContent';
import EmptyState from './shared/EmptyState';
import { mapPlantsToTableRows } from '@/components/Table/adapters/plantTableAdapter';
import { usePlantMonitor } from '@/context/PlantMonitorContext';
import { Table } from '@/components/Table/Table';
import { plantTableConfig } from '@/config/plantTableConfig';
import { PlantTableCard } from '@/components/Table/TableCard';

export default function PlantsTab({ plants, hidden }: {plants: PlantData[], hidden: boolean}) {
    const { environments } = usePlantMonitor();
    if (hidden) return null
    const rows = mapPlantsToTableRows(plants, environments);
    return (
        <TabContent id="plants" title={`Pflanzen (${plants.length})`}>
            {plants.length === 0 ? (
                <EmptyState message='Keine Pflanzen vorhanden' />
            ) : (
                <PlantTableCard
                    data={rows}
                    tableConfig={plantTableConfig}
                />
            )}
        </TabContent>
    );
}
