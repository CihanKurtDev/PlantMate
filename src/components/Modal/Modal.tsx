import { ReactNode, useEffect } from "react";
import styles from "./Modal.module.scss";
import { ModalProvider } from "@/context/ModalContext";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: ReactNode;
}

const Modal = ({ isOpen, onClose, children }: ModalProps) => {
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
                <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
                    <div className={styles.modalHeader}>
                        <button className={styles.closeButton} onClick={onClose}>
                            &times;
                        </button>
                    </div>
                    <div className={styles.content}>{children}</div>
                </div>
            </div>
        </ModalProvider>
    );
};

export default Modal;
