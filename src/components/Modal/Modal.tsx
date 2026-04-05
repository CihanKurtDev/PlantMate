import { ReactNode, useEffect, useState } from "react";
import styles from "./Modal.module.scss";
import { ModalProvider } from "@/context/ModalContext";
import { Button } from "@/components/Button/Button";

export interface ModalTab {
    key: string;
    label: ReactNode;
    content: ReactNode;
}

interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    children?: ReactNode;
    tabs?: ModalTab[];
}

const Modal = ({ isOpen, onClose, children, tabs }: ModalProps) => {
    const [activeTab, setActiveTab] = useState(tabs?.[0]?.key);

    useEffect(() => {
        setActiveTab(tabs?.[0]?.key);
    }, [tabs, isOpen]);

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === "Escape") onClose();
        };
        document.addEventListener("keydown", handleKeyDown);
        return () => document.removeEventListener("keydown", handleKeyDown);
    }, [onClose]);

    if (!isOpen) return null;

    return (
        <ModalProvider closeModal={onClose}>
            <div className={styles.overlay} onClick={onClose}>
                <div className={styles.modal} onClick={(e) => e.stopPropagation()} data-demo="modal">
                    <div className={styles.modalHeader}>
                        <button
                            className={styles.closeButton}
                            onClick={onClose}
                            data-demo="modal-close"
                        >
                            &times;
                        </button>
                    </div>

                    {tabs && (
                        <div className={styles.tabs}>
                            {tabs.map((tab, i) => (
                                <Button
                                    key={tab.key}
                                    data-demo={`modal-tab-${tab.key}`}
                                    style={{
                                        width: "100%",
                                        ...(i === 0 ? { border: "none" } : {}),
                                    }}
                                    isActive={activeTab === tab.key}
                                    onClick={() => setActiveTab(tab.key)}
                                >
                                    {tab.label}
                                </Button>
                            ))}
                        </div>
                    )}

                    <div className={styles.content}>
                        {tabs ? tabs.find((t) => t.key === activeTab)?.content : children}
                    </div>
                </div>
            </div>
        </ModalProvider>
    );
};

export default Modal;