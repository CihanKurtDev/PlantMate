import styles from './PlantView.module.scss'
import { ImageWithDescription } from "../../components/ImageWithDescription/ImageWithDescription"
import type { PlantData } from "../../data/tents"

export const PlantView: React.FC<{plant: PlantData, plantName: string}> = ({plant, plantName}) => {
    const {title,photos} = plant

    return (
        <main>
            <header className={styles["plant-view-header"]}>
                <h1>{title}</h1>
                <h2>{plantName}</h2>
            </header>
            <section className={styles["photo-section"]}>
                {photos.map(photo => (
                    <div className={styles["image-window"]}>
                        <ImageWithDescription src={photo.src} alt={photo.alt} description={photo.description} />
                    </div>
                ))}
            </section>
        </main>
    )
}