import { validatePlant, PlantErrors } from "@/helpers/validationUtils";

export type { PlantErrors };

export const usePlantValidation = () => {
    return {
        validate: (
            plant: { title: string; species?: string; environmentId: string },
            count?: number
        ) => validatePlant(plant, count),
    };
};