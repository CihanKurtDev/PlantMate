import styles from './Tabs.module.scss';
import { Button } from '@/components/Button/Button';
import { JSX } from 'react';

export type TabVariant = 'plants' | 'climate' | 'events'

export interface TabItem<T extends string> {
    id: T;
    label: string;
    icon?: JSX.Element;
}

interface TabProps<T extends string> {
    activeTab: T,
    setActiveTab: React.Dispatch<React.SetStateAction<T>>,
    tabs: TabItem<T>[];
}

export default function Tabs<T extends string>({ activeTab, setActiveTab, tabs }: TabProps<T>) {

    return (
        <div className={styles.tabRow}>
            {tabs.map(t => (
                <Button
                    key={t.id}
                    variant={activeTab === t.id ? 'primary' : 'secondary'}
                    size="md"
                    onClick={() => setActiveTab(t.id)}
                >
                    {t.icon} {t.label}
                </Button>
            ))}
        </div>
    );
}
