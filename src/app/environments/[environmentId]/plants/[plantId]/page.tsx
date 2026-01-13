import styles from '@/app/page.module.scss'
import PlantDetailView from './PlantDetailView';

export default async function PlantDetailPage({ params }: {params: Promise<{ plantId: string }>}) {
  const { plantId } = await params;

  return (
    <div className={styles.page}>
        <main className={styles.main}>
          <PlantDetailView plantId={plantId} />
        </main>
    </div>
  );
}