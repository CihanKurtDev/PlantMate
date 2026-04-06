"use client";

import {
    createContext,
    useContext,
    useState,
    useCallback,
    useRef,
    useEffect,
} from "react";
import { useRouter, usePathname } from "next/navigation";
import { DEMO_STEPS, DemoActionContext } from "../demo/demoScript";
import { useDemoDom } from "@/hooks/useDemoDom";
import { useDemoData } from "@/hooks/useDemoData";
import { useDemoNavigationLock } from "@/hooks/useDemoNavigationLock";
import { nextFrame, sleep } from "@/demo/demoAsync";
import { DemoContextType, DemoProviderProps } from "@/types/demo";

const DemoContext = createContext<DemoContextType | undefined>(undefined);

export function DemoProvider({ children }: DemoProviderProps) {
    const router = useRouter();
    const pathname = usePathname();

    const [isRunning, setIsRunning] = useState(false);
    const [stepIndex, setStepIndex] = useState(-1);
    const [isTransitioning, setIsTransitioning] = useState(false);

    const stepIndexRef = useRef(-1);
    const isTransitioningRef = useRef(false);

    const setTransitioning = useCallback((val: boolean) => {
        isTransitioningRef.current = val;
        setIsTransitioning(val);
    }, []);

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

    useEffect(() => {
        if (!isRunning) return;

        const previousOverflow = document.body.style.overflow;
        document.body.style.overflow = "hidden";

        return () => {
            document.body.style.overflow = previousOverflow;
        };
    }, [isRunning]);

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
                await cleanupDemoData();
                await ensureRoute("/dashboard", '[data-demo="create-btn"]');
                setIsRunning(false);
                setStepIndex(-1);
                stepIndexRef.current = -1;
                setTransitioning(false);
                return;
            }

            stepIndexRef.current = index;
            setStepIndex(index);

            await nextFrame();

            await executeForwardStep(index);

            setTransitioning(false);
        },
        [cleanupDemoData, ensureRoute, executeForwardStep, setTransitioning]
    );

    const start = useCallback(() => {
        if (isTransitioningRef.current) return;
        isTransitioningRef.current = true;
        setIsTransitioning(true);

        const boot = async () => {
            await cleanupDemoData();
            await ensureRoute("/dashboard", '[data-demo="create-btn"]');
            setIsRunning(true);
            stepIndexRef.current = 0;
            setStepIndex(0);
            setTransitioning(false);
        };
        void boot();
    }, [cleanupDemoData, ensureRoute, setTransitioning]);

    const next = useCallback(() => {
        if (isTransitioningRef.current) return;
        isTransitioningRef.current = true;
        setIsTransitioning(true);
        void runStep(stepIndexRef.current + 1);
    }, [runStep]);

    const prev = useCallback(() => {
        if (isTransitioningRef.current) return;
        const prevIndex = stepIndexRef.current - 1;
        if (prevIndex < 0) return;
        isTransitioningRef.current = true;
        setIsTransitioning(true);
        void goBackToStep(prevIndex, setTransitioning, setStepIndex, setIsRunning, stepIndexRef);
    }, [goBackToStep, setTransitioning]);

    const stop = useCallback(() => {
        if (isTransitioningRef.current) return;
        isTransitioningRef.current = true;
        setIsTransitioning(true);

        const shutdown = async () => {
            await cleanupDemoData();
            await ensureRoute("/dashboard", '[data-demo="create-btn"]');
            setIsRunning(false);
            setStepIndex(-1);
            stepIndexRef.current = -1;
            setTransitioning(false);
        };
        void shutdown();
    }, [cleanupDemoData, ensureRoute, setTransitioning]);

    useDemoNavigationLock(isRunning, prev, next);

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