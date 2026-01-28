import { ClimateDataInput } from "@/types/environment";
import { WaterDataInput } from "@/types/plant";


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

export const validateClimate = (climate?: ClimateDataInput) => {
    const errors: Record<string, string> = {};
    const warnings: Record<string, string> = {};

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
        const phValue = parseFloat(water.ph);
        
        if (isNaN(phValue)) {
            errors.ph = "Bitte eine Zahl eingeben";
        } else if (phValue < 0 || phValue > 14) {
            errors.ph = "pH-Wert muss zwischen 0 und 14 liegen";
        } else {
            if (phValue < 5.5) warnings.ph = "pH-Wert sehr niedrig: Nährstoffaufnahme beeinträchtigt";
            else if (phValue > 7.5) warnings.ph = "pH-Wert sehr hoch: Mikronährstoffmangel möglich";
        }
    }

    if (water?.ec !== undefined && water.ec !== "") {
        const ecValue = parseFloat(water.ec);
        
        if (isNaN(ecValue)) {
            errors.ec = "Bitte eine Zahl eingeben";
        } else if (ecValue < 0 || ecValue > 10) {
            errors.ec = "EC-Wert muss zwischen 0 und 10 liegen";
        } else {
            if (ecValue < 0.5) warnings.ec = "EC-Wert sehr niedrig: Nährstoffmangel";
            else if (ecValue > 3.5) warnings.ec = "EC-Wert sehr hoch: Gefahr von Nährstoffverbrennung";
        }
    }

    if (water?.amount !== undefined && water.amount !== "") {
        const amountValue = parseFloat(water.amount);
        
        if (isNaN(amountValue)) {
            errors.amount = "Bitte eine Zahl eingeben";
        } else if (amountValue <= 0) {
            errors.amount = "Menge muss größer als 0 sein";
        } else if (amountValue > 100000) {
            errors.amount = "Menge unrealistisch hoch";
        } else {
            if (amountValue < 50) {
                warnings.amount = "Sehr geringe Wassermenge";
            } else if (amountValue > 5000) {
                warnings.amount = "Große Wassermenge – Pflanze nicht überwässern";
            }
        }
    }

    return { errors, warnings };
};