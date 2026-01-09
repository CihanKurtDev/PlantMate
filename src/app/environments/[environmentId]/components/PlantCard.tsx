import { PlantData } from "@/types/plant";
import { ArrowRight, Sprout } from "lucide-react";
import styles from './PlantCard.module.scss'

const PlantCard = ({ plant }: { plant: PlantData }) => {
    return (
        <div className={styles.card}>
            <div className={styles.content}>
                <div className={styles.iconWrapper}>
                    <Sprout/>
                </div>
                <div className={styles.info}>
                    <h4 className={styles.title}>{plant.title}</h4>
                    <p className={styles.species}>{plant.species}</p>
                    {plant.water && (
                        <div className={styles.waterValues}>
                            {Object.entries(plant.water).map(([key, value]) => 
                                value ? (
                                    <span
                                        key={key}
                                        className={`${styles.badge} ${styles[key]}`}
                                    >
                                        {key.toUpperCase()} {value.value} {value.unit || ''}
                                    </span>
                                ) : null
                            )}
                        </div>
                    )}
                </div>
                <div className={styles.arrowRight}>
                    <ArrowRight/>
                </div>
            </div>
        </div>
    );
}
export default PlantCard