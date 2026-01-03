import { LoginFormData, LoginFormErrors } from "@/types/auth"

export const useLoginValidation = () => {
    const validate = (form: LoginFormData): LoginFormErrors => {
        const errors: LoginFormErrors = {}
        
        if (!form.email) {
            errors.email = "Email erforderlich"
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
            errors.email = "Ungültige Email-Adresse"
        }
        
        if (!form.password) {
            errors.password = "Passwort erforderlich"
        } else if (form.password.length < 4) {
            errors.password = "Passwort muss mindestens 4 Zeichen lang sein"
        }
        
        return errors
    }
    
    return { validate }
}