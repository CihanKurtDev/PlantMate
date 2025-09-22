import type React from "react"
import { usePlantContext } from "../../context/UsePlantContext"
import styles from './PlantView.module.scss'
import { ImageWithDescription } from "../../components/ImageWithDescription/ImageWithDescription"

interface PlantViewProps {
    plantId: string,
}

export const PlantView: React.FC<PlantViewProps> = ({plantId}) => {
    const { plants } = usePlantContext()
    const displayedPlant = plants.find(plant => plant.id === plantId)
    
    if(!displayedPlant) return <p>Plant not Found</p>
    
    const {title, plantName, environment, photos} = displayedPlant
    const environmentEntries = Object.entries(environment)

    return (
        <main>
            <header className={styles["plant-view-header"]}>
                <h1>{title}</h1>
                <h2>{plantName}</h2>
            </header>
            <section className={styles["table-section"]}>
                <table>
                    {environmentEntries.map(([key]) => <th key={key}>{key}</th>)}
                    <tbody>
                        <tr>{environmentEntries.map(([key, value]) => <td key={key}>{value}</td>)}</tr>
                    </tbody>
                </table>
            </section>
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