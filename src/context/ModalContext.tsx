"use client";

import { createContext, useContext, ReactNode } from "react";

interface ModalContextValue {
    closeModal: () => void;
}

const ModalContext = createContext<ModalContextValue | null>(null);

export const useModal = (): ModalContextValue => {
    const ctx = useContext(ModalContext);
    if (!ctx) throw new Error("useModal must be used within a Modal");
    return ctx;
};

export const ModalProvider = ({ children , closeModal }: {children: ReactNode, closeModal: () => void}) => (
    <ModalContext.Provider value={{ closeModal }}>
        {children}
    </ModalContext.Provider>
);