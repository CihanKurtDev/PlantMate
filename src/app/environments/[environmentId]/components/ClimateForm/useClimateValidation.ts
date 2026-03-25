import { useMemo } from "react";
import { ClimateDataInput } from "@/types/environment";
import { validateClimate, ClimateErrors, ClimateWarnings } from "@/helpers/validationUtils";
import { CultivationProfile } from "@/config/profiles";

export type { ClimateErrors, ClimateWarnings };

interface RangeWarningDetail {
    label: string;
    severity: string;
    min: number;
    max: number;
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

export const useClimateValidation = (
    climate?: ClimateDataInput,
    profiles?: CultivationProfile | CultivationProfile[]
): { errors: ClimateErrors; warnings: ClimateWarnings } => {
    return useMemo(() => {
        const profileList = Array.isArray(profiles)
            ? profiles
            : ([profiles].filter(Boolean) as CultivationProfile[]);

        if (profileList.length <= 1) {
            return validateClimate(climate, profileList[0]);
        }

        const { errors } = validateClimate(climate, profileList[0]);

        const collected: Record<
            "temp" | "humidity" | "co2" | "vpd",
            Array<{ label: string; warning: string }>
        > = {
            temp: [],
            humidity: [],
            co2: [],
            vpd: [],
        };

        for (const profile of profileList) {
            const { warnings } = validateClimate(climate, profile);
            if (warnings.temp) collected.temp.push({ label: profile.label, warning: warnings.temp });
            if (warnings.humidity) collected.humidity.push({ label: profile.label, warning: warnings.humidity });
            if (warnings.co2) collected.co2.push({ label: profile.label, warning: warnings.co2 });
            if (warnings.vpd) collected.vpd.push({ label: profile.label, warning: warnings.vpd });
        }

        const warnings: ClimateWarnings = {
            temp: mergeRangeWarnings(collected.temp),
            humidity: mergeRangeWarnings(collected.humidity),
            co2: mergeRangeWarnings(collected.co2),
            vpd: mergeRangeWarnings(collected.vpd),
        };

        return { errors, warnings };
    }, [climate, profiles]);
};