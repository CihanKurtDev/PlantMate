import type { SortDirection, SortConfig } from "@/types/table";

const compareWithNulls = <T>(
  a: T | null | undefined,
  b: T | null | undefined,
  compareFn: (a: T, b: T) => number
): number => {
  if (a == null && b == null) return 0;
  if (a == null) return 1
  if (b == null) return -1;
  return compareFn(a, b);
};

const smartCompare = (a: any, b: any): number => {
    if (typeof a === 'number' && typeof b === 'number') {
        return a - b;
    }
    
    if (typeof a === 'string' && typeof b === 'string') {
        return a.localeCompare(b);
    }
    
    if (Array.isArray(a) && Array.isArray(b)) {
        return a.length - b.length;
    }
    
    if (a?.value !== undefined && b?.value !== undefined) {
        return typeof a.value === 'number' && typeof b.value === 'number'
            ? a.value - b.value
            : String(a.value).localeCompare(String(b.value));
    }
    
    return String(a).localeCompare(String(b));
};

export const createSorter = <T>(key: keyof T) => {
    return (a: T, b: T, direction: SortDirection): number => {
        const result = compareWithNulls(a[key], b[key], smartCompare);
        return direction === 'desc' ? -result : result;
    };
};

export const getNextSortState = <T>( currentKey: keyof T | null, currentDirection: SortDirection | null, clickedKey: keyof T): SortConfig<T> => {
    if (currentKey !== clickedKey) {
        return { key: clickedKey, direction: 'asc' };
    }
    
    if (currentDirection === 'asc') {
        return { key: clickedKey, direction: 'desc' };
    }
    
    return null;
};