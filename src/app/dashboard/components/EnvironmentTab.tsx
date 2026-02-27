"use client"
import { usePlantMonitor } from '@/context/PlantMonitorContext';
import { EnvironmentTableCard } from '@/components/Table/TableCard';
import { useRouter } from 'next/navigation';
import TabContent from '@/app/environments/[environmentId]/components/shared/TabContent';
import EmptyState from '@/app/environments/[environmentId]/components/shared/EmptyState';
import { EnvironmentData } from '@/types/environment';
import { mapEnvironmentsToTableRows } from '@/components/Table/adapters/environmentTableAdapter';
import { environmentTableConfig } from '@/config/environmentTableConfig';
import { useIsMobile } from '@/hooks/useIsMobile';
import { EnvironmentMobileList } from './EnvironmentMobileCard';

interface EnvironmentTabProps {
    environments: EnvironmentData[];
    onAddNew?: () => void;
}

export default function EnvironmentTab({ environments, onAddNew }: EnvironmentTabProps) {
    const { deletePlants } = usePlantMonitor();
    const router = useRouter();
    const isMobile = useIsMobile();
    const rows = mapEnvironmentsToTableRows(environments);

    if (environments.length === 0) {
        return (
            <TabContent id="environments">
                <EmptyState message='Keine Environments vorhanden' />
            </TabContent>
        );
    }

    return (
        <TabContent id="environments">
            {isMobile ? (
                <EnvironmentMobileList
                    rows={rows}
                    onAddNew={onAddNew}
                />
            ) : (
                <EnvironmentTableCard
                    data={rows}
                    tableConfig={{
                        ...environmentTableConfig,
                        onDeleteSelected: (keys: string[]) => deletePlants(keys),
                        onRowClick: (row) => router.push(`/environments/${row.key}`),
                        onAddNew,
                    }}
                />
            )}
        </TabContent>
    );
}