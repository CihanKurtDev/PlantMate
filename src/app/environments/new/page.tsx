import { EnvironmentForm } from "./components/EnvironmentForm";
import styles from '@/app/page.module.scss'

export default async function EnvironmentFormPage() {

  return (
    <div className={styles.page}>
        <main className={styles.main}>
          <EnvironmentForm/>
        </main>
    </div>
  );
}
