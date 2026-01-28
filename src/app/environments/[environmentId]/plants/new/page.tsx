import { PlantForm } from "@/app/environments/new/components/PlantForm";

interface NewPlantPageProps {
  params: Promise<{ environmentId: string }>; 
}

export default async function NewPlantPage({ params }: NewPlantPageProps) {
  const { environmentId } = await params;

  if (!environmentId) return <p>Keine Environment ID angegeben</p>;

  return <PlantForm environmentId={environmentId} />;
}
