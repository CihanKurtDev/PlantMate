import { EnvironmentData } from "@/types/environment";

export interface EnvironmentFormErrors {
    name?: string;
    type?: string;
    location?: string;
    climate?: {
        temp?: string;
        humidity?: string;
        co2?: string;
        vpd?: string;
    };
}

export interface EnvironmentFormWarnings { 
    climate?: {
        temp?: string;
        humidity?: string;
        co2?: string;
        vpd?: string;
    };
} 

export const useEnvironmentValidation = () => {
    const validateNumberField = (
        value: number | undefined,
        min: number,
        max: number,
        label: string,
    ): string | undefined => {
        if (value === undefined || value === null) return undefined;
        if (isNaN(value)) return "Bitte eine Zahl eingeben";
        const rounded = parseFloat(value.toFixed(2));

        if (rounded < min || rounded > max) {
            return `${label} muss zwischen ${min} und ${max} liegen`;
        }
        return undefined;
    };

    const validate = (env: EnvironmentData) => {
        const errors: EnvironmentFormErrors = {};

        if (!env.name || env.name.trim() === "") errors.name = "Name erforderlich";
        else if (env.name.length < 2) errors.name = "Name muss mindestens 2 Zeichen lang sein";

        if (!env.type) errors.type = "Typ erforderlich";

        if (env.location && env.location.length > 50) errors.location = "Location zu lang (max. 50 Zeichen)";

        if (env.climate) {
            const { temp, humidity, co2, vpd } = env.climate;
            const climateErrors: EnvironmentFormErrors["climate"] = {};

            if (temp?.value !== undefined) {
                const [min, max] = temp.unit === "F" ? [32, 104] : [0, 40];
                climateErrors.temp = validateNumberField(temp.value, min, max, "Temperatur");
            }

            climateErrors.humidity = validateNumberField(humidity?.value, 0, 100, "Luftfeuchtigkeit");
            climateErrors.co2 = validateNumberField(co2?.value, 0, 5000, "CO₂");
            climateErrors.vpd = validateNumberField(vpd?.value, 0, 10, "VPD");

            if (Object.values(climateErrors).some(Boolean)) errors.climate = climateErrors;
        }

        return errors;
    };

    const validateWarnings = (env: EnvironmentData): EnvironmentFormWarnings => {
        const warnings: EnvironmentFormWarnings = {};

        if (env.climate) {
            const { temp, humidity, co2, vpd } = env.climate;
            const climateWarnings: EnvironmentFormWarnings["climate"] = {};

            if (temp?.value !== undefined) {
                if (temp.unit === "F") {
                    if (temp.value < 64.4) climateWarnings.temp = "Temperatur niedrig: Wachstum verlangsamt";
                    else if (temp.value > 86) climateWarnings.temp = "Temperatur hoch: Risiko von Hitzestress";
                } else {
                    if (temp.value < 18) climateWarnings.temp = "Temperatur niedrig: Wachstum verlangsamt";
                    else if (temp.value > 30) climateWarnings.temp = "Temperatur hoch: Risiko von Hitzestress";
                }
            }

            if (vpd?.value !== undefined) {
                if (vpd.value < 0.5) climateWarnings.vpd = "VPD sehr niedrig: Gefahr von Pflanzenstress";
                else if (vpd.value > 2.5) climateWarnings.vpd = "VPD sehr hoch: Schimmelrisiko steigt";
            }

            if (co2?.value !== undefined && co2.value > 1000) {
                climateWarnings.co2 = "CO₂ hoch: Lüften empfohlen";
            }

            if (humidity?.value !== undefined) {
                if (humidity.value > 80) climateWarnings.humidity = "Luftfeuchtigkeit hoch: Schimmelgefahr";
                else if (humidity.value < 30) climateWarnings.humidity = "Luftfeuchtigkeit niedrig: Austrocknungsgefahr";
            }

            if (Object.keys(climateWarnings).length > 0) warnings.climate = climateWarnings;
        }

        return warnings;
    };

    return { validate, validateWarnings };
};

