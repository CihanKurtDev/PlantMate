import { validateRegister } from "@/helpers/validationUtils";

export const useRegisterValidation = () => {
    return { validate: validateRegister };
};
