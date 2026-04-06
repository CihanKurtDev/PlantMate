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

        let cancelled = false;
        let rafId: number | null = null;
        let observer: MutationObserver | null = null;

        const measure = () => {
            if (cancelled) return false;

            const el = document.querySelector(selector) as HTMLElement | null;
            if (!el) return false;

            const r = el.getBoundingClientRect();

            if (r.width === 0 && r.height === 0) return false;

            hasInitialRect.current = true;
            setRect({
                top: r.top,
                left: r.left,
                width: r.width,
                height: r.height,
            });

            return true;
        };

        const scrollAndMeasure = () => {
            const el = document.querySelector(selector) as HTMLElement | null;
            if (!el) return false;

            el.scrollIntoView({
                behavior: "smooth",
                block: "center",
                inline: "nearest",
            });

            return measure();
        };

        const scheduleRetry = () => {
            if (cancelled) return;

            const found = scrollAndMeasure();
            if (found) return;

            rafId = window.requestAnimationFrame(scheduleRetry);
        };

        const handleViewportChange = () => {
            measure();
        };

        scheduleRetry();

        observer = new MutationObserver(() => {
            measure();
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true,
            attributes: true,
        });

        window.addEventListener("resize", handleViewportChange);
        window.addEventListener("scroll", handleViewportChange, { passive: true });

        return () => {
            cancelled = true;

            if (rafId !== null) {
                window.cancelAnimationFrame(rafId);
            }

            observer?.disconnect();
            window.removeEventListener("resize", handleViewportChange);
            window.removeEventListener("scroll", handleViewportChange);
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