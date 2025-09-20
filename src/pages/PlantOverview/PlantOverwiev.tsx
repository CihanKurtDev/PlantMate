import { PlantCard } from "../../components/PlantCard/PlantCard";
import { plants } from "../../data/plant";
import styles from "./PlantOverview.module.scss";

export const PlantOverview = () => (
    <div className={styles["plant-grid"]}>
        {plants.map(plant => (
            <PlantCard key={plant.id} plant={plant} />
        ))}
    </div>
);
