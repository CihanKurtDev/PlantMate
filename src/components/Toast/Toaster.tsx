import { CheckCircle, XCircle, Info, X } from "lucide-react";
import styles from "./Toaster.module.scss";
import { ToastType } from "@/context/ToastContext";

interface Toast {
    id: string;
    message: string;
    type: ToastType;
}

interface ToasterProps {
    toasts: Toast[];
    onRemove: (id: string) => void;
}

const ICONS: Record<ToastType, typeof CheckCircle> = {
    success: CheckCircle,
    error: XCircle,
    info: Info,
};

export function Toaster({ toasts, onRemove }: ToasterProps) {
    if (!toasts.length) return null;

    return (
        <ul className={styles.list} aria-live="polite" aria-label="Benachrichtigungen">
            {toasts.map(toast => {
                const Icon = ICONS[toast.type];
                return (
                    <li key={toast.id} className={`${styles.toast} ${styles[toast.type]}`}>
                        <Icon size={16} aria-hidden className={styles.icon} />
                        <span className={styles.message}>{toast.message}</span>
                        <button
                            className={styles.close}
                            onClick={() => onRemove(toast.id)}
                            aria-label="Schließen"
                        >
                            <X size={14} aria-hidden />
                        </button>
                    </li>
                );
            })}
        </ul>
    );
}