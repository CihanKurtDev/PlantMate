import { useEffect, useRef } from "react";

export function useDemoNavigationLock(
    isRunning: boolean,
    onPrev?: () => void,
    onNext?: () => void,
) {
    const onPrevRef = useRef(onPrev);
    const onNextRef = useRef(onNext);

    useEffect(() => {
        onPrevRef.current = onPrev;
        onNextRef.current = onNext;
    });

    useEffect(() => {
        if (!isRunning) return;

        history.pushState(null, "", window.location.href);

        const handlePopState = () => {
            history.pushState(null, "", window.location.href);
        };

        const handleClick = (e: MouseEvent) => {
            const anchor = (e.target as HTMLElement).closest("a");
            if (!anchor) return;
            if (anchor.closest("[data-demo]")) return;
            if (anchor.target === "_blank") return;
            e.preventDefault();
            e.stopPropagation();
        };

        const handleMouseDown = (e: MouseEvent) => {
            if (e.button === 3) {
                e.preventDefault();
                onPrevRef.current?.();
            } else if (e.button === 4) {
                e.preventDefault();
                onNextRef.current?.();
            }
        };

        window.addEventListener("popstate", handlePopState);
        document.addEventListener("click", handleClick, true);
        document.addEventListener("mousedown", handleMouseDown);

        return () => {
            window.removeEventListener("popstate", handlePopState);
            document.removeEventListener("click", handleClick, true);
            document.removeEventListener("mousedown", handleMouseDown);
        };
    }, [isRunning]);
}