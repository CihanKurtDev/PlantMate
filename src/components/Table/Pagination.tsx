import type { Dispatch, SetStateAction } from "react";
import type { TableStateProps } from "../../hooks/useTable";
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from "lucide-react";
import styles from './Pagination.module.scss';

interface PaginationProps<RowType> {
    rows: RowType[],
    tableState: TableStateProps,
    setTableState: Dispatch<SetStateAction<TableStateProps>>
}

export const Pagination = <RowType extends { key: string }>({ rows, tableState, setTableState }: PaginationProps<RowType>) => {
    const { limit = 10, page = 1 } = tableState || {};
    const total = rows.length;
    const STEP = 10;

    const limitOptions = [];
    const pageCount = Math.ceil(total / limit);
    const pages = Array.from({ length: pageCount }, (_, i) => i + 1);

    for (let i = STEP; i < total; i += STEP) {
        limitOptions.push(i);
    }

    if (total > 0) {
        limitOptions.push(total);
    } else {
        limitOptions.push(STEP);
    }

    const handleLimitChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const newLimit = Number(e.target.value);
        setTableState({
            ...tableState,
            page: 1,
            limit: newLimit,
        });
    };

    return (
        <div className={styles.paginationBarWrapper}>
            <div className={styles.dropdownWrapper}>
                <select
                    id="page-limiter"
                    className={styles.dropdown}
                    value={limit}
                    onChange={handleLimitChange}
                >
                    {limitOptions.map((opt) => (
                        <option key={opt} value={opt}>
                            {opt}
                        </option>
                    ))}
                </select>
                <label htmlFor="page-limiter">pro Seite</label>
            </div>
            <div className={styles.paginationWrapper}>
                <div className={styles.paginationIcons}>
                    <ChevronsLeft
                        className={styles.paginationIcon}
                        onClick={() =>
                            setTableState({ ...tableState, page: Math.max(1, page - 1) })
                        }
                    />
                    <ChevronLeft
                        className={styles.paginationIcon} 
                        onClick={() => setTableState({ ...tableState, page: 1 })}
                    />
                </div>
                <ul className={styles.pagination}>
                    {pages.map((pageNumber) => (
                        <li
                            key={pageNumber}
                            className={`${styles.paginationItem} ${page === pageNumber ? styles.active : ""
                                }`}
                            onClick={() => setTableState({ ...tableState, page: pageNumber })}
                        >
                            {pageNumber}
                        </li>
                    ))}
                </ul>
                <div className={styles.paginationIcons}>
                    <ChevronRight
                        className={styles.paginationIcon}
                        onClick={() => setTableState({ ...tableState, page: pageCount })}
                    />
                    <ChevronsRight
                        className={styles.paginationIcon}
                        onClick={() =>
                            setTableState({
                                ...tableState,
                                page: Math.min(pageCount, page + 1),
                            })
                        }
                    />
                </div>
            </div>
        </div>
    );
};
