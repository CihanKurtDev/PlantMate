import { useMemo } from "react";
import { WaterDataInput } from "@/types/plant";
import { validateWater, WaterErrors, WaterWarnings } from "@/helpers/validationUtils";
import { CultivationProfile } from "@/config/profiles";

export type { WaterErrors, WaterWarnings };

interface RangeWarningDetail {
    label: string;
    severity: string;
    min: number;
    max: number;
    rawWarning: string;
}

const RANGE_PATTERN = /^(.+?):\s*Idealbereich\s+([\d.]+)[–-]([\d.]+)/;

function parseRangeWarning(label: string, warning: string): RangeWarningDetail | null {
    const match = warning.match(RANGE_PATTERN);
    if (!match) return null;
    return {
        label,
        severity: match[1].trim(),
        min: parseFloat(match[2]),
        max: parseFloat(match[3]),
        rawWarning: warning,
    };
}

function mergeRangeWarnings(
    profileWarnings: Array<{ label: string; warning: string }>
): string | undefined {
    if (profileWarnings.length === 0) return undefined;
    if (profileWarnings.length === 1) return profileWarnings[0].warning;

    const parsed = profileWarnings.map(({ label, warning }) =>
        parseRangeWarning(label, warning)
    );

    const allParsed = parsed.every((p): p is RangeWarningDetail => p !== null);

    if (allParsed) {
        const globalMin = Math.min(...parsed.map((p) => p!.min));
        const globalMax = Math.max(...parsed.map((p) => p!.max));
        const severity = parsed[0]!.severity;
        return `${severity}: Idealbereich ${globalMin}–${globalMax} (alle Profile)`;
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