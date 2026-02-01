import { PlantData } from '@/types/plant';
import TabContent from './shared/TabContent';
import EmptyState from './shared/EmptyState';
import { mapPlantsToTableRows } from '@/components/Table/adapters/plantTableAdapter';
import { usePlantMonitor } from '@/context/PlantMonitorContext';
import { plantTableConfig } from '@/config/plantTableConfig';
import { PlantTableCard } from '@/components/Table/TableCard';

export default function PlantsTab({ plants, hidden }: {plants: PlantData[], hidden: boolean}) {
    const { environments, deletePlants } = usePlantMonitor();
    if (hidden) return null
    const rows = mapPlantsToTableRows(plants, environments);
    return (
        <TabContent id="plants">
            {plants.length === 0 ? (
                <EmptyState message='Keine Pflanzen vorhanden' />
            ) : (
                <PlantTableCard
                    data={rows}
                    tableConfig={{
                        ...plantTableConfig,
                        onDeleteSelected: (keys: string[]) => deletePlants(keys)
                    }}
                />
            )}
        </TabContent>
    );
}
