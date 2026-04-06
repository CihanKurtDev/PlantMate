import { useCallback } from "react";
import { nextFrame, sleep, waitFor } from "../demo/demoAsync";

export function useDemoDom() {
    const clickElement = useCallback((selector: string) => {
        const tryClick = (retries = 20) => {
            const el = document.querySelector(selector) as HTMLElement | null;
            if (el) {
                el.click();
            } else if (retries > 0) {
                setTimeout(() => tryClick(retries - 1), 50);
            } else {
                console.warn("Element not found:", selector);
            }
        };
        tryClick();
    }, []);

    const waitForSelector = useCallback(async (selector: string, timeout = 1200) => {
        const start = Date.now();
        while (Date.now() - start < timeout) {
            const el = document.querySelector(selector);
            if (el) return el as HTMLElement;
            await sleep(20);
        }
        return null;
    }, []);

    const typeIntoField = useCallback(async (selector: string, text: string, charDelay = 65) => {
        const el = await waitForSelector(selector);
        if (!el) return;

        const isTextArea = el.tagName === "TEXTAREA";
        const proto = isTextArea
            ? window.HTMLTextAreaElement.prototype
            : window.HTMLInputElement.prototype;
        const nativeSetter = Object.getOwnPropertyDescriptor(proto, "value")?.set;

        (el as HTMLElement).focus();

        let current = "";
        for (const char of text) {
            current += char;
            nativeSetter?.call(el, current);
            el.dispatchEvent(new Event("input", { bubbles: true }));
            await sleep(charDelay);
        }

        (el as HTMLElement).blur();
    }, [waitForSelector]);

    const isModalOpen = useCallback(() => {
        return !!document.querySelector('[data-demo="modal"]');
    }, []);

    const closeTopModal = useCallback(() => {
        const modal = document.querySelector('[data-demo="modal"]');
        if (!modal) return;

        const closeBtn = modal.querySelector(
            '[data-demo="modal-close"], button[aria-label="close"]'
        ) as HTMLElement | null;

        if (closeBtn) {
            closeBtn.click();
        } else {
            document.dispatchEvent(new KeyboardEvent("keydown", { key: "Escape" }));
        }
    }, []);

    const ensureModalClosed = useCallback(async () => {
        if (!isModalOpen()) return;
        closeTopModal();
        await waitFor(() => !document.querySelector('[data-demo="modal"]'), 800, 20);
        await nextFrame();
    }, [closeTopModal, isModalOpen]);

    return {
        clickElement,
        waitForSelector,
        typeIntoField,
        isModalOpen,
        closeTopModal,
        ensureModalClosed,
    };
}