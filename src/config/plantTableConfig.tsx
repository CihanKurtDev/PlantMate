import { PlantTableRow } from "@/components/Table/adapters/plantTableAdapter";
import { daysSince, formatDateShort } from "@/helpers/date";
import type { TableConfig } from "@/types/table";
import { ActivityIcon, AlertCircle, CalendarClock, Droplet, Inbox } from "lucide-react";
import { JSX } from "react";

const EMPTY = <span style={{ color: "#6b7280" }}>—</span>;

const warnColor = "#b45309";
const dangerColor = "#b91c1c";

const getWarnStyle = (condition: boolean) =>
    condition ? { color: warnColor } : undefined;


export const getLastEvent = (events?: PlantTableRow["events"]) =>
    events && events.length > 0 ? events[events.length - 1] : undefined;

export const getLastWatering = (events?: PlantTableRow["events"]) =>
    events
        ?.slice()
        .reverse()
        .find((e) => e.type === "WATERING");

const extractPH = (row: PlantTableRow) => row.water?.ph?.value ?? null;
const extractEC = (row: PlantTableRow) => row.water?.ec?.value ?? null;
const extractLastEventTime = (row: PlantTableRow) => getLastEvent(row.events)?.timestamp ?? 0;
const extractLastWateringTime = (row: PlantTableRow) => getLastWatering(row.events)?.timestamp ?? 0;

export const plantTableConfig: TableConfig<PlantTableRow> = {
    title: "Pflanzen",
    searchKeys: [],
        filters: [
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
            icon: <ActivityIcon size={16} />,
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
            render: (value: string | undefined) => value ? <span>{value}</span> : EMPTY,
        },
        {
            key: "species",
            displayText: "Art",
            render: (value: string | undefined) => value ? <span>{value}</span> : EMPTY,
        },
        {
            id: "ph",
            displayText: "pH",
            sortable: true,
            sortBy: extractPH,
            render: (row: PlantTableRow): JSX.Element => {
                const value = row.water?.ph?.value;
                const unit = row.water?.ph?.unit;

                if (value === undefined) return EMPTY;

                return (
                    <span style={getWarnStyle(value < 5.5 || value > 7.5)}>
                        {value} {unit ?? ""}
                    </span>
                );
            },
        },
        {
            id: "ec",
            displayText: "EC",
            sortable: true,
            sortBy: extractEC,
            render: (row: PlantTableRow): JSX.Element => {
                const value = row.water?.ec?.value;
                const unit = row.water?.ec?.unit;

                if (value === undefined) return EMPTY;

                return (
                    <span style={getWarnStyle(value < 0.5 || value > 3.5)}>
                        {value} {unit ?? ""}
                    </span>
                );
            }
        },
        {
            id: "last-event",
            displayText: "Letztes Event",
            sortable: true,
            sortBy: extractLastEventTime,
            render: (row: PlantTableRow): JSX.Element => {
                const last = getLastEvent(row.events);
                if (!last) return EMPTY;

                const formatted = `${last.type.charAt(0).toUpperCase()}${last.type.slice(1).toLowerCase()} · ${formatDateShort(new Date(last.timestamp))}`;

                return (
                    <span style={{ display: "flex", alignItems: "center", gap: 6 }}>
                        <CalendarClock size={18} />
                        <span style={{ fontSize: "0.95em", color: "#333" }}>{formatted}</span>
                    </span>
                );
            },
        },
        
        {
            id: "last-watering",
            displayText: "Zuletzt gegossen",
            sortable: true,
            sortBy: extractLastWateringTime,
            render: (row: PlantTableRow): JSX.Element => {
                const lastWatering = getLastWatering(row.events);
                if (!lastWatering) return EMPTY;

                const days = daysSince(lastWatering.timestamp);

                return (
                    <span
                        style={{
                            display: "flex",
                            alignItems: "center",
                            gap: 4,
                            color: days > 10 ? dangerColor : undefined,
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