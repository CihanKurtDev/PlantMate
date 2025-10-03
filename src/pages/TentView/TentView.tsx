import { PlantCard } from "../../components/PlantCard/PlantCard"
import { useTentContext } from "../../context/UseTentContext"
import styles from './TentView.module.scss'
import { useParams } from "react-router"

export const TentView = () => {
    const { tents } = useTentContext()
    const { id } = useParams<{ id: string }>();
    const displayedTent = tents.find(plant => plant.id === id)
    
    if(!displayedTent) return <p>Plant not Found</p>
    
    const { name, environment, plants } = displayedTent
    const environmentEntries = Object.entries(environment)
    
    return (
        <main>
            <header className={styles["plant-view-header"]}>
                <h1>{name}</h1>
            </header>
            <section className={styles["table-section"]}>
                <table>
                    {environmentEntries.map(([key]) => <th key={key}>{key}</th>)}
                    <tbody>
                        <tr>{environmentEntries.map(([key, value]) => <td key={key}>{value.value + value.unit}</td>)}</tr>
                    </tbody>
                </table>
            </section>
            <section className={styles["plant-section"]}>
                {plants.map(plant => <PlantCard key={plant.id} plant={plant}/>)}
            </section>
        </main>
    )
}