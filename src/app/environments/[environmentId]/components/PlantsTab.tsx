import { PlantData } from '@/types/plant';
import styles from './PlantsTab.module.scss';
import TabContent from './shared/TabContent';
import EmptyState from './shared/EmptyState';
import PlantCard from './shared/PlantCard';
import Link from 'next/link';

export default function PlantsTab({ plants, hidden }: {plants: PlantData[], hidden: boolean}) {
    if (hidden) return null
    return (
        <TabContent id="plants" title={`Pflanzen (${plants.length})`}>
            {plants.length === 0 ? (
                <EmptyState message='Keine Pflanzen vorhanden' />
            ) : (
                <div className={styles.plantsGrid}>
                    {plants.map(plant => (
                        <Link key={plant.id} href={`/environments/${plant.environmentId}/plants/${plant.id}`} className={styles.buttonLink}>
                            <PlantCard key={plant.id} plant={plant} />
                        </Link>
                        
                    ))}
                </div>
            )}
        </TabContent>
    );
}
