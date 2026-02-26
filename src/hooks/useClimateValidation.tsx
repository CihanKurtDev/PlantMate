import { useMemo } from "react";
import { ClimateDataInput } from "@/types/environment";
import { validateClimate, ClimateErrors, ClimateWarnings } from "@/helpers/validationUtils";

export type { ClimateErrors, ClimateWarnings };

export const useClimateValidation = (climate?: ClimateDataInput): { errors: ClimateErrors; warnings: ClimateWarnings } => {
    return useMemo(() => validateClimate(climate), [climate]);
};