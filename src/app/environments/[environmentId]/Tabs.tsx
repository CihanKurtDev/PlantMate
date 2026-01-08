import { Sprout, Activity, Droplets } from 'lucide-react';
import styles from './EnvironmentDetailView.module.scss';
import { Button } from '@/components/Button/Button';
import { JSX } from 'react';
import { TabVariant } from './EnvironmentDetailView';

interface TabProps {
    activeTab: string,
    setActiveTab: React.Dispatch<React.SetStateAction<TabVariant>>,
    plantsCount: number
}

export default function Tabs({ activeTab, setActiveTab, plantsCount }: TabProps) {
    const tabs: { id: TabVariant; label: string; icon: JSX.Element }[]  = [
        { id: 'plants', label: `Pflanzen (${plantsCount})`, icon: <Sprout /> },
        { id: 'climate', label: 'Klima-Verlauf', icon: <Activity /> },
        { id: 'events', label: 'Ereignisse', icon: <Droplets /> }
    ];

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
