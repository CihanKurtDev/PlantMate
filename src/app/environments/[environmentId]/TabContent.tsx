import React from 'react';
import styles from './TabContent.module.scss';

type TabContentProps = {
  id?: string;
  title: string;
  subtitle?: React.ReactNode;
  children: React.ReactNode;
};

export default function TabContent({ id, title, subtitle, children }: TabContentProps) {
    const headingId = id ? `${id}-heading` : undefined;

    return (
        <section id={id} className={styles.container} aria-labelledby={headingId}>
            <header className={styles.header}>
                <div>
                    <h2 id={headingId} className={styles.heading}>{title}</h2>
                    {subtitle && <div className={styles.subtitle}>{subtitle}</div>}
                </div>
            </header>
            <div className={styles.content}>
                {children}
            </div>
        </section>
    );
}