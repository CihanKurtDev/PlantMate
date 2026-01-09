import ClimateGrid from "@/components/climate/ClimateGrid";
import EnvironmentTypeIcon from "@/app/dashboard/components/EnvironmentTypeIcon";
import styles from './EnvironmentHeader.module.scss';
import { EnvironmentData } from "@/types/environment";

export default function EnvironmentHeader({ environment }: { environment: EnvironmentData }) {
  return (
        <header className={styles.environmentHeader}>
            <div className={styles.environmentInfo}>
                <div className={styles.environmentTitle}>
                    <EnvironmentTypeIcon type={environment.type} />
                    <h1>{environment.name}</h1>
                </div>
                {environment.location && <p><strong>Ort: </strong>{environment.location}</p>}
            </div>
            {environment.climate && <ClimateGrid climate={environment.climate} />}
        </header>
    );
}