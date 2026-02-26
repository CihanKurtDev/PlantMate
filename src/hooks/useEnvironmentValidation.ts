import { EnvironmentFormData } from "@/types/environment";

export interface EnvironmentFormErrors {
    name?: string;
    type?: string;
    location?: string;
}

interface EnvironmentFormWarnings {
    name?: string;
    type?: string;
    location?: string;
}

export const useEnvironmentValidation = () => {
    const validate = (env: EnvironmentFormData): EnvironmentFormErrors => {
        const errors: EnvironmentFormErrors = {};

        if (!env.name || env.name.trim() === "") errors.name = "Name erforderlich";
        else if (env.name.length < 2) errors.name = "Name muss mindestens 2 Zeichen lang sein";

        if (!env.type) errors.type = "Typ erforderlich";
        if (env.location && env.location.length > 50) errors.location = "Location zu lang (max. 50 Zeichen)";

        return errors;
    };

    const validateWarnings = (env: EnvironmentFormData): EnvironmentFormWarnings => {
        const warnings: EnvironmentFormWarnings = {};
        if (env.name && env.name.length > 30) warnings.name = "Name ist ziemlich lang, kürzer könnte besser sein";
        return warnings;
    };

    return { validate, validateWarnings };
};