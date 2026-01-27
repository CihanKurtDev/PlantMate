import { ClimateData } from "@/types/environment";
import { useMemo } from "react";

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

export const useClimateValidation = (climate?: ClimateData) => {
    const errors: ClimateErrors = useMemo(() => {
        const errs: ClimateErrors = {};

        if (climate?.temp?.value !== undefined) {
            if (isNaN(climate.temp.value)) errs.temp = "Bitte eine Zahl eingeben";
            else if (climate.temp.value < 0 || climate.temp.value > 50) errs.temp = "Temperatur unrealistisch";
        }

        if (climate?.humidity?.value !== undefined) {
            if (isNaN(climate.humidity.value)) errs.humidity = "Bitte eine Zahl eingeben";
            else if (climate.humidity.value < 0 || climate.humidity.value > 100) errs.humidity = "Feuchtigkeit unrealistisch";
        }

        if (climate?.co2?.value !== undefined) {
            if (isNaN(climate.co2.value)) errs.co2 = "Bitte eine Zahl eingeben";
            else if (climate.co2.value < 0 || climate.co2.value > 5000) errs.co2 = "CO₂-Wert unrealistisch";
        }

        if (climate?.vpd?.value !== undefined) {
            if (isNaN(climate.vpd.value)) errs.vpd = "Bitte eine Zahl eingeben";
            else if (climate.vpd.value < 0 || climate.vpd.value > 5) errs.vpd = "VPD unrealistisch";
        }

        return errs;
    }, [climate]);

    const warnings: ClimateWarnings = useMemo(() => {
        const warn: ClimateWarnings = {};

        if (!errors.temp && climate?.temp?.value !== undefined) {
            if (climate.temp.value < 18) warn.temp = "Temperatur sehr niedrig";
            else if (climate.temp.value > 30) warn.temp = "Temperatur sehr hoch";
        }

        if (!errors.humidity && climate?.humidity?.value !== undefined) {
            if (climate.humidity.value < 40) warn.humidity = "Luftfeuchtigkeit sehr niedrig";
            else if (climate.humidity.value > 80) warn.humidity = "Luftfeuchtigkeit sehr hoch";
        }

        return warn;
    }, [climate, errors]);

    return { errors, warnings };
};
