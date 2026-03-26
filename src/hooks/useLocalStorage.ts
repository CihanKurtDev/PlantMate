import { useState, useEffect, useRef, useCallback } from "react";

const DEBOUNCE_MS = 300;

export function useLocalStorageState<T>(key: string, fallback: T): [T, React.Dispatch<React.SetStateAction<T>>] {
    const [state, setState] = useState<T>(() => {
        if (typeof window === "undefined") return fallback;
        try {
            const stored = localStorage.getItem(key);
            return stored ? (JSON.parse(stored) as T) : fallback;
        } catch {
            return fallback;
        }
    });

    const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
    const isMounted = useRef(false);

    useEffect(() => {
        if (!isMounted.current) {
            isMounted.current = true;
            return;
        }

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