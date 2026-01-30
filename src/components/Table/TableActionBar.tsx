import React, { memo } from "react";
import styles from './TableActionBar.module.scss';

interface TableActionBarProps {
    onSearch: (newSearch: string) => void
}

export const TableActionBar: React.FC<TableActionBarProps> = memo(({ onSearch }) => {
    return (
        <div className={styles.tableActionBar}>
            <div className={styles.leftActions}>
                <button className={styles.tableButton}>Export</button>
                <button className={styles.tableButton}>Neu</button>
            </div>
            <div className={styles.rightActions}>
                <div className={styles.searchInputWrapper}>
                    <input
                        type="text"
                        placeholder="Suchen..."
                        className={styles.searchInput}
                        onChange={(e) => onSearch(e.target.value)}
                    />
                </div>
            </div>
        </div>
    );
});
