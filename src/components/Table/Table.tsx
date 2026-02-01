import { createMemoizedTableRow } from "./createMemoizedTableRow";
import { TableHeader } from "./TableHeader";
import { TableConfig } from "@/types/table";
import styles from './Table.module.scss';

// Why we use <div> instead of <table>:
// Using a classic <table> element introduces several challenges in modern React apps:
// 1. Layout Flexibility: Tables enforce column widths across all rows, making it hard to dynamically adjust column widths or create responsive layouts.
// 2. Memoization / Performance: In a <table>, rendering one row can affect the layout of the entire table (because the browser recalculates column widths), so memoizing a single row is less effective. With <div>s and CSS Grid, each row can be rendered independently.
// 3. Interactive Features: Features like row selection, inline editing, or dynamic column changes are easier to implement with <div>s because you have full control over each "cell" and row.
// 4. Sticky Headers & Scrollable Bodies: These layouts are more straightforward to implement with <div>s and Grid/Flexbox than with a <table>.
// 5. Accessibility: We lose some semantic meaning compared to a real table, but this can be mitigated with ARIA roles if needed.
//
// In short, <div>-based tables give us full control over layout, styling, and performance optimizations in dynamic React tables, at the cost of losing native table semantics.

export const Table = <RowType extends { key: string }>({ config, rows, isEditing, selectedRows, setSelectedRows }: { config: TableConfig<RowType>, rows: RowType[], isEditing: boolean, selectedRows: string[], setSelectedRows: React.Dispatch<React.SetStateAction<string[]>> }) => {
    const { columns } = config;

    const tableHasRows = rows.length > 0;

    const handleRowSelect = (key: string) => {
        setSelectedRows((prev) =>
            prev.includes(key) ? prev.filter((row) => row !== key) : [...prev, key]
        );
    };

    const MemoizedTableRow = createMemoizedTableRow<RowType>();

    return (
        <div className={styles.table} style={{ gridTemplateColumns: `repeat(${columns.length}, 1fr)` }}>
            <TableHeader headerData={columns} />
            <div className={styles.tableBody}>
                {tableHasRows ? (
                    rows.map((entry) => (
                        <MemoizedTableRow
                            key={entry.key}
                            rowData={entry}
                            columns={columns}
                            isSelected={selectedRows.includes(entry.key)}
                            onSelect={() => handleRowSelect(entry.key)}
                            isEditing={isEditing}
                        />
                    ))
                ) : (
                    <ul className={styles.tableRow}>
                        <li className={styles.empty}>No results</li>
                    </ul>
                )}
            </div>
        </div>
    );
};
