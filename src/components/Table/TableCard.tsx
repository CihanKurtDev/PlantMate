import React, { memo, useMemo, useState } from "react";
import { Table } from "./Table";
import type { TableConfig } from "../../types/table";
import { computeFiltersTabs } from "../../helpers/computeFilterTabs";
import { TableFilterBar } from "./TableFilterBar";
import { TableActionBar } from "./TableActionBar";
import { useTable } from "@/hooks/useTable";
import { Pagination } from "./Pagination";
import styles from './TableCard.module.scss';
import { PlantTableRow } from "./adapters/plantTableAdapter";
import { Card } from "../Card/Card";

interface TableCardProps<RowType extends { key: string }> {
    data: RowType[];
    tableConfig: TableConfig<RowType> & {
        onDeleteSelected?: (keys: string[]) => void;
        onRowClick?: (row: RowType) => void;
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
            handleSort
        } = useTable({ data, config: tableConfig });

        const [isEditing, setIsEditing] = useState(false);
        const [selectedRows, setSelectedRows] = useState<string[]>([]);

        const filtersWithCounts = useMemo(() => {
            return computeFiltersTabs(data, tableConfig);
        }, [data, tableConfig]);

        const tableHasFilters = filtersWithCounts.length > 0;
        const tableHasRows = paginatedRows.length > 0;

        const deleteSelectedRows = () => {
            tableConfig.onDeleteSelected?.(selectedRows)
            setSelectedRows([]);
        }

        const toggleEditMode = () => {
            setIsEditing((prev) => !prev);
            setSelectedRows([]);
        }

        const handleSelectRow = (key: string) => {
            setSelectedRows((prev) =>
                prev.includes(key) ? prev.filter((k) => k !== key) : [...prev, key]
            );
        };

        return (
            <Card collapsible={true} title={tableConfig.title}>
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
                            environmentId={(data[0] as any)?.environmentId}
                        />
                    </div>
                    <Table 
                        columns={tableConfig.columns} 
                        rows={paginatedRows} 
                        isEditing={isEditing} 
                        selectedRows={selectedRows} 
                        onSelectRow={handleSelectRow}
                        onRowClick={tableConfig.onRowClick}
                        sortConfig={tableState.sortConfig} 
                        onSort={handleSort}
                    />
                    { tableHasRows && 
                        <Pagination 
                            rows={filteredRows} 
                            tableState={tableState} 
                            setTableState={setTableState} 
                        />
                    }
            </Card>
        );
    };

    return memo(TableCardComponent);
}

export const PlantTableCard = createTableCard<PlantTableRow>();