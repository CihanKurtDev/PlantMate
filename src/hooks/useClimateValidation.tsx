import { useMemo } from "react";
import { ClimateDataInput } from "@/types/environment";
import { validateClimate, ClimateErrors, ClimateWarnings } from "@/helpers/validationUtils";
import { CultivationProfile } from "@/config/profiles";

export type { ClimateErrors, ClimateWarnings };

export const useClimateValidation = (
    climate?: ClimateDataInput,
    profiles?: CultivationProfile | CultivationProfile[]
): { errors: ClimateErrors; warnings: ClimateWarnings } => {
    return useMemo(() => {
        const profileList = Array.isArray(profiles)
            ? profiles
            : [profiles].filter(Boolean) as CultivationProfile[];

        if (profileList.length <= 1) {
            return validateClimate(climate, profileList[0]);
        }

        const { errors } = validateClimate(climate, profileList[0]);

        const warningMessages: { temp: string[]; humidity: string[]; co2: string[]; vpd: string[] } = {
            temp: [],
            humidity: [],
            co2: [],
            vpd: [],
        };

        for (const profile of profileList) {
            const { warnings } = validateClimate(climate, profile);
            if (warnings.temp) warningMessages.temp.push(`${profile.label}: ${warnings.temp}`);
            if (warnings.humidity) warningMessages.humidity.push(`${profile.label}: ${warnings.humidity}`);
            if (warnings.co2) warningMessages.co2.push(`${profile.label}: ${warnings.co2}`);
            if (warnings.vpd) warningMessages.vpd.push(`${profile.label}: ${warnings.vpd}`);
        }

        const warnings: ClimateWarnings = {
            temp: [...new Set(warningMessages.temp)].join(" | ") || undefined,
            humidity: [...new Set(warningMessages.humidity)].join(" | ") || undefined,
            co2: [...new Set(warningMessages.co2)].join(" | ") || undefined,
            vpd: [...new Set(warningMessages.vpd)].join(" | ") || undefined,
        };

        return { errors, warnings };
    }, [climate, profiles]);
};