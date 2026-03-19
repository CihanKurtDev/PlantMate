import { useMemo } from "react";
import { WaterDataInput } from "@/types/plant";
import { validateWater, WaterErrors, WaterWarnings } from "@/helpers/validationUtils";
import { CultivationProfile } from "@/config/profiles";

export type { WaterErrors, WaterWarnings };

export const useWaterValidation = (
    water?: WaterDataInput,
    profiles?: CultivationProfile | CultivationProfile[]
): { errors: WaterErrors; warnings: WaterWarnings } => {
    return useMemo(() => {
        const profileList = Array.isArray(profiles) ? profiles : [profiles].filter(Boolean) as CultivationProfile[];

        if (profileList.length <= 1) {
            return validateWater(water, profileList[0]);
        }

        // Errors sind profilunabhängig (nur LIMITS), einmal reicht
        const { errors } = validateWater(water, profileList[0]);

        // Warnungen: alle Profile prüfen, alle zutreffenden sammeln
        const warningMessages: { ph: string[]; ec: string[]; amount: string[] } = {
            ph: [],
            ec: [],
            amount: [],
        };

        for (const profile of profileList) {
            const { warnings } = validateWater(water, profile);
            if (warnings.ph) warningMessages.ph.push(`${profile.label}: ${warnings.ph}`);
            if (warnings.ec) warningMessages.ec.push(`${profile.label}: ${warnings.ec}`);
            if (warnings.amount) warningMessages.amount.push(warnings.amount);
        }

        const warnings: WaterWarnings = {
            ph: [...new Set(warningMessages.ph)].join(" | ") || undefined,
            ec: [...new Set(warningMessages.ec)].join(" | ") || undefined,
            amount: [...new Set(warningMessages.amount)][0],
        };

        return { errors, warnings };
    }, [water, profiles]);
};