import { useCallback, type MutableRefObject } from "react";
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";
import { usePlant } from "@/context/PlantContext";
import { useEnvironment } from "@/context/EnvironmentContext";
import {
    DEMO_IDS,
    DEMO_ENVIRONMENT,
    DEMO_PLANT,
    DEMO_CLIMATE_ENTRIES,
    DEMO_ENVIRONMENT_EVENT,
    DEMO_WATER_ENTRIES,
    DEMO_PLANT_EVENT,
} from "../demo/demoData";
import { ENV_ROUTE, PLANT_ROUTE } from "../demo/demoRoutes";
import { nextFrame, waitFor } from "../demo/demoAsync";

interface UseDemoDataParams {
    router: AppRouterInstance;
    pathname: string;
    waitForSelector: (selector: string, timeout?: number) => Promise<HTMLElement | null>;
    clickElement: (selector: string) => void;
    isModalOpen: () => boolean;
    ensureModalClosed: () => Promise<void>;
}

type DemoRouteState = "dashboard" | "environment" | "plant";
type DemoModalState = "create-environment" | "create-plant" | "add-event" | null;

interface StepState {
    route: DemoRouteState;
    modal: DemoModalState;
    hasEnvironment: boolean;
    hasPlant: boolean;
    hasEnvironmentClimate: boolean;
    hasEnvironmentEvent: boolean;
    hasPlantWater: boolean;
    hasPlantEvent: boolean;
}

const STEP_STATES: StepState[] = [
    { route: "dashboard", modal: null, hasEnvironment: false, hasPlant: false, hasEnvironmentClimate: false, hasEnvironmentEvent: false, hasPlantWater: false, hasPlantEvent: false },
    { route: "dashboard", modal: "create-environment", hasEnvironment: false, hasPlant: false, hasEnvironmentClimate: false, hasEnvironmentEvent: false, hasPlantWater: false, hasPlantEvent: false },
    { route: "environment", modal: null, hasEnvironment: true, hasPlant: false, hasEnvironmentClimate: false, hasEnvironmentEvent: false, hasPlantWater: false, hasPlantEvent: false },
    { route: "environment", modal: null, hasEnvironment: true, hasPlant: false, hasEnvironmentClimate: false, hasEnvironmentEvent: false, hasPlantWater: false, hasPlantEvent: false },
    { route: "environment", modal: "create-plant", hasEnvironment: true, hasPlant: false, hasEnvironmentClimate: false, hasEnvironmentEvent: false, hasPlantWater: false, hasPlantEvent: false },
    { route: "environment", modal: null, hasEnvironment: true, hasPlant: true, hasEnvironmentClimate: false, hasEnvironmentEvent: false, hasPlantWater: false, hasPlantEvent: false },
    { route: "environment", modal: null, hasEnvironment: true, hasPlant: true, hasEnvironmentClimate: false, hasEnvironmentEvent: false, hasPlantWater: false, hasPlantEvent: false },
    { route: "environment", modal: "add-event", hasEnvironment: true, hasPlant: true, hasEnvironmentClimate: false, hasEnvironmentEvent: false, hasPlantWater: false, hasPlantEvent: false },
    { route: "environment", modal: null, hasEnvironment: true, hasPlant: true, hasEnvironmentClimate: true, hasEnvironmentEvent: false, hasPlantWater: false, hasPlantEvent: false },
    { route: "environment", modal: null, hasEnvironment: true, hasPlant: true, hasEnvironmentClimate: true, hasEnvironmentEvent: true, hasPlantWater: false, hasPlantEvent: false },
    { route: "plant", modal: null, hasEnvironment: true, hasPlant: true, hasEnvironmentClimate: true, hasEnvironmentEvent: true, hasPlantWater: false, hasPlantEvent: false },
    { route: "plant", modal: null, hasEnvironment: true, hasPlant: true, hasEnvironmentClimate: true, hasEnvironmentEvent: true, hasPlantWater: false, hasPlantEvent: false },
    { route: "plant", modal: "add-event", hasEnvironment: true, hasPlant: true, hasEnvironmentClimate: true, hasEnvironmentEvent: true, hasPlantWater: false, hasPlantEvent: false },
    { route: "plant", modal: null, hasEnvironment: true, hasPlant: true, hasEnvironmentClimate: true, hasEnvironmentEvent: true, hasPlantWater: true, hasPlantEvent: false },
    { route: "plant", modal: null, hasEnvironment: true, hasPlant: true, hasEnvironmentClimate: true, hasEnvironmentEvent: true, hasPlantWater: true, hasPlantEvent: true },
    { route: "plant", modal: null, hasEnvironment: true, hasPlant: true, hasEnvironmentClimate: true, hasEnvironmentEvent: true, hasPlantWater: true, hasPlantEvent: true },
];

const getStepState = (step: number): StepState =>
    STEP_STATES[step] ?? STEP_STATES[0];

