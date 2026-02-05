import { TableColumn } from "@/types/table";
import { memo, useMemo } from "react";
import styles from './Table.module.scss';

interface TableRowProps<RowType extends { key: string }> {
  rowData: RowType;
  columns: TableColumn<RowType>[];
  isSelected: boolean;
  onSelect: () => void;
  onClick?: () => void;
  isEditing: boolean;
}

// React kann eine Komponente die Typescript Generics nutzt nicht memoisieren daher muss das geschrieben werden wie folgt.
// Dadurch wird hierdraus eine factoryfunction ich gebe ihr den type und create die dann erst also es ändert sich wann ich
// dieser komponente ihren genereischen typ übergebe.

export const createMemoizedTableRow = <RowType extends { key: string }>() => {
    return memo((props: TableRowProps<RowType>) => {
        const { rowData, columns, isSelected = false, onSelect, onClick, isEditing } = props;

        const rowProps = useMemo(() => ({
            ...rowData,
            isSelected,
            onSelect,
            isEditing,
        }), [rowData, isSelected, onSelect, isEditing]);

        const generatedCellContent = columns.map((column, i) => {
            const cellContent = column.render
                ? column.render(rowData[column.key], rowProps)
                : rowData[column.key];

            return <li className={styles.rowElement} key={i}>{cellContent as React.ReactNode}</li>;
        });

        const handleRowClick = () => {
            if (isEditing) {
                onSelect();
            } else if (onClick) {
                onClick();
            }
        };

        return (
            <ul
                className={`${styles.tableRow} ${isSelected ? styles.tableRowSelected : ''}`}
                onClick={handleRowClick}
            >
                {generatedCellContent}
            </ul>
        );
    });
};