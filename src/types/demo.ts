import { ReactNode } from "react";
import { DemoStep } from "../demo/demoScript";

export interface DemoContextType {
    isRunning: boolean;
    stepIndex: number;
    totalSteps: number;
    currentStep: DemoStep | null;
    isTransitioning: boolean;
    start: () => void;
    stop: () => void;
    next: () => void;
    prev: () => void;
}

export interface DemoProviderProps {
    children: ReactNode;
}