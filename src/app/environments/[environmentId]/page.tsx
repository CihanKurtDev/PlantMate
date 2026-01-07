import EnvironmentDetailView from "./EnvironmentDetailView";
import styles from '@/app/page.module.scss'

export default async function EnvironmentDetailPage({ params }: {params: Promise<{ environmentId: string }>}) {
  const { environmentId } = await params;

  return (
    <div className={styles.page}>
        <main className={styles.main}>
          <EnvironmentDetailView environmentId={environmentId} />
        </main>
    </div>
  );
}