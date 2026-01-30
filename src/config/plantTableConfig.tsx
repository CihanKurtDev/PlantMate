import { PlantTableRow } from "@/components/Table/adapters/plantTableAdapter";
import type { TableConfig } from "@/types/table";

export const plantTableConfig: TableConfig<PlantTableRow> = {
    title: "Pflanzen",
    searchKeys: ["title", "species", "environmentName"],
    filterKey: "environmentName",
    filters: [],
    columns: [
        {
            key: "title",
            displayText: "Name",
        },
        {
            key: "species",
            displayText: "Art",
        },
        {
            key: "environmentName",
            displayText: "Umgebung",
        },
        {
            key: "water",
            displayText: "pH",
            render: (water) => (
                <span>{water?.ph?.value} {water?.ph?.unit}</span>
            ),
        },
        {
            key: "water",
            displayText: "EC",
            render: (water) => (
                <span>{water?.ec?.value} {water?.ec?.unit}</span>
            ),
        },
    ],
};
