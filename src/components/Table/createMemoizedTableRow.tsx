import { TableColumn } from "@/types/table";
import { memo, useMemo } from "react";
import styles from './Table.module.scss';
import { useRouter } from "next/navigation";

interface TableRowProps<RowType extends { key: string }> {
  rowData: RowType;
  columns: TableColumn<RowType>[];
  isSelected: boolean;
  onSelect: () => void;
  isEditing: boolean;
}

// React kann eine Komponente die Typescript Generics nutzt nicht memoisieren daher muss das geschrieben werden wie folgt.
// Dadurch wird hierdraus eine factoryfunction ich gebe ihr den type und create die dann erst also es ändert sich wann ich
// dieser komponente ihren genereischen typ übergebe.

export const createMemoizedTableRow = <RowType extends { key: string }>() => {
    return memo((props: TableRowProps<RowType>) => {
        const { rowData, columns, isSelected = false, onSelect, isEditing } = props;
        const router = useRouter();

        const rowProps = useMemo(() => ({
            ...rowData,
            isSelected,
            onSelect,
            isEditing,
        }), [rowData, isSelected, onSelect, isEditing])

        const generatedCellContent = columns.map((column, i) => {
            const value = rowData[column.key];
            const cellContent = column.render
                ? column.render(value, rowProps)
                : value;

                return <li className={styles.rowElement} key={i}>{cellContent as React.ReactNode}</li>;
        });

        const handleRowClick = () => {
            if (isEditing) {
                onSelect(); // Mehrfachauswahl im Edit-Modus
            } else if ("id" in rowData) {
                // Generischer Link: Environment + Plant wenn vorhanden, sonst nur Environment
                const link = "environmentId" in rowData && rowData.environmentId
                    ? `/environments/${rowData.environmentId}/plants/${rowData.id}`
                    : `/environments/${rowData.id}`;
                router.push(link);
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
