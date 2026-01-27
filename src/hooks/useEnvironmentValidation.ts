import { EnvironmentData } from "@/types/environment";
import { useClimateValidation } from "./useClimateValidation";
import { validateClimate } from "@/helpers/validaionUtils";

export interface EnvironmentFormErrors {
    name?: string;
    type?: string;
    location?: string;
    climate?: ReturnType<typeof useClimateValidation>["errors"];
}

export interface EnvironmentFormWarnings {
    climate?: ReturnType<typeof useClimateValidation>["warnings"];
}

export const useEnvironmentValidation = () => {
    const validate = (env: EnvironmentData): EnvironmentFormErrors => {
        const errors: EnvironmentFormErrors = {};

        if (!env.name || env.name.trim() === "") errors.name = "Name erforderlich";
        else if (env.name.length < 2) errors.name = "Name muss mindestens 2 Zeichen lang sein";

        if (!env.type) errors.type = "Typ erforderlich";
        if (env.location && env.location.length > 50) errors.location = "Location zu lang (max. 50 Zeichen)";

        if (env.climate) {
            const climateValidation = validateClimate(env.climate);
            if (Object.keys(climateValidation.errors).length > 0) {
                errors.climate = climateValidation.errors;
            }
        }

        return errors;
    };

    const validateWarnings = (env: EnvironmentData): EnvironmentFormWarnings => {
        const warnings: EnvironmentFormWarnings = {};
        if (env.climate) {
           const climateValidation = validateClimate(env.climate);
            if (Object.keys(climateValidation.warnings).length > 0) {
                warnings.climate = climateValidation.warnings;
            }
        }
        return warnings;
    };

    return { validate, validateWarnings };
};
