import styles from './DetailViewHeader.module.scss';
import TypeIcon from "@/components/TypeIcon/TypeIcon";
import { ChevronLeft, LucideIcon } from 'lucide-react';
import Link from 'next/link';

interface DetailViewHeader {
    title: string,
    icon: LucideIcon,
    iconVariant?: string,
    subtitle?: string,
    backLink?: { label: string; href: string },
    children?: React.ReactNode
}

export default function DetailViewHeader({ title, icon, children, subtitle, iconVariant, backLink }: DetailViewHeader ) {
    return (
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
            <div className={styles.actions}>{children}</div>
        </header>
    );
}