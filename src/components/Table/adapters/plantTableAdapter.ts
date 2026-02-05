import { EnvironmentData } from "@/types/environment";
import { PlantData } from "@/types/plant";


// table funktioniert mit key aber hab ich nichz drin in PLantData also efniacher adapter
export type PlantTableRow = PlantData & {
  key: string;
  environmentName: string;
};

export function mapPlantsToTableRows(
    plants: PlantData[],
    environments: EnvironmentData[]
): PlantTableRow[] {
    const envMap = Object.fromEntries(
        environments.map(env => [env.id, env.name])
    );

    return plants.filter((plant): plant is PlantData & { id: string } => Boolean(plant.id)).map(plant => ({
        ...plant,
        key: plant.id,
        environmentName: envMap[plant.environmentId] ?? "—",
    }));
}
