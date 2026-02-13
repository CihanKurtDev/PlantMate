import { ChevronDown } from "lucide-react";
import styles from "./Card.module.scss";
import { ReactNode } from "react";

interface CardHeaderProps {
    title: string;
    collapsible?: boolean;
    collapsed?: boolean;
    onToggle?: () => void;
    icon?: ReactNode;
    headingLevel?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';
    headerLayout?: 'inline' | 'centered';
}

export const CardHeader: React.FC<CardHeaderProps> = ({
    title,
    collapsible,
    collapsed,
    onToggle,
    icon,
    headingLevel = "h2",
    headerLayout = 'inline',
}) => {
    const HeadingTag = headingLevel;
    const clickProps = collapsible
        ? { onClick: onToggle, role: 'button' as const, 'aria-expanded': !collapsed }
        : {};

    return (
        <div
            className={`${styles.header} ${styles[headerLayout]} ${collapsible ? styles.collapsible : ''}`}
            {...clickProps}
        >
            {headerLayout === 'centered' && icon && (
                <figure className={styles.icon}>{icon}</figure>
            )}

            <div className={headerLayout === 'inline' ? styles.headerLeft : undefined}>
                {headerLayout === 'inline' && icon && (
                    <figure className={styles.icon}>{icon}</figure>
                )}
                <HeadingTag>{title}</HeadingTag>
            </div>

            {collapsible && (
                <div className={styles.actions}>
                    <ChevronDown
                        size={18}
                        className={`${styles.chevron} ${collapsed ? '' : styles.chevronOpen}`}
                    />
                </div>
            )}
        </div>
    );
};