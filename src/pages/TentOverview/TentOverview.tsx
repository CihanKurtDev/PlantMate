import { TentCard } from "../../components/TentCard/TentCard";
import { useTentContext } from "../../context/UseTentContext";
import styles from "./TentOverview.module.scss";



export const TentOverview = () => {
    const {tents} = useTentContext()

    return (
        <main className={styles["plant-grid"]}>
            {tents.map(tent => (
                <TentCard key={tent.id} tent={tent}/>
            ))}
        </main>
    )
};
