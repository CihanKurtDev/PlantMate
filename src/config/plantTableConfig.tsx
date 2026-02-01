import { PlantTableRow } from "@/components/Table/adapters/plantTableAdapter";
import type { TableConfig } from "@/types/table";
import { CalendarClock, Droplet } from "lucide-react";

const EMPTY = <span style={{ color: "#6b7280" }}>—</span>;

const warnColor = "#b45309";
const dangerColor = "#b91c1c";

const getWarnStyle = (condition: boolean) =>
    condition ? { color: warnColor } : undefined;

const formatDate = (ts?: number) =>
    ts ? new Date(ts).toLocaleDateString() : "-";

const getLastEvent = (events?: PlantTableRow["events"]) =>
    events && events.length > 0 ? events[events.length - 1] : undefined;

const getLastWatering = (events?: PlantTableRow["events"]) =>
    events
        ?.slice()
        .reverse()
        .find((e) => e.type === "WATERING");

export const plantTableConfig: TableConfig<PlantTableRow> = {
    title: "Pflanzen",
    searchKeys: ["title", "species", "environmentName"],
    filterKey: "environmentName",
    filters: [],

    columns: [
        {
            key: "title",
            displayText: "Name",
            render: (value) => value ? <span>{value}</span> : EMPTY,
        },
        {
            key: "species",
            displayText: "Art",
            render: (value) => value ? <span>{value}</span> : EMPTY,
        },
        {
            key: "environmentName",
            displayText: "Umgebung",
            render: (value) => value ? <span>{value}</span> : EMPTY,
        },
        {
            key: "water",
            displayText: "pH",
            render: (water) => {
                const value = water?.ph?.value;
                const unit = water?.ph?.unit;

                if (value === undefined) return EMPTY;

                return (
                    <span style={getWarnStyle(value < 5.5 || value > 7.5)}>
                        {value} {unit ?? ""}
                    </span>
                );
            },
        },
        {
            key: "water",
            displayText: "EC",
            render: (water) => {
                const value = water?.ec?.value;
                const unit = water?.ec?.unit;

                if (value === undefined) return EMPTY;

                return (
                    <span style={getWarnStyle(value < 0.5 || value > 3.5)}>
                        {value} {unit ?? ""}
                    </span>
                );
            },
        },
        {
            key: "events",
            displayText: "Letztes Event",
            render: (_, row) => {
                const last = getLastEvent(row?.events);
                if (!last) return EMPTY;

                return (
                    <span style={{ display: "flex", alignItems: "center", gap: 4 }}>
                        <CalendarClock size={16} />
                        {last.type} · {formatDate(last.timestamp)}
                    </span>
                );
            },
        },
        {
            key: "events",
            displayText: "Zuletzt gegossen",
            render: (_, row) => {
                const lastWatering = getLastWatering(row?.events);
                if (!lastWatering) return EMPTY;

                const daysSince =
                    (Date.now() - lastWatering.timestamp) /
                    (1000 * 60 * 60 * 24);

                return (
                    <span
                        style={{
                            display: "flex",
                            alignItems: "center",
                            gap: 4,
                            ...(daysSince > 10 ? { color: dangerColor } : {}),
                        }}
                    >
                        <Droplet size={16} />
                        {formatDate(lastWatering.timestamp)}
                    </span>
                );
            },
        },
    ],
};