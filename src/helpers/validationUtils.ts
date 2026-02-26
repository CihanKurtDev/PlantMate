import { ClimateDataInput, EnvironmentFormData } from "@/types/environment";
import { WaterDataInput } from "@/types/plant";
import { LoginFormData, LoginFormErrors } from "@/types/auth";

export function hasValidationErrors(errors: object): boolean {
    return Object.values(errors).some(Boolean);
}

export interface ClimateErrors {
    temp?: string;
    humidity?: string;
    co2?: string;
    vpd?: string;
}

export interface ClimateWarnings {
    temp?: string;
    humidity?: string;
    co2?: string;
    vpd?: string;
}

export const validateClimate = (climate?: ClimateDataInput): { errors: ClimateErrors; warnings: ClimateWarnings } => {
    const errors: ClimateErrors = {};
    const warnings: ClimateWarnings = {};

    if (climate?.temp?.value) {
        const value = parseFloat(climate.temp.value);
        if (isNaN(value)) errors.temp = "Bitte eine Zahl eingeben";
        else if (value < 0 || value > 50) errors.temp = "Temperatur unrealistisch";
        else if (value < 18) warnings.temp = "Temperatur sehr niedrig";
        else if (value > 30) warnings.temp = "Temperatur sehr hoch";
    }

    if (climate?.humidity) {
        const value = parseFloat(climate.humidity);
        if (isNaN(value)) errors.humidity = "Bitte eine Zahl eingeben";
        else if (value < 0 || value > 100) errors.humidity = "Feuchtigkeit unrealistisch";
        else if (value < 40) warnings.humidity = "Luftfeuchtigkeit sehr niedrig";
        else if (value > 80) warnings.humidity = "Luftfeuchtigkeit sehr hoch";
    }

    if (climate?.co2) {
        const value = parseFloat(climate.co2);
        if (isNaN(value)) errors.co2 = "Bitte eine Zahl eingeben";
        else if (value < 0 || value > 5000) errors.co2 = "CO₂-Wert unrealistisch";
    }

    if (climate?.vpd) {
        const value = parseFloat(climate.vpd);
        if (isNaN(value)) errors.vpd = "Bitte eine Zahl eingeben";
        else if (value < 0 || value > 5) errors.vpd = "VPD unrealistisch";
    }

    return { errors, warnings };
};

export interface WaterErrors {
    ph?: string;
    ec?: string;
    amount?: string;
}

export interface WaterWarnings {
    ph?: string;
    ec?: string;
    amount?: string;
}

export const validateWater = (water?: WaterDataInput): { errors: WaterErrors; warnings: WaterWarnings } => {
    const errors: WaterErrors = {};
    const warnings: WaterWarnings = {};

    if (water?.ph !== undefined && water.ph !== "") {
        const value = parseFloat(water.ph);
        if (isNaN(value)) errors.ph = "Bitte eine Zahl eingeben";
        else if (value < 0 || value > 14) errors.ph = "pH-Wert muss zwischen 0 und 14 liegen";
        else if (value < 5.5) warnings.ph = "pH-Wert sehr niedrig: Nährstoffaufnahme beeinträchtigt";
        else if (value > 7.5) warnings.ph = "pH-Wert sehr hoch: Mikronährstoffmangel möglich";
    }

    if (water?.ec !== undefined && water.ec !== "") {
        const value = parseFloat(water.ec);
        if (isNaN(value)) errors.ec = "Bitte eine Zahl eingeben";
        else if (value < 0 || value > 10) errors.ec = "EC-Wert muss zwischen 0 und 10 liegen";
        else if (value < 0.5) warnings.ec = "EC-Wert sehr niedrig: Nährstoffmangel";
        else if (value > 3.5) warnings.ec = "EC-Wert sehr hoch: Gefahr von Nährstoffverbrennung";
    }

    if (water?.amount !== undefined && water.amount !== "") {
        const value = parseFloat(water.amount);
        if (isNaN(value)) errors.amount = "Bitte eine Zahl eingeben";
        else if (value <= 0) errors.amount = "Menge muss größer als 0 sein";
        else if (value > 100000) errors.amount = "Menge unrealistisch hoch";
        else if (value < 50) warnings.amount = "Sehr geringe Wassermenge";
        else if (value > 5000) warnings.amount = "Große Wassermenge – Pflanze nicht überwässern";
    }

    return { errors, warnings };
};

export interface EnvironmentErrors {
    name?: string;
    type?: string;
    location?: string;
}

export interface EnvironmentWarnings {
    name?: string;
    type?: string;
    location?: string;
}

export const validateEnvironment = (env: EnvironmentFormData): { errors: EnvironmentErrors; warnings: EnvironmentWarnings } => {
    const errors: EnvironmentErrors = {};
    const warnings: EnvironmentWarnings = {};

    if (!env.name || env.name.trim() === "") errors.name = "Name erforderlich";
    else if (env.name.length < 2) errors.name = "Name muss mindestens 2 Zeichen lang sein";
    else if (env.name.length > 30) warnings.name = "Name ist ziemlich lang, kürzer könnte besser sein";

    if (!env.type) errors.type = "Typ erforderlich";

    if (env.location && env.location.length > 50) errors.location = "Location zu lang (max. 50 Zeichen)";

    return { errors, warnings };
};

export interface PlantErrors {
    title?: string;
    species?: string;
    environmentId?: string;
}

export const validatePlant = (plant: { title: string; species?: string; environmentId: string }): PlantErrors => {
    const errors: PlantErrors = {};

    if (!plant.title || plant.title.trim() === "") errors.title = "Name erforderlich";
    else if (plant.title.length < 2) errors.title = "Name muss mindestens 2 Zeichen lang sein";

    if (plant.species && plant.species.length > 100) errors.species = "Art zu lang (max. 100 Zeichen)";

    if (!plant.environmentId || plant.environmentId.trim() === "") {
        errors.environmentId = "Environment erforderlich";
    }

    return errors;
};

export const validateLogin = (form: LoginFormData): LoginFormErrors => {
    const errors: LoginFormErrors = {};

    if (!form.email) errors.email = "Email erforderlich";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) errors.email = "Ungültige Email-Adresse";

    if (!form.password) errors.password = "Passwort erforderlich";
    else if (form.password.length < 4) errors.password = "Passwort muss mindestens 4 Zeichen lang sein";

    return errors;
};