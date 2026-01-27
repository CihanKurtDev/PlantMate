import { useMemo } from "react";
import { WaterData } from "@/types/plant";
import { validateWater, WaterErrors, WaterWarnings } from "@/helpers/validaionUtils";

export const useWaterValidation = (water?: WaterData): { errors: WaterErrors; warnings: WaterWarnings } => {
    return useMemo(() => validateWater(water), [water]);
};