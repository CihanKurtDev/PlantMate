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
import { useAuth } from "@/context/AuthContext";

const DemoContext = createContext<DemoContextType | undefined>(undefined);

export function DemoProvider({ children }: DemoProviderProps) {
    const router = useRouter();
    const pathname = usePathname();
    const { isAuthenticated, isDemoSession, status, startDemoSession, endDemoSession } = useAuth();

    const [isRunning, setIsRunning] = useState(false);
    const [stepIndex, setStepIndex] = useState(-1);
    const [isTransitioning, setIsTransitioning] = useState(false);

    const stepIndexRef = useRef(-1);
    const isTransitioningRef = useRef(false);

    const setTransitioning = useCallback((val: boolean) => {
        isTransitioningRef.current = val;
        setIsTransitioning(val);
    }, []);

    const resetDemoState = useCallback(() => {
        setIsRunning(false);
        setStepIndex(-1);
        stepIndexRef.current = -1;
        setTransitioning(false);
    }, [setTransitioning]);

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

    const routeAfterDemo = useCallback(async () => {
        if (isDemoSession) {
            endDemoSession();
            await nextFrame();
            await ensureRoute("/", '[data-demo="main-container"]');
            return;
        }
        if (isAuthenticated) {
            await ensureRoute("/dashboard", '[data-demo="create-btn"]');
            return;
        }
        await ensureRoute("/", '[data-demo="main-container"]');
    }, [endDemoSession, ensureRoute, isAuthenticated, isDemoSession]);

    const ctxRef = useRef<DemoActionContext>({} as DemoActionContext);

    useEffect(() => {
        if (!isRunning) return;

        const previousOverflow = document.body.style.overflow;
        document.body.style.overflow = "hidden";

        return () => {
            document.body.style.overflow = previousOverflow;
        };
    }, [isRunning]);

    useEffect(() => {
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
    }, [
        clickElement,
        closeTopModal,
        envCtx.addEnvironment,
        envCtx.addEventToEnvironment,
        envCtx.addHistoryData,
        envCtx.deleteEnvironments,
        plantCtx.addEventToPlant,
        plantCtx.addPlant,
        plantCtx.addPlantHistoryData,
        plantCtx.deletePlants,
        router,
        typeIntoField,
        waitForSelector,
    ]);

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
                await routeAfterDemo();
                resetDemoState();
                return;
            }

            stepIndexRef.current = index;
            setStepIndex(index);

            await nextFrame();

            await executeForwardStep(index);

            setTransitioning(false);
        },
        [cleanupDemoData, executeForwardStep, resetDemoState, routeAfterDemo, setTransitioning]
    );

    const start = useCallback(() => {
        if (isTransitioningRef.current) return;
        isTransitioningRef.current = true;
        setIsTransitioning(true);
        // Activate demo mode immediately so auth guards do not interrupt route transitions.
        setIsRunning(true);

        const boot = async () => {
            if (status === "loading") {
                resetDemoState();
                return;
            }
            if (!isAuthenticated) {
                startDemoSession();
            }
            await nextFrame();
            await cleanupDemoData();
            const routeReady = await ensureRoute("/dashboard", '[data-demo="create-btn"]');
            if (!routeReady) {
                resetDemoState();
                return;
            }
            setIsRunning(true);
            stepIndexRef.current = 0;
            setStepIndex(0);
            setTransitioning(false);
        };
        void boot();
    }, [cleanupDemoData, ensureRoute, isAuthenticated, resetDemoState, setTransitioning, startDemoSession, status]);

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
            await routeAfterDemo();
            resetDemoState();
        };
        void shutdown();
    }, [cleanupDemoData, resetDemoState, routeAfterDemo]);

    useEffect(() => {
        if (!isRunning) return;
        if (status === "loading") return;

        const onAuthPage = pathname === "/login" || pathname === "/register";
        if (onAuthPage) {
            const cleanup = async () => {
                await cleanupDemoData();
                await routeAfterDemo();
                resetDemoState();
            };
            void cleanup();
        }
    }, [cleanupDemoData, isRunning, pathname, resetDemoState, routeAfterDemo, status]);

    useEffect(() => {
        if (!isRunning) return;
        if (!isDemoSession) return;

        const handleBeforeUnload = () => {
            endDemoSession();
        };

        window.addEventListener("beforeunload", handleBeforeUnload);
        return () => window.removeEventListener("beforeunload", handleBeforeUnload);
    }, [endDemoSession, isDemoSession, isRunning]);

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