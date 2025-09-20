import { type PlantData } from "../../data/plant"
import { ImageWithDescription } from "../ImageWithDescription/ImageWithDescription"
import styles from './PlantCard.module.scss'

interface PlantCardProps {
    plant: PlantData
}

export const PlantCard: React.FC<PlantCardProps> = ({plant}) => {
    const mainPhoto = plant.photos[
        plant.mainPhotoIndex !== undefined ? plant.mainPhotoIndex : plant.photos.length - 1
    ];
    
    const {alt, src, description} = mainPhoto

    return (
        <article className={styles["plant-card"]}>
            <ImageWithDescription alt={alt} src={src} description={description} />
        </article>
    )
}