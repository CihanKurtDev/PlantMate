import { ClimateData } from "@/types/environment";
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

export const validateClimate = (climate?: ClimateData): { errors: ClimateErrors; warnings: ClimateWarnings } => {
    const errors: ClimateErrors = {};
    const warnings: ClimateWarnings = {};

    if (climate?.temp?.value !== undefined) {
        const tempValue = climate.temp.value;
        
        if (typeof tempValue !== 'number' || isNaN(tempValue)) {
            errors.temp = "Bitte eine Zahl eingeben";
        } else if (tempValue < 0 || tempValue > 50) {
            errors.temp = "Temperatur unrealistisch";
        } else {
            if (tempValue < 18) warnings.temp = "Temperatur sehr niedrig";
            else if (tempValue > 30) warnings.temp = "Temperatur sehr hoch";
        }
    }

    if (climate?.humidity?.value !== undefined) {
        const humValue = climate.humidity.value;
        
        if (typeof humValue !== 'number' || isNaN(humValue)) {
            errors.humidity = "Bitte eine Zahl eingeben";
        } else if (humValue < 0 || humValue > 100) {
            errors.humidity = "Feuchtigkeit unrealistisch";
        } else {
            if (humValue < 40) warnings.humidity = "Luftfeuchtigkeit sehr niedrig";
            else if (humValue > 80) warnings.humidity = "Luftfeuchtigkeit sehr hoch";
        }
    }

    if (climate?.co2?.value !== undefined) {
        const co2Value = climate.co2.value;
        
        if (typeof co2Value !== 'number' || isNaN(co2Value)) {
            errors.co2 = "Bitte eine Zahl eingeben";
        } else if (co2Value < 0 || co2Value > 5000) {
            errors.co2 = "CO₂-Wert unrealistisch";
        }
    }

    if (climate?.vpd?.value !== undefined) {
        const vpdValue = climate.vpd.value;
        
        if (typeof vpdValue !== 'number' || isNaN(vpdValue)) {
            errors.vpd = "Bitte eine Zahl eingeben";
        } else if (vpdValue < 0 || vpdValue > 5) {
            errors.vpd = "VPD unrealistisch";
        }
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