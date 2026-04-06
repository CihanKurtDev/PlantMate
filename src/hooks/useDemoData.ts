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
}

const STEP_STATES: StepState[] = [
    { route: "dashboard", modal: null, hasEnvironment: false, hasPlant: false },
    { route: "dashboard", modal: "create-environment", hasEnvironment: false, hasPlant: false },
    { route: "environment", modal: null, hasEnvironment: true, hasPlant: false },
    { route: "environment", modal: null, hasEnvironment: true, hasPlant: false },
    { route: "environment", modal: "create-plant", hasEnvironment: true, hasPlant: false },
    { route: "environment", modal: null, hasEnvironment: true, hasPlant: true },
    { route: "environment", modal: null, hasEnvironment: true, hasPlant: true },
    { route: "environment", modal: "add-event", hasEnvironment: true, hasPlant: true },
    { route: "environment", modal: null, hasEnvironment: true, hasPlant: true },
    { route: "environment", modal: null, hasEnvironment: true, hasPlant: true },
    { route: "plant", modal: null, hasEnvironment: true, hasPlant: true  },
    { route: "plant", modal: null, hasEnvironment: true, hasPlant: true  },
    { route: "plant", modal: "add-event", hasEnvironment: true,  hasPlant: true },
    { route: "plant", modal: null, hasEnvironment: true, hasPlant: true },
    { route: "plant", modal: null, hasEnvironment: true, hasPlant: true },
    { route: "plant", modal: "add-event", hasEnvironment: true,  hasPlant: true },
];

const ROUTE_MAP: Record<DemoRouteState, string> = {
    dashboard:   "/dashboard",
    environment: ENV_ROUTE,
    plant:       PLANT_ROUTE,
};

const READY_SELECTOR_MAP: Record<DemoRouteState, string> = {
    dashboard:   '[data-demo="create-btn"]',
    environment: '[data-demo="main-container"]',
    plant:       '[data-demo="main-container"]',
};

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

    const ensureEnvironmentExists = useCallback(async () => {
        if (envCtx.environments?.find((e) => e.id === DEMO_IDS.environmentId)) return;
        envCtx.addEnvironment(DEMO_ENVIRONMENT);
        await waitFor(
            () => !!envCtx.environments?.find((e) => e.id === DEMO_IDS.environmentId),
            800, 20
        );
        await nextFrame();
    }, [envCtx]);

    const ensurePlantExists = useCallback(async () => {
        if (plantCtx.plants?.find((p) => p.id === DEMO_IDS.plantId)) return;
        plantCtx.addPlant(DEMO_PLANT);
        await waitFor(
            () => !!plantCtx.plants?.find((p) => p.id === DEMO_IDS.plantId),
            800, 20
        );
        await nextFrame();
    }, [plantCtx]);

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
        async (modal: DemoModalState) => {
            if (!modal) {
                await ensureModalClosed();
                return;
            }

            if (isModalOpen()) return;

            if (modal === "create-environment") {
                clickElement('[data-demo="create-btn"]');
                await waitForSelector('[data-demo="modal"]', 2000);
                return;
            }

            if (modal === "create-plant") {
                await waitForSelector('[data-demo="add-plant-values-btn"]', 2000);
                clickElement('[data-demo="add-plant-values-btn"]');
                await waitForSelector('[data-demo="modal"]', 2000);
                return;
            }

            if (modal === "add-event") {
                await waitForSelector('[data-demo="add-event-btn"]', 2000);
                clickElement('[data-demo="add-event-btn"]');
                await waitForSelector('[data-demo="modal"]', 2000);
            }
        },
        [clickElement, ensureModalClosed, isModalOpen, waitForSelector]
    );

    const goBackToStep = useCallback(
        async (
            targetIndex: number,
            setIsTransitioning: (value: boolean) => void,
            setStepIndex: (value: number) => void,
            setIsRunning: (value: boolean) => void,
            stepIndexRef: MutableRefObject<number>
        ) => {
            try {
                const state = getStepState(targetIndex);

                await ensureModalClosed();

                // Selektiv löschen was im Zielschritt nicht existieren darf
                if (!state.hasPlant) {
                    plantCtx.deletePlants([DEMO_IDS.plantId]);
                    await waitFor(
                        () => !plantCtx.plants?.find((p) => p.id === DEMO_IDS.plantId),
                        800, 20
                    );
                    await nextFrame();
                }

                if (!state.hasEnvironment) {
                    envCtx.deleteEnvironments([DEMO_IDS.environmentId]);
                    await waitFor(
                        () => !envCtx.environments?.find((e) => e.id === DEMO_IDS.environmentId),
                        800, 20
                    );
                    await nextFrame();
                }

                const href = ROUTE_MAP[state.route];
                const readySelector = READY_SELECTOR_MAP[state.route];
                await ensureRoute(href, readySelector);
                await openModalForState(state.modal);

                stepIndexRef.current = targetIndex;
                setStepIndex(targetIndex);
                setIsRunning(true);
            } finally {
                setIsTransitioning(false);
            }
        },
        [ensureModalClosed, ensureRoute, openModalForState, envCtx, plantCtx]
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