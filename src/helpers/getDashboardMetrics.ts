import { EnvironmentData } from "@/types/environment";
import { PlantData } from "@/types/plant";
import { MetricItem } from "@/components/MetricGrid/MetricGrid";
import { formatTimestamp } from "./date";
import { getProfile, getProfileMetric, ProfileKey } from "@/config/profiles";

export function getDashboardMetrics(
    environments: EnvironmentData[],
    plants: PlantData[]
): MetricItem[] {
    const envsWithWarning = environments.filter(env => {
        const latest = env.historical
            ?.slice()
            .sort((a, b) => b.timestamp - a.timestamp)[0];
        if (!latest) return false;

        const envPlants = plants.filter(p => p.environmentId === env.id);
        const uniqueProfileKeys = [...new Set(envPlants.map(p => p.profile).filter(Boolean))] as ProfileKey[];
        const profiles = uniqueProfileKeys.length > 0
            ? uniqueProfileKeys.map(getProfile)
            : [getProfile("generic")];

        const { temp, humidity, co2 } = latest.climate;

        const isBadForProfiles = (value: number | null | undefined, key: "temp" | "humidity" | "co2"): boolean => {
            if (value === null || value === undefined) return false;
            return profiles.some(profile => {
                const metric = getProfileMetric(profile, "climate", key);
                return metric !== undefined && (value < metric.idealMin || value > metric.idealMax);
            });
        };

        return (
            isBadForProfiles(temp?.value ?? null, "temp") ||
            isBadForProfiles(humidity?.value ?? null, "humidity") ||
            isBadForProfiles(co2?.value ?? null, "co2")
        );
    }).length;

    const criticalPlants = plants.filter(plant => {
        const latest = plant.historical
            ?.slice()
            .sort((a, b) => b.timestamp - a.timestamp)[0];
        if (!latest?.water) return false;

        const profile = getProfile(plant.profile);

        const phMetric = getProfileMetric(profile, 'water', 'ph');
        const ecMetric = getProfileMetric(profile, 'water', 'ec');

        return (
            (latest.water.ph && phMetric && (latest.water.ph.value < phMetric.idealMin || latest.water.ph.value > phMetric.idealMax)) ||
            (latest.water.ec && ecMetric && (latest.water.ec.value < ecMetric.idealMin || latest.water.ec.value > ecMetric.idealMax))
        );
    }).length;

    const lastTimestamp = environments
        .flatMap(e => e.historical ?? [])
        .sort((a, b) => b.timestamp - a.timestamp)[0]?.timestamp ?? null;

    return [
        {
            key: 'environments',
            value: String(environments.length),
            subValue: envsWithWarning > 0 ? `${envsWithWarning} mit Warnung` : 'Alle OK',
        },
        {
            key: 'plants',
            value: String(plants.length),
            subValue: criticalPlants > 0 ? `${criticalPlants} kritisch` : 'Alle OK',
        },
        {
            key: 'warnings',
            value: String(envsWithWarning + criticalPlants),
            subValue: (envsWithWarning + criticalPlants) > 0 ? 'Handlung erforderlich' : 'Keine Warnungen',
        },
        {
            key: 'lastMeasurement',
            value: lastTimestamp ? formatTimestamp(lastTimestamp) : '–',
            subValue: 'Letzte Messung',
        },
    ];
}