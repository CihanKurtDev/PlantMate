import Dashboard from './Dashboard'
import styles from '../page.module.scss'

const DashboardPage = () => (
    <div className={styles.page}>
        <main className={styles.main}>
            <Dashboard />
        </main>
    </div>
)

export default DashboardPage