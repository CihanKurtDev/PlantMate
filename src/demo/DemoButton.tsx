"use client";

import { useDemo } from "../context/DemoContext";
import { Button } from "@/components/Button/Button"; // dein vorhandener Button
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";

export function DemoButton() {
    const { isRunning, start } = useDemo();
    const { isAuthenticated, status } = useAuth();
    const router = useRouter();
    if (isRunning) return null;
    if (status === "loading") return null;

    return (
        <Button
            variant="secondary"
            onClick={() => {
                if (!isAuthenticated) {
                    router.push("/login");
                    return;
                }
                start();
            }}
        >
            🌱 Demo starten
        </Button>
    );
}