import type { JSX } from "react";

type RenderContext<RowType> = RowType & {
    isSelected: boolean;
    onSelect: () => void;
    isEditing: boolean;
};

export type TableColumn<T> = {
    [K in keyof T]: {
        key: K;
        displayText: string;
        render?: (
            value: T[K],
            row?: RenderContext<T>,
        ) => JSX.Element;
    }
}[keyof T];

export interface TableFilter {
    displayText: string 
}

export interface TableConfig<RowType> {
    title: string,
    columns: TableColumn<RowType>[],
    filters: TableFilter[],
    searchKeys: string[],
    filterKey?: keyof RowType;
}