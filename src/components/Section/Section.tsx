import { ReactNode } from 'react';
import styles from './section.module.scss';

export const Section = ({children, className}: {children: ReactNode, className?: string}) => {
    const sectionClass = className ? `${styles.section} ${className}` : `${styles.section}`
    console.log(sectionClass)
    return (
        <section className={sectionClass}>
            {children}
        </section>
    )
}