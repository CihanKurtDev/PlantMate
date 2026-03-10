import { EnvironmentData } from "@/types/environment";
import { PlantData } from "@/types/plant";
import { MetricItem } from "@/components/MetricGrid/MetricGrid";
import { formatTimestamp } from "./date"; 

export function getDashboardMetrics(
    environments: EnvironmentData[],
    plants: PlantData[]
): MetricItem[] {
    const envsWithWarning = environments.filter(env => {
        const latest = env.historical
            ?.slice()
            .sort((a, b) => b.timestamp - a.timestamp)[0];
        if (!latest) return false;
        const { temp, humidity, co2 } = latest.climate;
        return (
            (temp && temp.value > 28) ||
            (humidity && (humidity.value < 40 || humidity.value > 70)) ||
            (co2 && co2.value > 800)
        );
    }).length;

    const criticalPlants = plants.filter(plant => {
        const latest = plant.historical
            ?.slice()
            .sort((a, b) => b.timestamp - a.timestamp)[0];
        if (!latest?.water) return false;
        return (
            (latest.water.ph && (latest.water.ph.value < 5.5 || latest.water.ph.value > 7.0)) ||
            (latest.water.ec && latest.water.ec.value > 3.0)
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