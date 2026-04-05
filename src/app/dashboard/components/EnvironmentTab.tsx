"use client";

import { EnvironmentTableCard } from '@/components/Table/TableCard';
import { useRouter } from 'next/navigation';
import TabContent from '@/components/TabContent/TabContent';
import { EnvironmentData } from '@/types/environment';
import { mapEnvironmentsToTableRows } from '@/components/Table/adapters/environmentTableAdapter';
import { environmentTableConfig } from '@/config/environmentTableConfig';
import { useIsMobile } from '@/hooks/useIsMobile';
import { EnvironmentMobileList } from './EnvironmentMobileCard';
import { usePlant } from '@/context/PlantContext';
import { GhostState } from '@/app/environments/[environmentId]/components/shared/GhostState/GhostState';
import { GhostCard } from '@/app/environments/[environmentId]/components/shared/GhostState/GhostCard';
import { ENVIRONMENT_GHOST_ROWS } from './ghostEnvironmentRows';
import { useDeleteEnvironments } from '@/hooks/useDeleteEnvironments';

interface Props {
    environments: EnvironmentData[];
    onAddNew?: () => void;
}

export default function EnvironmentTab({ environments, onAddNew }: Props) {
    const deleteEnvironments = useDeleteEnvironments();
    const { plants } = usePlant();
    const router = useRouter();
    const isMobile = useIsMobile();

    const isEmpty = environments.length === 0;
    const rows = isEmpty
        ? ENVIRONMENT_GHOST_ROWS
        : mapEnvironmentsToTableRows(environments, plants);

    return (
        <TabContent id="environments">
            <GhostState
                isEmpty={isEmpty}
                overlay={
                    <GhostCard
                        title="Erste Umgebung anlegen"
                        text="Erstelle deine erste Pflanzenumgebung und behalte Temperatur, Luftfeuchtigkeit und mehr im Blick."
                        cta="Umgebung erstellen"
                        onClick={onAddNew}
                    />
                }
            >
                {isMobile ? (
                    <EnvironmentMobileList rows={rows} onAddNew={onAddNew} />
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
            </GhostState>
        </TabContent>
    );
}