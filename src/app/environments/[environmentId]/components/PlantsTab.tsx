import { PlantData } from '@/types/plant';
import { mapPlantsToTableRows } from '@/components/Table/adapters/plantTableAdapter';
import { plantTableConfig } from '@/config/plantTableConfig';
import { PlantTableCard } from '@/components/Table/TableCard';
import { useRouter } from 'next/navigation';
import { useIsMobile } from '@/hooks/useIsMobile';
import { PlantMobileList } from './PlantMobileCard';
import TabContent from '@/components/TabContent/TabContent';
import { usePlant } from '@/context/PlantContext';
import { GhostState } from './shared/GhostState/GhostState';
import { GhostCard } from './shared/GhostState/GhostCard';
import { PLANT_GHOST_ROWS } from './ghostPlantRows';

interface PlantsTabProps {
    plants: PlantData[];
    onAddNew?: () => void;
}

export default function PlantsTab({ plants, onAddNew }: PlantsTabProps) {
    const { deletePlants } = usePlant();
    const router = useRouter();
    const isMobile = useIsMobile();

    const isEmpty = plants.length === 0;
    const rows = isEmpty ? PLANT_GHOST_ROWS : mapPlantsToTableRows(plants);

    return (
        <TabContent id="plants">
            <GhostState
                isEmpty={isEmpty}
                overlay={
                    <GhostCard
                        title="Erste Pflanze anlegen"
                        text="Füge deine erste Pflanze hinzu und verfolge pH, EC und Gießverlauf."
                        cta="Pflanze anlegen"
                        onClick={onAddNew}
                    />
                }
            >
                {isMobile ? (
                    <PlantMobileList rows={rows} onAddNew={onAddNew} />
                ) : (
                    <PlantTableCard
                        data={rows}
                        tableConfig={{
                            ...plantTableConfig,
                            onDeleteSelected: (keys: string[]) => deletePlants(keys),
                            onRowClick: (row) => router.push(`/environments/${row.environmentId}/plants/${row.key}`),
                            onAddNew,
                        }}
                    />
                )}
            </GhostState>
        </TabContent>
    );
}