export function useDemoData({
    router,
    pathname,
    waitForSelector,
    clickElement,
    isModalOpen,
    ensureModalClosed,
}: UseDemoDataParams) {
    const envCtx = useEnvironment();
    const plantCtx = usePlant();

    const ensureRoute = useCallback(
        async (href: string, readySelector?: string) => {
            if (window.location.pathname !== href) {
                router.push(href);
            }

            await waitFor(() => window.location.pathname === href, 1200, 20);

            if (readySelector) {
                await waitForSelector(readySelector, 1200);
            }

            await nextFrame();
        },
        [router, waitForSelector]
    );

    const hasEnvironment = useCallback(() => {
        return !!envCtx.environments?.find((env) => env.id === DEMO_IDS.environmentId);
    }, [envCtx.environments]);

    const hasPlant = useCallback(() => {
        return !!plantCtx.plants?.find((plant) => plant.id === DEMO_IDS.plantId);
    }, [plantCtx.plants]);

    const ensureEnvironmentExists = useCallback(async () => {
        if (hasEnvironment()) return;

        envCtx.addEnvironment(DEMO_ENVIRONMENT);
        await waitFor(
            () => !!envCtx.environments?.find((env) => env.id === DEMO_IDS.environmentId),
            800,
            20
        );
        await nextFrame();
    }, [envCtx, hasEnvironment]);

    const ensurePlantExists = useCallback(async () => {
        if (hasPlant()) return;

        plantCtx.addPlant(DEMO_PLANT);
        await waitFor(
            () => !!plantCtx.plants?.find((plant) => plant.id === DEMO_IDS.plantId),
            800,
            20
        );
        await nextFrame();
    }, [hasPlant, plantCtx]);

    const seedEnvironmentClimate = useCallback(async () => {
        DEMO_CLIMATE_ENTRIES.forEach((entry) => {
            envCtx.addHistoryData(DEMO_IDS.environmentId, entry);
        });
        await nextFrame();
    }, [envCtx]);

    const seedEnvironmentEvent = useCallback(async () => {
        envCtx.addEventToEnvironment(DEMO_IDS.environmentId, DEMO_ENVIRONMENT_EVENT);
        await nextFrame();
    }, [envCtx]);

    const seedPlantWater = useCallback(async () => {
        DEMO_WATER_ENTRIES.forEach((entry) => {
            plantCtx.addPlantHistoryData(DEMO_IDS.plantId, entry);
        });
        await nextFrame();
    }, [plantCtx]);

    const seedPlantEvent = useCallback(async () => {
        plantCtx.addEventToPlant(DEMO_IDS.plantId, DEMO_PLANT_EVENT);
        await nextFrame();
    }, [plantCtx]);

    const cleanupDemoData = useCallback(async () => {
        await ensureModalClosed();
        plantCtx.deletePlants([DEMO_IDS.plantId]);
        envCtx.deleteEnvironments([DEMO_IDS.environmentId]);
        await nextFrame();
    }, [ensureModalClosed, envCtx, plantCtx]);

    const openModalForState = useCallback(
        async (modal: DemoModalState, route: DemoRouteState) => {
            if (!modal) {
                await ensureModalClosed();
                return;
            }

            if (isModalOpen()) return;

            if (modal === "create-environment") {
                await ensureRoute("/dashboard", '[data-demo="create-btn"]');
                clickElement('[data-demo="create-btn"]');
                await waitForSelector('[data-demo="modal"]');
                return;
            }

            if (modal === "create-plant") {
                if (route === "environment") {
                    await waitForSelector('[data-demo="add-plant-values-btn"]');
                    clickElement('[data-demo="add-plant-values-btn"]');
                    await waitForSelector('[data-demo="modal"]');
                }
                return;
            }

            if (modal === "add-event") {
                await waitForSelector('[data-demo="add-event-btn"]');
                clickElement('[data-demo="add-event-btn"]');
                await waitForSelector('[data-demo="modal"]');
            }
        },
        [clickElement, ensureModalClosed, ensureRoute, isModalOpen, waitForSelector]
    );

    const buildStepState = useCallback(
        async (targetIndex: number) => {
            const state = getStepState(targetIndex);

            await cleanupDemoData();

            if (state.route === "dashboard") {
                await ensureRoute("/dashboard", '[data-demo="create-btn"]');
                await openModalForState(state.modal, state.route);
                return;
            }

            if (state.hasEnvironment) {
                envCtx.addEnvironment(DEMO_ENVIRONMENT);
                await waitFor(
                    () => !!envCtx.environments?.find((e) => e.id === DEMO_IDS.environmentId),
                    800,
                    20
                );
            }

            if (state.route === "environment") {
                await ensureRoute(ENV_ROUTE, '[data-demo="page-header"]');
            }

            if (state.hasPlant) {
                plantCtx.addPlant(DEMO_PLANT);
                await waitFor(
                    () => !!plantCtx.plants?.find((p) => p.id === DEMO_IDS.plantId),
                    800,
                    20
                );
            }

            if (state.hasEnvironmentClimate) await seedEnvironmentClimate();
            if (state.hasEnvironmentEvent) await seedEnvironmentEvent();

            if (state.route === "plant") {
                await ensureRoute(PLANT_ROUTE, '[data-demo="page-header"]');
            }

            if (state.hasPlantWater) await seedPlantWater();
            if (state.hasPlantEvent) await seedPlantEvent();

            await openModalForState(state.modal, state.route);
        },
        [
            cleanupDemoData,
            ensureRoute,
            openModalForState,
            envCtx,
            plantCtx,
            seedEnvironmentClimate,
            seedEnvironmentEvent,
            seedPlantEvent,
            seedPlantWater,
        ]
    );

    const goBackToStep = useCallback(
        async (
            targetIndex: number,
            setIsTransitioning: (value: boolean) => void,
            setStepIndex: (value: number) => void,
            setIsRunning: (value: boolean) => void,
            stepIndexRef: MutableRefObject<number>
        ) => {
            setIsTransitioning(true);

            try {
                await buildStepState(targetIndex);
                stepIndexRef.current = targetIndex;
                setStepIndex(targetIndex);
                setIsRunning(true);
            } finally {
                setIsTransitioning(false);
            }
        },
        [buildStepState]
    );

    return {
        envCtx,
        plantCtx,
        pathname,
        ensureRoute,
        ensureEnvironmentExists,
        ensurePlantExists,
        seedEnvironmentClimate,
        seedEnvironmentEvent,
        seedPlantWater,
        seedPlantEvent,
        cleanupDemoData,
        goBackToStep,
    };
}