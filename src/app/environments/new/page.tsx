import styles from '@/app/page.module.scss'
import { MultiStepForm } from "./components/MultiStepForm";

export default async function EnvironmentFormPage() {

  return (
    <div className={styles.page}>
        <main className={styles.main}>
          <MultiStepForm/>
        </main>
    </div>
  );
}
