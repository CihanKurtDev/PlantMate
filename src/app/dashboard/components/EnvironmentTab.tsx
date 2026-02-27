import { usePlantMonitor } from '@/context/PlantMonitorContext';
import { EnvironmentTableCard } from '@/components/Table/TableCard';
import { useRouter } from 'next/navigation';
import TabContent from '@/app/environments/[environmentId]/components/shared/TabContent';
import EmptyState from '@/app/environments/[environmentId]/components/shared/EmptyState';
import { EnvironmentData } from '@/types/environment';
import { mapEnvironmentsToTableRows } from '@/components/Table/adapters/environmentTableAdapter';
import { environmentTableConfig } from '@/config/environmentTableConfig';

interface EnvironmentTabProps {
    environments: EnvironmentData[];
    onAddNew?: () => void;
}

export default function EnvironmentTab({ environments, onAddNew }: EnvironmentTabProps) {
    const { deletePlants } = usePlantMonitor();
    console.log('environments', environments);
    const rows = mapEnvironmentsToTableRows(environments);
    console.log('Mapped Environment Table Rows:', rows);
    const router = useRouter()
    return (
        <TabContent id="environments">
            {environments.length === 0 ? (
                <EmptyState message='Keine Environments vorhanden' />
            ) : (
                <EnvironmentTableCard
                    data={rows}
                    tableConfig={{
                        ...environmentTableConfig,
                        onDeleteSelected: (keys: string[]) => deletePlants(keys),
                        onRowClick: (row) => {
                            router.push(`/environments/${row.key}`);
                        },
                        onAddNew
                    }}
                />
            )}
        </TabContent>
    );
}
