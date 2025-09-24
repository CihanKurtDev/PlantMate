import { useNavigate } from "react-router";
import { usePlantContext } from "../../context/UsePlantContext";
import { type PlantData } from "../../data/plant"
import { ImageWithDescription } from "../ImageWithDescription/ImageWithDescription"
import styles from './PlantCard.module.scss'

export interface PlantProps {
    plant: PlantData,
}

export const PlantCard: React.FC<PlantProps> = ({plant}) => {
    const { setSelectedPlantId } = usePlantContext();
    const navigate = useNavigate();
    
    const mainPhoto = plant.photos[
        plant.mainPhotoIndex !== undefined ? plant.mainPhotoIndex : plant.photos.length - 1
    ];

    const handleClick = () => {
        setSelectedPlantId(plant.id);
        navigate(`/plant/${plant.id}`);
    };
    
    const {alt, src, description} = mainPhoto

    return (
        <article className={styles["plant-card"]} onClick={handleClick}>
            <ImageWithDescription alt={alt} src={src} description={description} />
        </article>
    )
}