import styles from './DetailViewHeader.module.scss';
import TypeIcon from "@/components/TypeIcon/TypeIcon";
import { LucideIcon } from 'lucide-react';

interface DetailViewHeader {
    title: string,
    icon: LucideIcon,
    iconVariant?: string,
    subtitle?: string,
    children?: React.ReactNode
}

export default function DetailViewHeader({ title, icon, children, subtitle, iconVariant }: DetailViewHeader ) {
    return (
        <header className={styles.header}>
            <div className={styles.info}>
                    {icon && <TypeIcon icon={icon} variant={iconVariant || ''} />}
                <div className={styles.title}>
                    <h1>{title}</h1>
                {subtitle && <p>{subtitle}</p>}
                </div>
            </div>
            <div className={styles.actions}>{children}</div>
        </header>
    );
}