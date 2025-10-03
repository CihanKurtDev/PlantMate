import { useNavigate } from "react-router";
import { useTentContext } from "../../context/UseTentContext";
import { type TentData } from "../../data/tents"
import styles from './TentCard.module.scss'
import { memo } from "react";
import { EnvironmentOverview } from "../EnvironmentTable/EnvironmentTable";


export interface TentProps {
    tent: TentData,
}

export const TentCard: React.FC<TentProps> = memo(({tent}) => {
    const { setSelectedTentId } = useTentContext();
    const navigate = useNavigate();

    const handleClick = () => {
        setSelectedTentId(tent.id);
        navigate(`/tent/${tent.id}`);
    };
    
    const {species, name, location, environment} = tent
    const speciesTags = species.map((species, index) => <li key={index}>{species}</li>)
    const speciesArrayHasContent = species.length > 0

    return (
        <article className={styles["tent-card"]} onClick={handleClick}>
            <div className={styles["tent-data"]}>
                <p className={styles.name}>{name}</p>
                {speciesArrayHasContent && 
                    <div className={styles["species-overview"]}>
                        <p>Species: </p>
                        <ul className={styles["species-list"]}>{speciesTags}</ul>
                    </div>
                }
                {location && <p className={styles.location}>Location: <span>{location}</span></p>}
            </div>
            <EnvironmentOverview environment={environment} />
        </article>
    )
})