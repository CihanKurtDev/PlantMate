import { validatePlant, PlantErrors } from "@/helpers/validationUtils";

export type { PlantErrors };

export const usePlantValidation = () => {
    return { validate: validatePlant };
};