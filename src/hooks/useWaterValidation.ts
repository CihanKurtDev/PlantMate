import { useMemo } from "react";
import { WaterDataInput } from "@/types/plant";
import { validateWater, WaterErrors, WaterWarnings } from "@/helpers/validationUtils";
import { CultivationProfile } from "@/config/profiles";

export type { WaterErrors, WaterWarnings };

function mergeRangeWarnings(profileWarnings: Array<{ label: string; warning: string }>): string | undefined {
    if (profileWarnings.length === 0) return undefined;

    const rangePattern = /Idealbereich\s+([\d.]+)[–-]([\d.]+)/;

    const ranges = profileWarnings
        .map(({ warning }) => warning.match(rangePattern))
        .filter(Boolean)
        .map((match) => ({ min: parseFloat(match![1]), max: parseFloat(match![2]) }));

    if (ranges.length === profileWarnings.length && ranges.length > 1) {
        const globalMin = Math.min(...ranges.map((r) => r.min));
        const globalMax = Math.max(...ranges.map((r) => r.max));
        const severityPhrase = profileWarnings[0].warning.match(/^([\w-]+\s[\w-]+)/)?.[1] ?? "Außerhalb";
        return `${severityPhrase}: Idealbereich ${globalMin}–${globalMax} (alle Profile)`;
    }

    return profileWarnings.map(({ label, warning }) => `${label}: ${warning}`).join(" | ");
}

export const useWaterValidation = (
    water?: WaterDataInput,
    profiles?: CultivationProfile | CultivationProfile[]
): { errors: WaterErrors; warnings: WaterWarnings } => {
    return useMemo(() => {
        const profileList = Array.isArray(profiles)
            ? profiles
            : ([profiles].filter(Boolean) as CultivationProfile[]);

        if (profileList.length <= 1) {
            return validateWater(water, profileList[0]);
        }

        const { errors } = validateWater(water, profileList[0]);

        const collected: Record<"ph" | "ec" | "amount", Array<{ label: string; warning: string }>> = {
            ph: [],
            ec: [],
            amount: [],
        };

        for (const profile of profileList) {
            const { warnings } = validateWater(water, profile);
            if (warnings.ph) collected.ph.push({ label: profile.label, warning: warnings.ph });
            if (warnings.ec) collected.ec.push({ label: profile.label, warning: warnings.ec });
            if (warnings.amount) collected.amount.push({ label: profile.label, warning: warnings.amount });
        }

        const warnings: WaterWarnings = {
            ph: mergeRangeWarnings(collected.ph),
            ec: mergeRangeWarnings(collected.ec),
            amount: collected.amount[0]?.warning,
        };

        return { errors, warnings };
    }, [water, profiles]);
};