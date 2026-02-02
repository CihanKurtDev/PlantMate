import React, { memo } from "react";
import styles from './TableActionBar.module.scss';
import { Button } from "../Button/Button";
import { useRouter } from "next/navigation";

interface TableActionBarProps {
    onSearch: (newSearch: string) => void;
    isEditing: boolean;
    toggleEditMode: () => void;
    deleteSelectedRows: () => void;
    hasSelectedRows: boolean;
    environmentId?: string;
}

export const TableActionBar: React.FC<TableActionBarProps> = memo(({ onSearch, isEditing, toggleEditMode, deleteSelectedRows, hasSelectedRows, environmentId }) => {
    const router = useRouter();
    return (
        <div className={styles.tableActionBar}>
            <div className={styles.leftActions}>
                <Button
                    onClick={toggleEditMode}
                >
                    {isEditing ? "Bearbeitung beenden" : "Bearbeiten"}
                </Button>
                <Button
                    onClick={() => router.push(`/environments/${environmentId}/plants/new`)}
                >
                    Neu
                </Button>
                {hasSelectedRows && isEditing && <Button variant="error" onClick={deleteSelectedRows}>Löschen</Button>}
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
