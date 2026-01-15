import styles from "./TypeIcon.module.scss";
import { LucideIcon } from "lucide-react";

type Props = {
    icon: LucideIcon;
    variant?: string;
};

const TypeIcon = ({ icon: Icon, variant }: Props) => {
    return (
        <div className={`${styles.iconWrapper} ${variant ? styles[variant] : ""}`}>
            <Icon className={styles.icon} />
        </div>
    );
};

export default TypeIcon;
