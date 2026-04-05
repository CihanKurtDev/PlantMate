import styles from './GhostState.module.scss';

interface GhostStateProps {
    isEmpty: boolean;
    children: React.ReactNode;
    overlay: React.ReactNode;
}

export function GhostState({ isEmpty, children, overlay }: GhostStateProps) {
    if (!isEmpty) return children;

    return (
        <div className={styles.ghostWrapper}>
            <div className={styles.ghostContent} aria-hidden>
                {children}
            </div>
            <div className={styles.ghostOverlay}>
                {overlay}
            </div>
        </div>
    );
}