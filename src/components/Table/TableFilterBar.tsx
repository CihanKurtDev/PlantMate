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
    const selectedFilter = filters.find(f => f.displayText === filter);
    return (
        <div className={styles.tableFilterBar}>
            <div className={styles.tableFilters}>
                {filters.map((f, id) => (
                    <span
                        className={`${styles.filterTab} ${filter === f.displayText ? styles.selected : ""}`}
                        key={id}
                        onClick={() => setFilter(filter === f.displayText ? "" : f.displayText)}
                    >
                        {f.icon && f.icon}
                        {f.displayText}
                    </span>
                ))}
            </div>
        </div>
    );
};