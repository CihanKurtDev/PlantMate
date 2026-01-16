import { Section } from '@/components/Section/Section'
import styles from './CardGridSection.module.scss'

interface CardGridSectionProps<T>{
    title: string,
    subtitle: string,
    items: T[],
    renderItem: (item: T, index: number) => React.ReactNode,
    className?: string,
}

export default function CardGridSection<T>({
    title,
    subtitle,
    items,
    renderItem,
    className,
}: CardGridSectionProps<T>) {
    return (
        <Section className={className}>
            <h2>{title}</h2>
            <p>{subtitle}</p>
            <div className={styles.grid}>
                {items.map(renderItem)}
            </div>
        </Section>
    )
}