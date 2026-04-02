import { useMemo } from "react";
import { ClimateDataInput } from "@/types/environment";
import { validateClimateForProfiles, ClimateErrors, ClimateWarnings } from "@/helpers/validationUtils";
import { CultivationProfile } from "@/config/profiles";

export type { ClimateErrors, ClimateWarnings };

export const useClimateValidation = (
    climate?: ClimateDataInput,
    profiles?: CultivationProfile | CultivationProfile[]
): { errors: ClimateErrors; warnings: ClimateWarnings } => {
    return useMemo(() => validateClimateForProfiles(climate, profiles), [climate, profiles]);
};