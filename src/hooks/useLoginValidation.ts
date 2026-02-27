import { validateLogin } from "@/helpers/validationUtils";

export const useLoginValidation = () => {
    return { validate: validateLogin };
};