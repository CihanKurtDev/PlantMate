import { useMemo } from "react";
import { WaterDataInput } from "@/types/plant";
import { validateWaterForProfiles, WaterErrors, WaterWarnings } from "@/helpers/validationUtils";
import { CultivationProfile } from "@/config/profiles";

export type { WaterErrors, WaterWarnings };

export const useWaterValidation = (
    water?: WaterDataInput,
    profiles?: CultivationProfile | CultivationProfile[]
): { errors: WaterErrors; warnings: WaterWarnings } => {
    return useMemo(() => validateWaterForProfiles(water, profiles), [water, profiles]);
};