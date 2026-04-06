"use client";

import { DemoSpotlight } from "./DemoSpotlight";
import styles from "./DemoOverlay.module.scss";
import { useDemo } from "@/context/DemoContext";

export function DemoOverlay() {
    const {
        isRunning,
        currentStep,
        stepIndex,
        totalSteps,
        isTransitioning,
        next,
        prev,
        stop,
    } = useDemo();

    if (!isRunning || stepIndex < 0) return null;

    const isLastStep = stepIndex === totalSteps - 1;
    const isFirstStep = stepIndex === 0;

    return (
        <>
            <DemoSpotlight selector={currentStep?.targetSelector} />

            <div
                className={styles.interactionBlocker}
                aria-hidden="true"
                onClick={(e) => e.stopPropagation()}
                onMouseDown={(e) => e.stopPropagation()}
                onPointerDown={(e) => e.stopPropagation()}
                onTouchStart={(e) => e.stopPropagation()}
            />

            <div
                className={styles.card}
                role="dialog"
                aria-modal="true"
                aria-label="Demo-Modus"
            >
                <div className={styles.header}>
                    <span className={styles.counter}>
                        Schritt {stepIndex + 1} / {totalSteps}
                    </span>
                    <span className={styles.badge}>Demo</span>
                </div>

                <div className={styles.progress}>
                    {Array.from({ length: totalSteps }).map((_, i) => (
                        <div
                            key={i}
                            className={`${styles.dot} ${
                                i < stepIndex
                                    ? styles.done
                                    : i === stepIndex
                                    ? styles.active
                                    : ""
                            }`}
                        />
                    ))}
                </div>

                <div aria-live="polite" aria-atomic="true">
                    <h3 className={styles.title}>{currentStep?.title}</h3>
                    <p className={styles.description}>{currentStep?.description}</p>
                </div>

                <div className={styles.actions}>
                    <button
                        className={styles.btnSecondary}
                        onClick={prev}
                        disabled={isTransitioning || isFirstStep}
                    >
                        ← Zurück
                    </button>

                    <button
                        className={styles.btnNext}
                        onClick={isLastStep ? stop : next}
                        disabled={isTransitioning}
                    >
                        {isTransitioning
                            ? "Lädt…"
                            : isLastStep
                            ? "Demo beenden"
                            : "Weiter →"}
                    </button>

                    {!isLastStep && (
                        <button
                            className={styles.btnSecondary}
                            onClick={stop}
                            disabled={isTransitioning}
                        >
                            Beenden
                        </button>
                    )}
                </div>
            </div>
        </>
    );
}