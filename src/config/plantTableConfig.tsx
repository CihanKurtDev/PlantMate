import { PlantTableRow } from "@/components/Table/adapters/plantTableAdapter";
import { daysSince, formatDateShort } from "@/helpers/date";
import type { TableConfig } from "@/types/table";
import { AlertCircle, CalendarClock, Droplet, Inbox } from "lucide-react";

const EMPTY = <span style={{ color: "#6b7280" }}>—</span>;

const warnColor = "#b45309";
const dangerColor = "#b91c1c";

const getWarnStyle = (condition: boolean) =>
    condition ? { color: warnColor } : undefined;


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
        filters: [
        {
            displayText: "Alle",
            icon: <Droplet size={16} />
        },
        {
            displayText: "Braucht Wasser",
            icon: <AlertCircle size={16} />,
            customSearchFunc: (row) => {
                const last = getLastWatering(row.events);
                if (!last) return true;
                return daysSince(last.timestamp) > 7;
            },
        },
        {
            displayText: "PH",
            icon: <AlertCircle size={16} />,
            customSearchFunc: (row) => {
                const value = row.water?.ph?.value;
                return value !== undefined && (value < 5.5 || value > 7.5);
            },
        },
        {
            displayText: "EC",
            icon: <AlertCircle size={16} />,
            customSearchFunc: (row) => {
                const value = row.water?.ec?.value;
                return value !== undefined && (value < 0.5 || value > 3.5);
            },
        },
        {
            displayText: "Keine Events",
            icon: <Inbox size={16} />,
            customSearchFunc: (row) => !row.events || row.events.length === 0,
        },
        {
            displayText: "Ungesund",
            customSearchFunc: (row) => {
                const ph = row.water?.ph?.value;
                const ec = row.water?.ec?.value;
                const last = getLastWatering(row.events);

                const waterNeeded = !last || daysSince(last.timestamp) > 7;
                const phBad = ph !== undefined && (ph < 5.5 || ph > 7.5);
                const ecBad = ec !== undefined && (ec < 0.5 || ec > 3.5);
                const noEvents = !row.events || row.events.length === 0;

                return waterNeeded || phBad || ecBad || noEvents;
            },
        },
    ],


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

                const formattedContent =
                    `${last.type.charAt(0).toUpperCase() + last.type.slice(1).toLowerCase()} · ${formatDateShort(new Date(last.timestamp))}`;

                return (
                    <span style={{ display: "flex", alignItems: "center", gap: 6 }}>
                        <CalendarClock size={18} />
                        <span style={{ fontSize: "0.95em", color: "#333" }}>{formattedContent}</span>
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
                        <Droplet size={18} />
                        {formatDateShort(new Date(lastWatering.timestamp))}
                    </span>
                );
            },
        },
    ],
};