import { ChevronLeft, LucideIcon } from "lucide-react";
import { ReactNode } from "react";
import styles from "./PageLayout.module.scss";
import TypeIcon from "../TypeIcon/TypeIcon";
import Link from "next/link";

interface PageLayoutProps {
    children: ReactNode;
    title?: string;
    subtitle?: string;
    icon?: LucideIcon;
    iconVariant?: string;
    backLink?: { label: string; href: string };
    actions?: ReactNode;
}

export const PageLayout = ({ title, subtitle, icon, iconVariant, backLink, actions, children }: PageLayoutProps) => {
    return (
        <>
            {title && (
                <header className={styles.header}>
                    <div className={styles.info}>
                        {icon && <TypeIcon icon={icon} variant={iconVariant || ''} />}
                        <div className={styles.title}>
                            <h1>{title}</h1>
                            {backLink && (
                                <Link href={backLink.href} className={styles.backLink}>
                                    <ChevronLeft size={16} />
                                    {backLink.label}
                                </Link>
                            )}
                            {subtitle && <p>{subtitle}</p>}
                        </div>
                    </div>
                    {actions && <div className={styles.actions}>{actions}</div>}
                </header>
            )}
            <main>{children}</main>
        </>
    );
};