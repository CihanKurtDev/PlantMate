import { PlantData } from "@/types/plant";

function plantsShareProfile(plant: PlantData, otherPlant: PlantData): boolean {
    if (!plant.profile) return false;
    return plant.profile === otherPlant.profile;
}

interface UseWateringGroupProps {
    plants: PlantData[];
    fixedPlantId: string;
    selectedPlantIds: string[];
    onChange: (ids: string[]) => void;
}

export function useWateringGroup({
    plants,
    fixedPlantId,
    selectedPlantIds,
    onChange,
}: UseWateringGroupProps) {
    const fixedPlant = plants.find((plant) => plant.id === fixedPlantId);
    const allSelectedIds = new Set([fixedPlantId, ...selectedPlantIds]);

    const nonFixedIds = plants
        .map((plant) => plant.id!)
        .filter((id) => id !== fixedPlantId);

    const allNonFixedSelected = nonFixedIds.every((id) => selectedPlantIds.includes(id));

    const sameProfileIds = fixedPlant
        ? plants
              .filter((plant) => plant.id !== fixedPlantId && plantsShareProfile(plant, fixedPlant))
              .map((plant) => plant.id!)
        : [];

    const allSameProfileSelected =
        sameProfileIds.length > 0 &&
        sameProfileIds.every((id) => selectedPlantIds.includes(id));

    const toggle = (plantId: string) => {
        if (plantId === fixedPlantId) return;
        const next = new Set(selectedPlantIds);
        next.has(plantId) ? next.delete(plantId) : next.add(plantId);
        onChange([...next]);
    };

    const toggleAll = () => {
        onChange(allNonFixedSelected ? [] : nonFixedIds);
    };

    const toggleSameProfile = () => {
        if (allSameProfileSelected) {
            onChange(selectedPlantIds.filter((id) => !sameProfileIds.includes(id)));
        } else {
            onChange([...new Set([...selectedPlantIds, ...sameProfileIds])]);
        }
    };

    return {
        allSelectedIds,
        allNonFixedSelected,
        sameProfileIds,
        allSameProfileSelected,
        toggle,
        toggleAll,
        toggleSameProfile,
    };
}