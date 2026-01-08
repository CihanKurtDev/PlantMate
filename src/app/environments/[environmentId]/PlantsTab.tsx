import { PlantData } from '@/types/plant';
import styles from './PlantsTab.module.scss';
import TabContent from './TabContent';
import EmptyState from './EmptyState';

export default function PlantsTab({ plants }: {plants: PlantData[]}) {
    return (
        <TabContent id="plants" title={`Pflanzen (${plants.length})`}>
            {plants.length === 0 ? (
                <EmptyState message='Keine Pflanzen vorhanden' />
            ) : (
                <div className={styles.plantsGrid}>
                    {plants.map(p => (
                        <article key={p.id} className={styles.card}>
                            <div>
                                <strong>{p.title}</strong>
                                <div className={styles.species}>{p.species}</div>
                            </div>
                            <div className={styles.chevron} aria-hidden>›</div>
                        </article>
                    ))}
                </div>
            )}
        </TabContent>
    );
}
