import Dashboard from './Dashboard'
import styles from '../page.module.scss'
import PlantMonitorProvider from '@/context/PlantMonitorContext'
const DashboardPage = () => (
    <div className={styles.page}>
        <main className={styles.main}>
            <PlantMonitorProvider>
                <Dashboard />
            </PlantMonitorProvider>
        </main>
    </div>
)

export default DashboardPage