import type { TableConfig } from "../types/table";

export function computeFiltersTabs<RowType extends { key: string }>( data: RowType[], tableConfig: TableConfig<RowType>) { 
    const normalizeString = (value: unknown): string => typeof value === "string" ? value.toLowerCase().trim() : "";  
    const filterKey = tableConfig.filterKey;

    if (!filterKey) {
        return tableConfig.filters.map(filter => ({
            ...filter,
            count: 0,
        }));
    }

    const filterCounts: Record<string, number> = {};
    tableConfig.filters.forEach(filter => {
        filterCounts[filter.displayText] = 0;
    });

    for (const row of data) {
        const rowValue = normalizeString((row as any)[filterKey]);

        for (const filter of tableConfig.filters) {
            const filterText = normalizeString(filter.displayText);

            if (filterText === "alle" || rowValue === filterText) {
                filterCounts[filter.displayText]++;
            }
        }
    }

    return tableConfig.filters.map(filter => ({
        ...filter,
        count: filterCounts[filter.displayText] ?? 0,
    }));
}
