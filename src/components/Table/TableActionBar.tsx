import React, { memo } from "react";
import styles from './TableActionBar.module.scss';
import { Button } from "../Button/Button";

interface TableActionBarProps {
    onSearch: (newSearch: string) => void;
    isEditing: boolean;
    toggleEditMode: () => void;
}

export const TableActionBar: React.FC<TableActionBarProps> = memo(({ onSearch, isEditing, toggleEditMode }) => {
    return (
        <div className={styles.tableActionBar}>
            <div className={styles.leftActions}>
                <Button
                    variant={isEditing ? "error" : "primary"}
                    onClick={toggleEditMode}
                >
                    {isEditing ? "Bearbeitung beenden" : "Bearbeiten"}
                </Button>
                <Button>Export</Button>
                <Button>Neu</Button>
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
