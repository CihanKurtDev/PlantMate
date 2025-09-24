import React from "react"
import styles from './ImageWithDescription.module.scss'

interface ImageProps {
    src: string,
    alt: string,
    description: string,
}

export const ImageWithDescription: React.FC<ImageProps> = ({src, alt, description}) => {
    return(
        <figure className="figure">
            <div className={styles["image-window"]}>
                <img src={src} alt={alt} loading="lazy"/>
            </div>
            <figcaption>{description}</figcaption>
        </figure>
    )
}