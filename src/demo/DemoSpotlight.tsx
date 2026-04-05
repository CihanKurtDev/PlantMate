"use client";

import { useLayoutEffect, useState, useRef } from "react";

interface SpotlightRect {
    top: number;
    left: number;
    width: number;
    height: number;
}

interface DemoSpotlightProps {
    selector?: string;
    padding?: number;
}

export function DemoSpotlight({ selector, padding = 12 }: DemoSpotlightProps) {
    const [rect, setRect] = useState<SpotlightRect | null>(null);
    const hasInitialRect = useRef(false);

    useLayoutEffect(() => {
        if (!selector) {
            setRect(null);
            hasInitialRect.current = false;
            return;
        }

        const measure = () => {
            const el = document.querySelector(selector);
            if (!el) {
                setRect(null);
                return;
            }
            const r = el.getBoundingClientRect();
            hasInitialRect.current = true;
            setRect({
                top: r.top,
                left: r.left,
                width: r.width,
                height: r.height,
            });
        };

        measure();
        window.addEventListener("resize", measure);
        window.addEventListener("scroll", measure, { passive: true });

        return () => {
            window.removeEventListener("resize", measure);
            window.removeEventListener("scroll", measure);
        };
    }, [selector]);

    if (!rect) return null;

    return (
        <div
            aria-hidden
            style={{
                position: "fixed",
                top: rect.top - padding,
                left: rect.left - padding,
                width: rect.width + padding * 2,
                height: rect.height + padding * 2,
                borderRadius: 12,
                boxShadow: "0 0 0 9999px rgba(0, 0, 0, 0.50)",
                border: "2px solid rgba(110, 190, 130, 0.85)",
                pointerEvents: "none",
                zIndex: 9998,
                transition: hasInitialRect.current
                    ? "top 0.35s ease, left 0.35s ease, width 0.35s ease, height 0.35s ease"
                    : "none",
            }}
        />
    );
}