import { useCallback } from "react";
import { useEnvironment } from "@/context/EnvironmentContext";
import { usePlant } from "@/context/PlantContext";

export function useDeleteEnvironments() {
    const { deleteEnvironments } = useEnvironment();
    const { plants, deletePlants } = usePlant();

    return useCallback((ids: string[]) => {
        const orphanedPlantIds = plants
            .filter(p => ids.includes(p.environmentId))
            .map(p => p.id!);

        if (orphanedPlantIds.length > 0) deletePlants(orphanedPlantIds);
        deleteEnvironments(ids);
    }, [deleteEnvironments, deletePlants, plants]);
}