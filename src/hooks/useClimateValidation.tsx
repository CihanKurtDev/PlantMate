import { useMemo } from "react";
import { ClimateDataInput } from "@/types/environment";
import { validateClimate, ClimateErrors, ClimateWarnings } from "@/helpers/validationUtils";
import { CultivationProfile } from "@/config/profiles";

export type { ClimateErrors, ClimateWarnings };

export const useClimateValidation = (climate?: ClimateDataInput, profile?: CultivationProfile): { errors: ClimateErrors; warnings: ClimateWarnings } => {
    return useMemo(() => validateClimate(climate, profile), [climate, profile]);
};