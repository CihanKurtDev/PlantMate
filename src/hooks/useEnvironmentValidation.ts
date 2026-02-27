import { validateEnvironment, EnvironmentErrors, EnvironmentWarnings } from "@/helpers/validationUtils";

export type { EnvironmentErrors, EnvironmentWarnings };

export const useEnvironmentValidation = () => {
    return { validate: validateEnvironment };
};