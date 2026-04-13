"use client";

import { useDemo } from "../context/DemoContext";
import { Button } from "@/components/Button/Button"; // dein vorhandener Button
import { useAuth } from "@/context/AuthContext";

export function DemoButton() {
    const { isRunning, start } = useDemo();
    const { status } = useAuth();
    if (isRunning) return null;
    if (status === "loading") return null;

    return (
        <Button
            variant="secondary"
            size="sm"
            onClick={start}
        >
            Demo starten
        </Button>
    );
}