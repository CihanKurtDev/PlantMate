import { PlantData } from '@/types/plant';
import TabContent from './shared/TabContent';
import { mapPlantsToTableRows } from '@/components/Table/adapters/plantTableAdapter';
import { usePlantMonitor } from '@/context/PlantMonitorContext';
import { plantTableConfig } from '@/config/plantTableConfig';
import { PlantTableCard } from '@/components/Table/TableCard';
import { useRouter } from 'next/navigation';
import { useIsMobile } from '@/hooks/useIsMobile';
import { PlantMobileList } from './PlantMobileCard';

interface PlantsTabProps {
    plants: PlantData[];
    onAddNew?: () => void;
}

export default function PlantsTab({ plants, onAddNew }: PlantsTabProps) {
    const { deletePlants, environments } = usePlantMonitor();
    const rows = mapPlantsToTableRows(plants, environments);
    const router = useRouter()
    const isMobile = useIsMobile();
    
    return (
        <TabContent id="plants">
            {isMobile ? (
                <PlantMobileList rows={rows} onAddNew={onAddNew} />
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
