import type { JSX } from "react";

export type RenderContext<RowType> = RowType & {
    isSelected: boolean;
    onSelect: () => void;
    isEditing: boolean;
};

export type TableColumn<T> = {
    [K in keyof T]: {
        key: K;
        displayText: string;
        sortable?: boolean;
        sortBy?: (row: T) => any;
        render?: (
            value: T[K],
            row?: RenderContext<T>,
        ) => JSX.Element;
    }
}[keyof T];

export interface TableFilter<RowType> {
    displayText: string,
    icon?: React.ReactElement;
    customSearchFunc?: (row: RowType) => boolean;
}

export type SortDirection = 'asc' | 'desc';

export type SortConfig<T> = {
    key?: keyof T;
    id?: string;
    direction: SortDirection;
} | null;

export interface TableConfig<RowType> {
    title: string,
    columns: TableColumn<RowType>[],
    filters: TableFilter<RowType>[],
    searchKeys: string[],
    filterKey?: keyof RowType;
}