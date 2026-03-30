import { useState, useEffect, useLayoutEffect, useRef, useCallback } from "react";

const DEBOUNCE_MS = 300;

export function useLocalStorageState<T>(key: string, fallback: T): [T, React.Dispatch<React.SetStateAction<T>>] {
    const [state, setState] = useState<T>(fallback);
    const canPersistRef = useRef(false);

    useLayoutEffect(() => {
        canPersistRef.current = false;
        try {
            const stored = localStorage.getItem(key);
            setState(stored ? (JSON.parse(stored) as T) : fallback);
        } catch {
            setState(fallback);
        }
        canPersistRef.current = true;
    }, [key]);

    const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    useEffect(() => {
        if (!canPersistRef.current) return;

        if (timerRef.current) clearTimeout(timerRef.current);

        timerRef.current = setTimeout(() => {
            try {
                localStorage.setItem(key, JSON.stringify(state));
            } catch {
            }
        }, DEBOUNCE_MS);

        return () => {
            if (timerRef.current) clearTimeout(timerRef.current);
        };
    }, [key, state]);

    const setStateStable = useCallback(setState, [setState]);

    return [state, setStateStable];
}
