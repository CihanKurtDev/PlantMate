import { PlantData } from "@/types/plant";
import { MetricItem } from "@/components/MetricGrid/MetricGrid";

export function getPlantMetrics(plant: PlantData): MetricItem[] {
    const latest = plant.historical
        ?.slice()
        .sort((a, b) => b.timestamp - a.timestamp)[0];

    const items: MetricItem[] = [];

    if (latest?.water?.ph) {
        items.push({ key: "ph", value: `${latest.water.ph.value} pH` });
    }
    if (latest?.water?.ec) {
        items.push({ key: "ec", value: `${latest.water.ec.value} mS/cm` });
    }
    if (latest?.height) {
        items.push({ key: "height", value: `${latest.height.value} cm` });
    }

    return items;
}