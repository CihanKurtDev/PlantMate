import type { TableConfig } from "../types/table";

export function computeFiltersTabs<RowType extends { key: string }>( data: RowType[], tableConfig: TableConfig<RowType>) { 
    const normalizeString = (value: unknown): string => typeof value === "string" ? value.toLowerCase().trim() : "";

    const filterCounts: Record<string, number> = {};

    tableConfig.filters.forEach(filter => {
        filterCounts[filter.displayText] = 0;
    });

    for (const row of data) {
        for (const filter of tableConfig.filters) {

            const matches =
                filter.displayText.toLowerCase() === "alle" ||
                (
                    filter.customSearchFunc
                        ? filter.customSearchFunc(row)
                        : (
                            tableConfig.filterKey &&
                            normalizeString((row as any)[tableConfig.filterKey]) ===
                            normalizeString(filter.displayText)
                        )
                );

            if (matches) {
                filterCounts[filter.displayText]++;
            }
        }
    }

    return tableConfig.filters.map(filter => ({
        ...filter,
        count: filterCounts[filter.displayText] ?? 0,
    }));
}
