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
                <div className={styles.title}>
                    {icon && <TypeIcon icon={icon} variant={iconVariant || ''} />}
                    <h1>{title}</h1>
                </div>
                {subtitle && <p>{subtitle}</p>}
            </div>
            {children}
        </header>
    );
}