import EnvironmentDetailView from "./EnvironmentDetailView";

export default async function EnvironmentDetailPage({ params }: {params: Promise<{ environmentId: string }>}) {
  const { environmentId } = await params;

  return <EnvironmentDetailView environmentId={environmentId} />
}