import { createMemoizedTableRow } from "./createMemoizedTableRow";
import { TableHeader } from "./TableHeader";
import { SortConfig, TableColumn } from "@/types/table";
import styles from './Table.module.scss';

interface TableProps<RowType extends { key: string }> {
    columns: TableColumn<RowType>[];
    rows: RowType[];
    isEditing: boolean;
    selectedRows: string[];
    onSelectRow: (key: string) => void;
    onRowClick?: (row: RowType) => void;
    sortConfig: SortConfig<RowType>;
    onSort: (keyOrId: keyof RowType | string) => void;
}

export const Table = <RowType extends { key: string }>({ 
    columns,
    rows,
    isEditing,
    selectedRows,
    onSelectRow,
    onRowClick,
    sortConfig,
    onSort
}: TableProps<RowType>) => {
    const MemoizedTableRow = createMemoizedTableRow<RowType>();

    return (
        <div 
            className={styles.table} 
            style={{ gridTemplateColumns: `repeat(${columns.length}, 1fr)` }}
        >
            <TableHeader 
                headerData={columns} 
                sortConfig={sortConfig} 
                onSort={onSort}
            />
            
            <div className={styles.tableBody}>
                {rows.length > 0 ? (
                    rows.map((row) => (
                        <MemoizedTableRow
                            key={row.key}
                            rowData={row}
                            columns={columns}
                            isSelected={selectedRows.includes(row.key)}
                            onSelect={() => onSelectRow(row.key)}
                            onClick={() => onRowClick?.(row)}
                            isEditing={isEditing}
                        />
                    ))
                ) : (
                    <ul className={styles.tableRow}>
                        <li className={styles.empty}>Keine Ergebnisse</li>
                    </ul>
                )}
            </div>
        </div>
    );
};