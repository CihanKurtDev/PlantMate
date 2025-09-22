import { usePlantContext } from "../../context/UsePlantContext";
import { type PlantData } from "../../data/plant"
import { ImageWithDescription } from "../ImageWithDescription/ImageWithDescription"
import styles from './PlantCard.module.scss'

// this has to move to a place that makes more sense PlantView takes same props
export interface PlantProps {
    plant: PlantData,
}

export const PlantCard: React.FC<PlantProps> = ({plant}) => {
    const { setSelectedPlantId } = usePlantContext();
    
    const mainPhoto = plant.photos[
        plant.mainPhotoIndex !== undefined ? plant.mainPhotoIndex : plant.photos.length - 1
    ];
    
    const {alt, src, description} = mainPhoto

    return (
        <article className={styles["plant-card"]} onClick={() => setSelectedPlantId(plant.id)}>
            <ImageWithDescription alt={alt} src={src} description={description} />
        </article>
    )
}