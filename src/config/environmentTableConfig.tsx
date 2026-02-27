import { EnvironmentTableRow } from "@/components/Table/adapters/environmentTableAdapter";
import { formatDateShort } from "@/helpers/date";
import type { TableConfig } from "@/types/table";
import { ActivityIcon, AlertCircle, CalendarClock, Inbox, Thermometer, Wind } from "lucide-react";

const EMPTY = <span style={{ color: "#6b7280" }}>—</span>;

const warnColor = "#b45309";
const dangerColor = "#b91c1c";

const getWarnStyle = (condition: boolean) =>
    condition ? { color: warnColor } : undefined;

const ENV_TYPE_LABELS: Record<string, string> = {
    ROOM: "Raum",
    TENT: "Zelt",
    GREENHOUSE: "Gewächshaus",
};

export const environmentTableConfig: TableConfig<EnvironmentTableRow> = {
    title: "Environments",
    searchKeys: ["name", "type", "location"],

    filters: [
        {
            displayText: "Hohe Temp",
            icon: <AlertCircle size={16} />,
            customSearchFunc: (row) => row.lastTemp !== null && row.lastTemp > 30,
        },
        {
            displayText: "Hohe Luftfeuchte",
            icon: <AlertCircle size={16} />,
            customSearchFunc: (row) => row.lastHumidity !== null && row.lastHumidity > 70,
        },
        {
            displayText: "Keine Events",
            icon: <Inbox size={16} />,
            customSearchFunc: (row) => !row.events || row.events.length === 0,
        },
        {
            displayText: "Veraltete Messung",
            icon: <CalendarClock size={16} />,
            customSearchFunc: (row) => row.daysSinceLastMeasurement > 7,
        },
        {
            displayText: "Ungesund",
            icon: <ActivityIcon size={16} />,
            customSearchFunc: (row) => {
                const tempBad = row.lastTemp !== null && row.lastTemp > 30;
                const humidityBad = row.lastHumidity !== null && row.lastHumidity > 70;
                const stale = row.daysSinceLastMeasurement > 7;
                const noEvents = !row.events || row.events.length === 0;

                return tempBad || humidityBad || stale || noEvents;
            },
        },
    ],

    columns: [
        {
            key: "name",
            displayText: "Name",
            sortable: true,
            render: (value: string) =>
                value ? <span>{value}</span> : EMPTY,
        },
        {
            key: "type",
            displayText: "Typ",
            sortable: true,
            render: (value: string) =>
                value ? <span>{ENV_TYPE_LABELS[value] ?? value}</span> : EMPTY,
        },
        {
            key: "location",
            displayText: "Standort",
            sortable: true,
            render: (value: string | null) =>
                value ? <span>{value}</span> : EMPTY,
        },
        {
            key: "lastTemp",
            displayText: "Temperatur",
            sortable: true,
            render: (value: number | null, row) => {
                if (value === null) return EMPTY;

                return (
                    <span
                        style={{
                            display: "flex",
                            alignItems: "center",
                            gap: 4,
                            ...getWarnStyle(value > 30),
                        }}
                    >
                        <Thermometer size={16} />
                        {value} {row?.lastTempUnit ?? "°C"}
                    </span>
                );
            },
        },
        {
            key: "lastHumidity",
            displayText: "Luftfeuchte",
            sortable: true,
            render: (value: number | null) => {
                if (value === null) return EMPTY;

                return (
                    <span style={getWarnStyle(value > 70)}>
                        {value} %
                    </span>
                );
            },
        },
        {
            key: "lastVpd",
            displayText: "VPD",
            sortable: true,
            render: (value: number | null) => {
                if (value === null) return EMPTY;

                return (
                    <span style={getWarnStyle(value < 0.4 || value > 1.6)}>
                        {value} kPa
                    </span>
                );
            },
        },
        {
            key: "lastCo2",
            displayText: "CO₂",
            sortable: true,
            render: (value: number | null) => {
                if (value === null) return EMPTY;

                return (
                    <span style={getWarnStyle(value > 1500)}>
                        <Wind size={14} style={{ marginRight: 4, verticalAlign: "middle" }} />
                        {value} ppm
                    </span>
                );
            },
        },
        {
            key: "lastEventTimestamp",
            displayText: "Letztes Event",
            sortable: true,
            render: (value: number, row) => {
                if (!value || !row?.lastEventFormatted) return EMPTY;

                return (
                    <span style={{ display: "flex", alignItems: "center", gap: 6 }}>
                        <CalendarClock size={18} />
                        <span style={{ fontSize: "0.95em", color: "#333" }}>
                            {row.lastEventFormatted} · {formatDateShort(new Date(value))}
                        </span>
                    </span>
                );
            },
        },
        {
            key: "lastMeasurementTimestamp",
            displayText: "Letzte Messung",
            sortable: true,
            render: (value: number, row) => {
                if (!value || !row?.lastMeasurementDate) return EMPTY;

                const days = row.daysSinceLastMeasurement;

                return (
                    <span style={{ color: days > 7 ? dangerColor : undefined }}>
                        {row.lastMeasurementDate}
                    </span>
                );
            },
        },
    ],
};