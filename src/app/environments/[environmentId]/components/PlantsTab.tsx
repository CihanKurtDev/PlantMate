import { PlantData } from '@/types/plant';
import TabContent from './shared/TabContent';
import EmptyState from './shared/EmptyState';
import { mapPlantsToTableRows } from '@/components/Table/adapters/plantTableAdapter';
import { usePlantMonitor } from '@/context/PlantMonitorContext';
import { plantTableConfig } from '@/config/plantTableConfig';
import { PlantTableCard } from '@/components/Table/TableCard';
import { useRouter } from 'next/navigation';

interface PlantsTabProps {
    plants: PlantData[];
    onAddNew?: () => void;
}

export default function PlantsTab({ plants, onAddNew }: PlantsTabProps) {
    const { deletePlants } = usePlantMonitor();
    const rows = mapPlantsToTableRows(plants);
    const router = useRouter()
    return (
        <TabContent id="plants">
            {plants.length === 0 ? (
                <EmptyState message='Keine Pflanzen vorhanden' />
            ) : (
                <PlantTableCard
                    data={rows}
                    tableConfig={{
                        ...plantTableConfig,
                        onDeleteSelected: (keys: string[]) => deletePlants(keys),
                        onRowClick: (row) => {
                            router.push(`/environments/${row.environmentId}/plants/${row.key}`);
                        },
                        onAddNew
                    }}
                />
            )}
        </TabContent>
    );
}
