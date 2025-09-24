import { PlantCard } from "../../components/PlantCard/PlantCard";
import { usePlantContext } from "../../context/UsePlantContext";
import styles from "./PlantOverview.module.scss";



export const PlantOverview = () => {
    const {plants} = usePlantContext()
    return (
        <main className={styles["plant-grid"]}>
            {plants.map(plant => (
                <PlantCard key={plant.id} plant={plant}/>
            ))}
        </main>
    )
};
