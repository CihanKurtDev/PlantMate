"use client";

import { ReactNode } from "react";
import styles from './PageLayout.module.scss';

interface PageLayoutProps {
    title?: string;
    subtitle?: string;
    children: ReactNode;
}

const PageLayout = ({ title, subtitle, children }: PageLayoutProps)  => {
    return (
        <div className={styles.container}>
            {title && (
                <header className={styles.header}>
                    <h1>{title}</h1>
                    {subtitle && <p>{subtitle}</p>}
                </header>
            )}

            <main className={styles.content}>
                {children}
            </main>
        </div>
    );
}

export default PageLayout