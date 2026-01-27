import { PlantData } from "@/types/plant";
import { useWaterValidation } from "./useWaterValidation";

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
            const { errors: waterErrors } = useWaterValidation(plant.water);
            if (Object.keys(waterErrors).length > 0) errors.water = waterErrors;
        }

        return errors;
    };

    const validateWarnings = (plant: PlantData): PlantFormWarnings => {
        if (plant.water) {
            const { warnings: waterWarnings } = useWaterValidation(plant.water);
            if (Object.keys(waterWarnings).length > 0) return { water: waterWarnings };
        }
        return {};
    };

    return { validate, validateWarnings };
};