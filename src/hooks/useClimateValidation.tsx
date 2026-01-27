import { validateClimate } from "@/helpers/validaionUtils";
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

export const useClimateValidation = (climate?: ClimateData): { errors: ClimateErrors; warnings: ClimateWarnings } => {
    return useMemo(() => validateClimate(climate), [climate]);
};
