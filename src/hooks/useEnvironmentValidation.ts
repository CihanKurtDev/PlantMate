import { EnvironmentData } from "@/types/environment";
import { useClimateValidation } from "./useClimateValidation";

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
            const { errors: climateErrors } = useClimateValidation(env.climate);
            if (Object.keys(climateErrors).length > 0) errors.climate = climateErrors;
        }

        return errors;
    };

    const validateWarnings = (env: EnvironmentData): EnvironmentFormWarnings => {
        if (env.climate) {
            const { warnings: climateWarnings } = useClimateValidation(env.climate);
            if (Object.keys(climateWarnings).length > 0) return { climate: climateWarnings };
        }
        return {};
    };

    return { validate, validateWarnings };
};
