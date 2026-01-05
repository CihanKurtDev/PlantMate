import { PlantData } from "@/types/plant";

export interface PlantFormErrors {
    title?: string;
    species?: string;
    environmentId?: string;
    water?: {
        ph?: string;
        ec?: string;
    };
}

export interface PlantFormWarnings { 
    water?: {
        ph?: string;
        ec?: string;
    };
} 

export const usePlantValidation = () => {
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

    const validate = (plant: PlantData) => {
        const errors: PlantFormErrors = {};

        if (!plant.title || plant.title.trim() === "") errors.title = "Name erforderlich";
        else if (plant.title.length < 2) errors.title = "Name muss mindestens 2 Zeichen lang sein";

        if (plant.species && plant.species.length > 100) errors.species = "Art zu lang (max. 100 Zeichen)";

        if (!plant.environmentId || plant.environmentId.trim() === "") {
            errors.environmentId = "Environment erforderlich";
        }

        if (plant.water) {
            const { ph, ec } = plant.water;
            const waterErrors: PlantFormErrors["water"] = {};

            waterErrors.ph = validateNumberField(ph?.value, 0, 14, "pH-Wert");
            waterErrors.ec = validateNumberField(ec?.value, 0, 10, "EC-Wert");

            if (Object.values(waterErrors).some(Boolean)) errors.water = waterErrors;
        }

        return errors;
    };

    const validateWarnings = (plant: PlantData): PlantFormWarnings => {
        const warnings: PlantFormWarnings = {};

        if (plant.water) {
            const { ph, ec } = plant.water;
            const waterWarnings: PlantFormWarnings["water"] = {};

            if (ph?.value !== undefined) {
                if (ph.value < 5.5) waterWarnings.ph = "pH-Wert sehr niedrig: Nährstoffaufnahme beeinträchtigt";
                else if (ph.value > 7.5) waterWarnings.ph = "pH-Wert sehr hoch: Mikronährstoffmangel möglich";
            }

            if (ec?.value !== undefined) {
                if (ec.value < 0.5) waterWarnings.ec = "EC-Wert sehr niedrig: Nährstoffmangel";
                else if (ec.value > 3.5) waterWarnings.ec = "EC-Wert sehr hoch: Gefahr von Nährstoffverbrennung";
            }

            if (Object.keys(waterWarnings).length > 0) warnings.water = waterWarnings;
        }

        return warnings;
    };

    return { validate, validateWarnings };
};