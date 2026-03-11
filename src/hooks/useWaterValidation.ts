import { useMemo } from "react";
import { WaterDataInput } from "@/types/plant";
import { validateWater, WaterErrors, WaterWarnings } from "@/helpers/validationUtils";
import { CultivationProfile } from "@/config/profiles";

export type { WaterErrors, WaterWarnings };

export const useWaterValidation = (water?: WaterDataInput, profile?: CultivationProfile): { errors: WaterErrors; warnings: WaterWarnings } => {
    return useMemo(() => validateWater(water, profile), [water, profile]);
};