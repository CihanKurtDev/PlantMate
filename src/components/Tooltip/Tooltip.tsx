import styles from "./Tooltip.module.scss";

interface TooltipProps {
    content: string;
    children: React.ReactNode;
}

export function Tooltip({ content, children }: TooltipProps) {
    return (
        <span className={styles.wrapper}>
            {children}
            <span className={styles.tip} role="tooltip">{content}</span>
        </span>
    );
}