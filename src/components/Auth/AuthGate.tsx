"use client";

import { useEffect, type ReactNode } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { useDemo } from "@/context/DemoContext";

const AUTH_PAGES = new Set(["/login", "/register"]);

const isProtectedPath = (pathname: string) =>
    pathname.startsWith("/dashboard") || pathname.startsWith("/environments");

export const AuthGate = ({ children }: { children: ReactNode }) => {
    const { status, isAuthenticated } = useAuth();
    const { isRunning, isTransitioning } = useDemo();
    const pathname = usePathname();
    const router = useRouter();
    const protectedPath = isProtectedPath(pathname);
    const authPage = AUTH_PAGES.has(pathname);
    const homePage = pathname === "/";
    const demoActive = isRunning || isTransitioning;

    useEffect(() => {
        if (status === "loading") return;

        if (!isAuthenticated && protectedPath && !demoActive) {
            router.replace("/");
            return;
        }

        if (isAuthenticated && authPage) {
            router.replace("/dashboard");
            return;
        }

        if (isAuthenticated && homePage) {
            router.replace("/dashboard");
        }
    }, [authPage, demoActive, homePage, isAuthenticated, protectedPath, router, status]);

    // Keep first render deterministic and avoid structural hydration mismatches.
    if (status === "loading" && (protectedPath || authPage)) {
        return <div aria-hidden="true" />;
    }
    if (!isAuthenticated && protectedPath && !demoActive) return <div aria-hidden="true" />;
    if (isAuthenticated && authPage) return <div aria-hidden="true" />;
    if (isAuthenticated && homePage) return <div aria-hidden="true" />;

    return <>{children}</>;
};
