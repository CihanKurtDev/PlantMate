import { useMemo } from "react";
import { WaterDataInput } from "@/types/plant";
import { validateWater, WaterErrors, WaterWarnings } from "@/helpers/validaionUtils";

export const useWaterValidation = (water?: WaterDataInput): { errors: WaterErrors; warnings: WaterWarnings } => {
    return useMemo(() => validateWater(water), [water]);
};