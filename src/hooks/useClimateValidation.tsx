import { validateClimate } from "@/helpers/validaionUtils";
import { ClimateDataInput } from "@/types/environment";
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

export const useClimateValidation = (climate?: ClimateDataInput): { errors: ClimateErrors; warnings: ClimateWarnings } => {
    return useMemo(() => validateClimate(climate), [climate]);
};
