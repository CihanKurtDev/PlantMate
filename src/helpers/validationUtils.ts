import { ClimateDataInput, EnvironmentFormData } from "@/types/environment";
import { WaterDataInput } from "@/types/plant";
import { LoginFormData, LoginFormErrors } from "@/types/auth";
import { LIMITS } from "@/config/thresholds";
import { CultivationProfile, getProfile, getProfileMetric } from "@/config/profiles";

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

export const validateClimate = (climate?: ClimateDataInput, profile?: CultivationProfile): { errors: ClimateErrors; warnings: ClimateWarnings } => {
    const errors: ClimateErrors = {};
    const warnings: ClimateWarnings = {};
    const p = profile ?? getProfile(null);

    const tempMetric = getProfileMetric(p, 'climate', 'temp');
    const humidityMetric = getProfileMetric(p, 'climate', 'humidity');
    const co2Metric = getProfileMetric(p, 'climate', 'co2');
    const vpdMetric = getProfileMetric(p, 'climate', 'vpd');

    if (climate?.temp?.value) {
        const value = parseFloat(climate.temp.value);
        if (isNaN(value)) errors.temp = "Bitte eine Zahl eingeben";
        else if (value < LIMITS.climate.temp.min || value > LIMITS.climate.temp.max) errors.temp = "Temperatur unrealistisch";
        else if (tempMetric && (value < tempMetric.idealMin || value > tempMetric.idealMax)) warnings.temp = `Temperatur außerhalb des Idealbereichs (${tempMetric.idealMin}–${tempMetric.idealMax} °C)`;
    }

    if (climate?.humidity) {
        const value = parseFloat(climate.humidity);
        if (isNaN(value)) errors.humidity = "Bitte eine Zahl eingeben";
        else if (value < LIMITS.climate.humidity.min || value > LIMITS.climate.humidity.max) errors.humidity = "Feuchtigkeit unrealistisch";
        else if (humidityMetric && (value < humidityMetric.idealMin || value > humidityMetric.idealMax)) warnings.humidity = `Luftfeuchtigkeit außerhalb des Idealbereichs (${humidityMetric.idealMin}–${humidityMetric.idealMax} %)`;
    }

    if (climate?.co2) {
        const value = parseFloat(climate.co2);
        if (isNaN(value)) errors.co2 = "Bitte eine Zahl eingeben";
        else if (value < LIMITS.climate.co2.min || value > LIMITS.climate.co2.max) errors.co2 = "CO₂-Wert unrealistisch";
        else if (co2Metric && (value < co2Metric.idealMin || value > co2Metric.idealMax)) warnings.co2 = `CO₂ außerhalb des Idealbereichs (${co2Metric.idealMin}–${co2Metric.idealMax} ppm)`;
    }

    if (climate?.vpd) {
        const value = parseFloat(climate.vpd);
        if (isNaN(value)) errors.vpd = "Bitte eine Zahl eingeben";
        else if (value < LIMITS.climate.vpd.min || value > LIMITS.climate.vpd.max) errors.vpd = "VPD unrealistisch";
        else if (vpdMetric && (value < vpdMetric.idealMin || value > vpdMetric.idealMax)) warnings.vpd = `VPD außerhalb des Idealbereichs (${vpdMetric.idealMin}–${vpdMetric.idealMax} kPa)`;
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

export const validateWater = (water?: WaterDataInput, profile?: CultivationProfile): { errors: WaterErrors; warnings: WaterWarnings } => {
    const errors: WaterErrors = {};
    const warnings: WaterWarnings = {};
    const p = profile ?? getProfile(null);

    const phMetric = getProfileMetric(p, 'water', 'ph');
    const ecMetric = getProfileMetric(p, 'water', 'ec');

    if (water?.ph !== undefined && water.ph !== "") {
        const value = parseFloat(water.ph);
        if (isNaN(value)) errors.ph = "Bitte eine Zahl eingeben";
        else if (value < LIMITS.water.ph.min || value > LIMITS.water.ph.max) errors.ph = "pH-Wert muss zwischen 0 und 14 liegen";
        else if (phMetric && value < phMetric.idealMin) warnings.ph = `pH-Wert sehr niedrig: Idealbereich ${phMetric.idealMin}–${phMetric.idealMax}`;
        else if (phMetric && value > phMetric.idealMax) warnings.ph = `pH-Wert sehr hoch: Idealbereich ${phMetric.idealMin}–${phMetric.idealMax}`;
    }

    if (water?.ec !== undefined && water.ec !== "") {
        const value = parseFloat(water.ec);
        if (isNaN(value)) errors.ec = "Bitte eine Zahl eingeben";
        else if (value < LIMITS.water.ec.min || value > LIMITS.water.ec.max) errors.ec = "EC-Wert muss zwischen 0 und 10 liegen";
        else if (ecMetric && value < ecMetric.idealMin) warnings.ec = `EC-Wert sehr niedrig: Idealbereich ${ecMetric.idealMin}–${ecMetric.idealMax}`;
        else if (ecMetric && value > ecMetric.idealMax) warnings.ec = `EC-Wert sehr hoch: Idealbereich ${ecMetric.idealMin}–${ecMetric.idealMax}`;
    }

    if (water?.amount !== undefined && water.amount !== "") {
        const value = parseFloat(water.amount);
        if (isNaN(value)) errors.amount = "Bitte eine Zahl eingeben";
        else if (value <= 0) errors.amount = "Menge muss größer als 0 sein";
        else if (value > LIMITS.water.amount.max) errors.amount = "Menge unrealistisch hoch";
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