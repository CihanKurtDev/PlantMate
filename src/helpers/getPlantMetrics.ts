import { PlantData } from "@/types/plant";
import { MetricItem } from "@/components/MetricGrid/MetricGrid";

export function getPlantMetrics(plant: PlantData): MetricItem[] {
    const latest = plant.historical
        ?.slice()
        .sort((a, b) => b.timestamp - a.timestamp)[0];

    return [
        {
            key: "ph",
            value: latest?.water?.ph
                ? `${latest.water.ph.value} pH`
                : "0 pH",
        },
        {
            key: "ec",
            value: latest?.water?.ec
                ? `${latest.water.ec.value} mS/cm`
                : "0 mS/cm",
        },
        {
            key: "height",
            value: latest?.height
                ? `${latest.height.value} cm`
                : "0 cm",
        },
    ];
}