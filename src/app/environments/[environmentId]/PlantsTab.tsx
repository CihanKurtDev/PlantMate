import { PlantData } from '@/types/plant';
import styles from './EnvironmentDetailView.module.scss';
import { ArrowLeft } from 'lucide-react';

export default function PlantsTab({ plants }: {plants: PlantData[]}) {
    return plants.map(p => (
        <section key={p.id}>
            <div className={styles.card}>
                <div>
                    <strong>{p.title}</strong>
                    <div>{p.species}</div>
                </div>
                <ArrowLeft />
            </div>
        </section>
    ));
}
