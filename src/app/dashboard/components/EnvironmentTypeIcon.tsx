import { EnvironmentType } from "@/types/environment";
import styles from './EnvironmentTypeIcon.module.scss';
import { Home, Tent, Leaf } from "lucide-react";

const EnvironmentTypeIcon =({ type }: { type: EnvironmentType }) => {
    const getTypeClass = () => {
        switch (type) {
            case 'TENT': return styles.tent;
            case 'ROOM': return styles.room;
            case 'GREENHOUSE': return styles.greenhouse;
        }
    };

    const getIcon = () => {
        switch (type) {
            case 'TENT': return <Tent />;
            case 'ROOM': return <Home/>;
            case 'GREENHOUSE': return <Leaf/>;
        }
    };
    
    return (
        <div className={`${styles.iconWrapper} ${getTypeClass()}`}>
            <div className={`${styles.icon} ${getTypeClass()}`}>
                {getIcon()}
            </div>
        </div>
    );
}

export default EnvironmentTypeIcon