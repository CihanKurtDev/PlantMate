import { memo } from "react";
import styles from './TableFilterBar.module.scss';
import { TableFilter } from "@/types/table";

interface TableFilterBarProps<RowType> {
    filters: (TableFilter<RowType> & { count: number })[]
    filter: string;
    setFilter: (value: string) => void;
}

export const TableFilterBar = <RowType,>({
    filters,
    filter,
    setFilter,
}: TableFilterBarProps<RowType>) => {
    return (
        <div className={styles.tableFilterBar}>
            <div className={styles.tableFilters}>
                {filters.map((f, id) => (
                    <span
                        className={`${styles.filterTab} ${filter === f.displayText ? styles.selected : ""}`}
                        key={id}
                        onClick={() => setFilter(f.displayText)}
                    >
                        {f.icon && f.icon}
                        {f.displayText}
                        <div>{f.count}</div>
                    </span>
                ))}
            </div>
        </div>
    );
};

export const MemoizedTableFilterBar = memo(TableFilterBar)