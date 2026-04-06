"use client";

import { useDemo } from "../context/DemoContext";
import { Button } from "@/components/Button/Button"; // dein vorhandener Button

export function DemoButton() {
    const { isRunning, start } = useDemo();
    if (isRunning) return null;

    return (
        <Button variant="secondary" onClick={start}>
            🌱 Demo starten
        </Button>
    );
}