import type { TableColumn } from "../../types/table"
import styles from './TableHeader.module.scss';

interface TableHeaderProps<RowType> {
    headerData: TableColumn<RowType>[]
}

export const TableHeader = <RowType extends { key: string }>({ headerData }: TableHeaderProps<RowType>) => {
    return (
        <div className={styles.tableHead}>
            <ul>
                {headerData.map((header, id) => (
                    <li key={id} className={styles.rowElement}>
                        {header.displayText}
                    </li>
                ))}
            </ul>
        </div>
    )
}