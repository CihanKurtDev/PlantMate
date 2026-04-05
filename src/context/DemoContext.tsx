"use client";

import {
    createContext,
    useContext,
    useState,
    useCallback,
    useRef,
} from "react";
import { useRouter, usePathname } from "next/navigation";
import { DEMO_STEPS, DemoActionContext } from "../demo/demoScript";
import { useDemoDom } from "@/hooks/useDemoDom";
import { useDemoData } from "@/hooks/useDemoData";
import { sleep } from "@/demo/demoAsync";
import { DemoContextType, DemoProviderProps } from "@/types/demo";

const DemoContext = createContext<DemoContextType | undefined>(undefined);

export function DemoProvider({ children }: DemoProviderProps) {
    const router = useRouter();
    const pathname = usePathname();

    const [isRunning, setIsRunning] = useState(false);
    const [stepIndex, setStepIndex] = useState(-1);
    const [isTransitioning, setIsTransitioning] = useState(false);

    const stepIndexRef = useRef(-1);

    const {
        clickElement,
        waitForSelector,
        typeIntoField,
        closeTopModal,
        isModalOpen,
        ensureModalClosed,
    } = useDemoDom();

    const {
        envCtx,
        plantCtx,
        ensureRoute,
        cleanupDemoData,
        goBackToStep,
    } = useDemoData({
        router,
        pathname,
        waitForSelector,
        clickElement,
        isModalOpen,
        ensureModalClosed,
    });

    const ctxRef = useRef<DemoActionContext>({} as DemoActionContext);

    ctxRef.current = {
        router,
        addEnvironment: envCtx.addEnvironment,
        deleteEnvironments: envCtx.deleteEnvironments,
        addHistoryData: envCtx.addHistoryData,
        addEventToEnvironment: envCtx.addEventToEnvironment,
        addPlant: plantCtx.addPlant,
        deletePlants: plantCtx.deletePlants,
        addPlantHistoryData: plantCtx.addPlantHistoryData,
        addEventToPlant: plantCtx.addEventToPlant,
        clickElement,
        closeTopModal,
        waitForSelector,
        typeIntoField,
    };

    const executeForwardStep = useCallback(
        async (index: number) => {
            const step = DEMO_STEPS[index];

            try {
                await step.action?.(ctxRef.current);
            } catch (err) {
                console.error(`Demo step ${index} failed:`, err);
            }

            if (step.targetSelector) {
                await waitForSelector(step.targetSelector, 1200);
            }

            await sleep(step.navigationDelay ?? 40);
        },
        [waitForSelector]
    );

    const runStep = useCallback(
        async (index: number) => {
            if (index >= DEMO_STEPS.length) {
                setIsTransitioning(true);
                await cleanupDemoData();
                await ensureRoute("/dashboard", '[data-demo="create-btn"]');
                setIsRunning(false);
                setStepIndex(-1);
                stepIndexRef.current = -1;
                setIsTransitioning(false);
                return;
            }

            setIsTransitioning(true);

            const step = DEMO_STEPS[index];

            if (step.highlightAfterAction) {
                await executeForwardStep(index);
                stepIndexRef.current = index;
                setStepIndex(index);
            } else {
                stepIndexRef.current = index;
                setStepIndex(index);
                await executeForwardStep(index);
            }

            setIsTransitioning(false);
        },
        [cleanupDemoData, ensureRoute, executeForwardStep]
    );

    const start = useCallback(() => {
        const boot = async () => {
            setIsTransitioning(true);
            await cleanupDemoData();
            await ensureRoute("/dashboard", '[data-demo="create-btn"]');
            setIsRunning(true);
            stepIndexRef.current = 0;
            setStepIndex(0);
            setIsTransitioning(false);
        };
        void boot();
    }, [cleanupDemoData, ensureRoute]);

    const next = useCallback(() => {
        if (isTransitioning) return;
        void runStep(stepIndexRef.current + 1);
    }, [isTransitioning, runStep]);

    const prev = useCallback(() => {
        if (isTransitioning) return;
        const prevIndex = stepIndexRef.current - 1;
        if (prevIndex < 0) return;
        void goBackToStep(prevIndex, setIsTransitioning, setStepIndex, setIsRunning, stepIndexRef);
    }, [goBackToStep, isTransitioning]);

    const stop = useCallback(() => {
        const shutdown = async () => {
            setIsTransitioning(true);
            await cleanupDemoData();
            await ensureRoute("/dashboard", '[data-demo="create-btn"]');
            setIsRunning(false);
            setStepIndex(-1);
            stepIndexRef.current = -1;
            setIsTransitioning(false);
        };
        void shutdown();
    }, [cleanupDemoData, ensureRoute]);

    return (
        <DemoContext.Provider
            value={{
                isRunning,
                stepIndex,
                totalSteps: DEMO_STEPS.length,
                currentStep: stepIndex >= 0 ? DEMO_STEPS[stepIndex] : null,
                isTransitioning,
                start,
                stop,
                next,
                prev,
            }}
        >
            {children}
        </DemoContext.Provider>
    );
}

export function useDemo() {
    const ctx = useContext(DemoContext);
    if (!ctx) throw new Error("useDemo must be used within DemoProvider");
    return ctx;
}