import { useCallback, useEffect, useMemo, useState } from "react";
import type { TableConfig } from "../types/table";

// access deeply nested value via key
function getNestedValue(obj: any, key: string) {
    return key.split('.').reduce((acc, part) => acc && acc[part], obj);
}

export interface TableStateProps {
    page: number;
    limit: number;
    filter: string;
    search: string;
}

interface UseTableProps<RowType> {
    data: RowType[];
    config: TableConfig<RowType>;
    initialLimit?: number;
}

export function useTable<RowType extends { key: string }>({ data, config, initialLimit = 10 }: UseTableProps<RowType>) {
    const [tableState, setTableState] = useState<TableStateProps>({
        page: 1,
        limit: initialLimit,
        filter: "Alle",
        search: "",
    });

    const { filter, search, page, limit } = tableState;
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

    const normalizeString = (value: unknown): string =>
    typeof value === "string" ? value.toLowerCase().trim() : "";

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

    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;
    const paginatedRows = filteredRows.slice(startIndex, endIndex);

    return {
        filter,
        setFilter,
        search,
        setSearch,
        tableState,
        setTableState,
        filteredRows,
        paginatedRows,
    };
}
