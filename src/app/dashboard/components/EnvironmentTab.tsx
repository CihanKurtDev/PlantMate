"use client"
import { EnvironmentTableCard } from '@/components/Table/TableCard';
import { useRouter } from 'next/navigation';
import TabContent from '@/components/TabContent/TabContent';
import { EnvironmentData } from '@/types/environment';
import { mapEnvironmentsToTableRows } from '@/components/Table/adapters/environmentTableAdapter';
import { environmentTableConfig } from '@/config/environmentTableConfig';
import { useIsMobile } from '@/hooks/useIsMobile';
import { EnvironmentMobileList } from './EnvironmentMobileCard';
import { useEnvironment } from '@/context/EnvironmentContext';
import { usePlant } from '@/context/PlantContext';

interface EnvironmentTabProps {
    environments: EnvironmentData[];
    onAddNew?: () => void;
}

export default function EnvironmentTab({ environments, onAddNew }: EnvironmentTabProps) {
    const { deleteEnvironments } = useEnvironment();
    const { plants } = usePlant();
    const router = useRouter();
    const isMobile = useIsMobile();
    const rows = mapEnvironmentsToTableRows(environments, plants);

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
                        onDeleteSelected: (keys: string[]) => deleteEnvironments(keys),
                        onRowClick: (row) => router.push(`/environments/${row.key}`),
                        onAddNew,
                    }}
                />
            )}
        </TabContent>
    );
}