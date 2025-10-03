import { useNavigate } from "react-router";
import { type PlantData } from "../../data/tents"
import styles from './PlantCard.module.scss'
import { memo } from "react";
import { WaterTable } from "../WaterTable/WaterTable";

export interface PlantProps {
    plant: PlantData,
}

export const PlantCard: React.FC<PlantProps> = memo(({plant}) => {
    const navigate = useNavigate();

    const handleClick = () => {
        // setSelectedTentId(tent.id);
        navigate(`/plant/${plant.id}`);
        console.log("click")
    };
    
    const {title, water} = plant

    return (
        <article className={styles["plant-card"]} onClick={handleClick}>
            <div className="tent-data">
                <p>{title}</p>
            </div>
            <WaterTable water={water} />
        </article>
    )
})