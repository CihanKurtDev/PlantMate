import { PlantData } from "@/types/plant";
import { useWaterValidation } from "./useWaterValidation";
import { validateWater } from "@/helpers/validaionUtils";

export interface PlantFormErrors {
    title?: string;
    species?: string;
    environmentId?: string;
    water?: ReturnType<typeof useWaterValidation>["errors"];
}

export interface PlantFormWarnings { 
    water?: ReturnType<typeof useWaterValidation>["warnings"];
} 

export const usePlantValidation = () => {
    const validate = (plant: PlantData): PlantFormErrors => {
        const errors: PlantFormErrors = {};

        if (!plant.title || plant.title.trim() === "") errors.title = "Name erforderlich";
        else if (plant.title.length < 2) errors.title = "Name muss mindestens 2 Zeichen lang sein";

        if (plant.species && plant.species.length > 100) errors.species = "Art zu lang (max. 100 Zeichen)";

        if (!plant.environmentId || plant.environmentId.trim() === "") {
            errors.environmentId = "Environment erforderlich";
        }

        if (plant.water) {
            const waterValidation = validateWater(plant.water);
            if (Object.keys(waterValidation.errors).length > 0) {
                errors.water = waterValidation.errors;
            }
        }

        return errors;
    };

    const validateWarnings = (plant: PlantData): PlantFormWarnings => {
        const warnings: PlantFormWarnings = {};

        if (plant.water) {
            const waterValidation = validateWater(plant.water);
            if (Object.keys(waterValidation.warnings).length > 0) {
                warnings.water = waterValidation.warnings;
            }
        }

        return warnings;
    };

    return { validate, validateWarnings };
};