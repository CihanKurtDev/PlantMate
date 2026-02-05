import { ArrowDown, ArrowUp, ArrowUpDown } from "lucide-react";
import { isComputedColumn, type TableColumn, type SortConfig } from "../../types/table"
import styles from './TableHeader.module.scss';

interface TableHeaderProps<RowType> {
    headerData: TableColumn<RowType>[];
    sortConfig: SortConfig<RowType>;
    onSort: (keyOrId: keyof RowType | string) => void;
}

const SortIcon = ({ isActive, direction }: { isActive: boolean, direction: 'asc' | 'desc' | null }) => {
    if (!isActive) return <ArrowUpDown size={14} />;
    return direction === 'asc' 
        ? <ArrowUp size={14} /> 
        : <ArrowDown size={14} />;
};

export const TableHeader = <RowType extends { key: string }>({ headerData, sortConfig, onSort }: TableHeaderProps<RowType>) => {
    return (
        <div className={styles.tableHead}>
            <ul>
                {headerData.map((header, index) => {
                    const isSortable = header.sortable !== false;
                    const sortId = isComputedColumn(header) ? header.id : String(header.key);
                    const isActive = Boolean(
                        (sortConfig?.id && sortConfig.id === sortId) || 
                        (sortConfig?.key && String(sortConfig.key) === sortId)
                    );
                    
                    return (
                        <li
                            key={index}
                            className={`
                                ${styles.rowElement}
                                ${isSortable ? styles.sortable : ''}
                                ${isActive ? styles.active : ''}
                            `}
                            onClick={() => isSortable && onSort(sortId)}
                        >
                            {header.displayText}
                            {isSortable && (
                                <SortIcon 
                                    isActive={isActive} 
                                    direction={sortConfig?.direction ?? null} 
                                />
                            )}
                        </li>
                    );
                })}
            </ul>
        </div>
    )
}