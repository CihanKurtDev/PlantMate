import { ChevronDown, ChevronUp } from "lucide-react";
import styles from "./Card.module.scss";
import { ReactNode } from "react";

interface CardHeaderProps {
    title: string;
    collapsible?: boolean;
    collapsed?: boolean;
    onToggle?: () => void;
    icon: ReactNode;
    headingLevel?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';
}

export const CardHeader: React.FC<CardHeaderProps> = ({
    title,
    collapsible,
    collapsed,
    onToggle,
    icon,
    headingLevel
}) => {
    const HeadingTag = headingLevel || 'h2';

    return (
        <div
            className={`${styles.header} ${collapsible ? styles.collapsible : ""}`}
            onClick={collapsible ? onToggle : undefined}
        >
            <HeadingTag>{icon && <figure>{icon}</figure>}{title}</HeadingTag>
            {collapsible && <div className={styles.actions}>
                {collapsible && (collapsed ? <ChevronDown /> : <ChevronUp />)}
            </div>}
        </div>
    );
};
