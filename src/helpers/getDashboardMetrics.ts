import { EnvironmentData } from "@/types/environment";
import { PlantData } from "@/types/plant";
import { MetricItem } from "@/components/MetricGrid/MetricGrid";
import { formatTimestamp } from "./date";
import { getProfile, getProfileMetric } from "@/config/profiles";

export function getDashboardMetrics(
    environments: EnvironmentData[],
    plants: PlantData[]
): MetricItem[] {
    const envsWithWarning = environments.filter(env => {
        const latest = env.historical
            ?.slice()
            .sort((a, b) => b.timestamp - a.timestamp)[0];
        if (!latest) return false;

        const profile = getProfile(env.profile);
        const { temp, humidity, co2 } = latest.climate;

        const tempMetric = getProfileMetric(profile, 'climate', 'temp');
        const humidityMetric = getProfileMetric(profile, 'climate', 'humidity');
        const co2Metric = getProfileMetric(profile, 'climate', 'co2');

        return (
            (temp && tempMetric && (temp.value < tempMetric.idealMin || temp.value > tempMetric.idealMax)) ||
            (humidity && humidityMetric && (humidity.value < humidityMetric.idealMin || humidity.value > humidityMetric.idealMax)) ||
            (co2 && co2Metric && (co2.value < co2Metric.idealMin || co2.value > co2Metric.idealMax))
        );
    }).length;

    const criticalPlants = plants.filter(plant => {
        const latest = plant.historical
            ?.slice()
            .sort((a, b) => b.timestamp - a.timestamp)[0];
        if (!latest?.water) return false;

        const environment = environments.find(e => e.id === plant.environmentId);
        const profile = getProfile(environment?.profile);

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