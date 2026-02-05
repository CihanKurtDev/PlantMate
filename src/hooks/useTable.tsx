import { useCallback, useEffect, useMemo, useState } from "react";
import { type SortConfig, type TableConfig } from "../types/table";
import { createSorter, getNextSortState } from "@/helpers/sortUtils";

function getNestedValue(obj: any, key: string) {
    return key.split('.').reduce((acc, part) => acc && acc[part], obj);
}

const normalizeString = (value: unknown): string =>
    typeof value === "string" ? value.toLowerCase().trim() : "";

export interface TableStateProps<T> {
    page: number;
    limit: number;
    filter: string;
    search: string;
    sortConfig: SortConfig<T>
}

interface UseTableProps<RowType> {
    data: RowType[];
    config: TableConfig<RowType>;
    initialLimit?: number;
}

export function useTable<RowType extends { key: string }>({ 
    data, 
    config, 
    initialLimit = 10 
}: UseTableProps<RowType>) {
    const [tableState, setTableState] = useState<TableStateProps<RowType>>({
        page: 1,
        limit: initialLimit,
        filter: "Alle",
        search: "",
        sortConfig: null
    });

    const { filter, search, page, limit, sortConfig } = tableState;
    const searchTerm = search.toLowerCase();

    useEffect(() => {
        setTableState(prev => ({ ...prev, page: 1 }));
    }, [filter, search]);

    const setFilter = useCallback((newFilter: string) => {
        setTableState(prev => ({ ...prev, filter: newFilter }));
    }, []);

    const setSearch = useCallback((newSearch: string) => {
        setTableState(prev => ({ ...prev, search: newSearch }));
    }, []);

    const handleSort = useCallback((key: keyof RowType) => {
        setTableState(prev => ({
            ...prev,
            sortConfig: getNextSortState(
                prev.sortConfig?.key ?? null,
                prev.sortConfig?.direction ?? null,
                key
            )
        }));
    }, []);

    const filteredRows = useMemo(() => {
        const activeFilter = config.filters.find(f => f.displayText === filter);

        return data.filter(row => {
            const matchesFilter =
                !activeFilter ||
                filter === "Alle" ||
                (
                    activeFilter.customSearchFunc
                        ? activeFilter.customSearchFunc(row)
                        : (
                            config.filterKey &&
                            normalizeString(
                                getNestedValue(row, config.filterKey as string)
                            ) === normalizeString(filter)
                        )
                );

            const matchesSearch =
                searchTerm === "" ||
                config.searchKeys.some(key => {
                    const val = getNestedValue(row, key);
                    return val &&
                        val.toString().toLowerCase().includes(searchTerm);
                });

            return matchesFilter && matchesSearch;
        });
    }, [data, filter, searchTerm, config]);

    const sortedRows = useMemo(() => {
        if (!sortConfig || !sortConfig.key) return filteredRows;

        const column = config.columns.find(col => col.key === sortConfig.key);
        if (!column) return filteredRows;

        function compareValues(a: any, b: any): number {
            if (a == null && b == null) return 0;
            if (a == null) return 1;
            if (b == null) return -1;
            if (a < b) return -1;
            if (a > b) return 1;
            return 0;
        }

        const compareRows = (rowA: any, rowB: any) => {
            if (column.sortBy) {
                const valueA = column.sortBy(rowA);
                const valueB = column.sortBy(rowB);
                const result = compareValues(valueA, valueB);
                return sortConfig.direction === 'desc' ? -result : result;
            }

            const sortFn = createSorter(column.key);
            return sortFn(rowA, rowB, sortConfig.direction);
        };

        return [...filteredRows].sort(compareRows);
    }, [filteredRows, sortConfig, config.columns]);

    const paginatedRows = useMemo(() => {
        const startIndex = (page - 1) * limit;
        return sortedRows.slice(startIndex, startIndex + limit);
    }, [sortedRows, page, limit]);

    return {
        filter,
        setFilter,
        search,
        setSearch,
        tableState,
        setTableState,
        filteredRows,
        paginatedRows,
        sortedRows,
        handleSort
    };
}