import { memo } from "react";
import { Button } from "../Button/Button";
import styles from './TableFilterBar.module.scss';

interface TableFilterBarProps {
    filters: { displayText: string, count: number }[];
    filter: string;
    setFilter: (value: string) => void;
    toggleEditMode: () => void
}

export const TableFilterBar: React.FC<TableFilterBarProps> = memo(({ filters, filter, setFilter, toggleEditMode: toggleEditMode }) => {
    const filterTabs = filters.map((filterItem, id) => {
        return (
            <span
                className={`${styles.filterTab} ${filter === filterItem.displayText ? styles.selected : ""}`}
                key={id}
                onClick={() => setFilter(filterItem.displayText)}
            >
                {filterItem.displayText}
                <div>{filterItem.count}</div>
            </span>
        )
    })

    return (
        <div className={styles.tableFilterBar}>
            <div className={styles.tableFilters}>
                {filterTabs}
            </div>
            <Button className={styles.editTableButton} onClick={toggleEditMode}>Bearbeiten</Button>
        </div>
    )
})