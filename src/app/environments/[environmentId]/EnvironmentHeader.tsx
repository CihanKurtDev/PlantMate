import ClimateGrid from "@/components/climate/ClimateGrid";
import EnvironmentTypeIcon from "@/app/dashboard/components/EnvironmentTypeIcon";
import styles from './EnvironmentHeader.module.scss';
import { EnvironmentData } from "@/types/environment";

export default function EnvironmentHeader({ environment }: { environment: EnvironmentData }) {
  return (
        <header className={styles.environmentHeader}>
            <div className={styles.environmentInfo}>
                <EnvironmentTypeIcon type={environment.type} />
                <div className={styles.environmentTitle}>
                    <h1>{environment.name}</h1>
                    {environment.location && <p>{environment.location}</p>}
                </div>
            </div>
            {environment.climate && <ClimateGrid climate={environment.climate} />}
        </header>
    );
}