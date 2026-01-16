import PlantDetailView from './PlantDetailView';

export default async function PlantDetailPage({ params }: {params: Promise<{ plantId: string }>}) {
  const { plantId } = await params;

  return <PlantDetailView plantId={plantId} />
}