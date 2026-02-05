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

export type ComputedTableColumn<T> = {
    id: string;
    displayText: string;
    sortable?: boolean;
    sortBy?: (row: T) => any;
    render: (row: T) => JSX.Element;
};

export function isComputedColumn<T>(col: FlexibleTableColumn<T>): col is ComputedTableColumn<T> {
    return 'id' in col && !('key' in col);
}


export interface TableConfig<RowType> {
    title: string,
    columns: FlexibleTableColumn<RowType>[],
    filters: TableFilter<RowType>[],
    searchKeys: string[],
    filterKey?: keyof RowType;
}

export type FlexibleTableColumn<T> = TableColumn<T> | ComputedTableColumn<T>;