import React, { memo, useMemo, useState } from "react";
import { Table } from "./Table";
import type { TableConfig } from "../../types/table";
import { computeFiltersTabs } from "../../helpers/computeFilterTabs";
import { TableCardHeader } from "./TableCardHeader";
import { TableFilterBar } from "./TableFilterBar";
import { TableActionBar } from "./TableActionBar";
import { useTable } from "@/hooks/useTable";
import { Pagination } from "./Pagination";
import styles from './TableCard.module.scss';
import { PlantTableRow } from "./adapters/plantTableAdapter";

interface TableCardProps<RowType extends { key: string }> {
    data: RowType[];
    tableConfig: TableConfig<RowType> & {
        onDeleteSelected?: (keys: string[]) => void
    };
}

function createTableCard<RowType extends { key: string }>() {
    const TableCardComponent: React.FC<TableCardProps<RowType>> = ({ data, tableConfig }) => {
        const {
            filter,
            setFilter,
            setSearch,
            tableState,
            setTableState,
            paginatedRows,
            filteredRows,
        } = useTable({ data, config: tableConfig });

        const [isTableCollapsed, setIsTableCollapsed] = useState(false);
        const [isEditing, setIsEditing] = useState(false);
        const [selectedRows, setSelectedRows] = useState<string[]>([]);

        const filtersWithCounts = useMemo(() => {
            return computeFiltersTabs(data, tableConfig);
        }, [data, tableConfig]);

        const tableHasFilters = filtersWithCounts.length > 0;
        const tableHasRows = paginatedRows.length > 0;

        const memoizedConfig = useMemo(
            () => ({
                ...tableConfig,
            }),
            [tableConfig]
        );

        const deleteSelectedRows = () => {
            tableConfig.onDeleteSelected?.(selectedRows)
            setSelectedRows([]);
        }

        const toggleEditMode = () => {
            setIsEditing((prev) => !prev);
            setSelectedRows([]);
        }

        return (
            <section className={styles.tableCard}>
                <TableCardHeader 
                    title={tableConfig.title}  
                    isTableCollapsed={isTableCollapsed} setIsTableCollapsed={setIsTableCollapsed} 
                />
                <div className={`${styles.collapsable} ${isTableCollapsed ? styles.collapsed : ""}`}>
                    <div className={styles.tableActionWrapper}>
                        { tableHasFilters && 
                            <TableFilterBar 
                                filters={filtersWithCounts} 
                                filter={filter} 
                                setFilter={setFilter} 
                            />
                        }
                        <TableActionBar 
                            onSearch={setSearch} 
                            isEditing={isEditing}
                            toggleEditMode={toggleEditMode}
                            deleteSelectedRows={deleteSelectedRows}
                            hasSelectedRows={selectedRows.length > 0}
                            environmentId={data[0]?.environmentId}
                        />
                    </div>
                    <Table config={memoizedConfig} rows={paginatedRows} isEditing={isEditing} selectedRows={selectedRows} setSelectedRows={setSelectedRows} />
                    { tableHasRows && 
                        <Pagination 
                            rows={filteredRows} 
                            tableState={tableState} 
                            setTableState={setTableState} 
                        />
                    }
                </div>
            </section>
        );
    };

    return memo(TableCardComponent);
}

export const PlantTableCard = createTableCard<PlantTableRow>();