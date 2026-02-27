import { EnvironmentTableRow } from "@/components/Table/adapters/environmentTableAdapter";
import { formatDateShort } from "@/helpers/date";
import type { TableConfig } from "@/types/table";
import { CLIMATE_COLORS, getEventConfig } from "./icons";
import { ENVIRONMENT_LABELS } from "./environment";
import { TableSparkline } from "@/helpers/tableUtils";
import { ActivityIcon, AlertCircle, CalendarClock, Inbox } from "lucide-react";
import styles from "@/components/Table/Table.module.scss";

const EMPTY = <span style={{ color: "#6b7280" }}>—</span>;

const warnColor = "#b45309";
const dangerColor = "#b91c1c";

const getWarnStyle = (condition: boolean) =>
    condition ? { color: warnColor } : undefined;

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
                const tempBad     = row.lastTemp !== null && row.lastTemp > 30;
                const humidityBad = row.lastHumidity !== null && row.lastHumidity > 70;
                const stale       = row.daysSinceLastMeasurement > 7;
                const noEvents    = !row.events || row.events.length === 0;
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
                value
                    ? <span>{ENVIRONMENT_LABELS[value as keyof typeof ENVIRONMENT_LABELS] ?? value}</span>
                    : EMPTY,
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
                    <span className={styles.numeric} style={getWarnStyle(value > 30)}>
                        {value} {row?.lastTempUnit ?? "°C"}
                    </span>
                );
            },
        },
        {
            key: "tempHistory",
            displayText: "Trend 30d",
            sortable: false,
            render: (_value, row) => (
                <TableSparkline
                    data={row?.tempHistory ?? []}
                    color={CLIMATE_COLORS.temp.base}
                    id={`temp_${row?.key}`}
                />
            ),
        },
        {
            key: "lastHumidity",
            displayText: "Luftfeuchte",
            sortable: true,
            render: (value: number | null) => {
                if (value === null) return EMPTY;
                return (
                    <span className={styles.numeric} style={getWarnStyle(value > 70)}>
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
                    <span className={styles.numeric} style={getWarnStyle(value < 0.4 || value > 1.6)}>
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
                    <span className={styles.numeric} style={getWarnStyle(value > 1500)}>
                        {value} ppm
                    </span>
                );
            },
        },
        {
            key: "lastEventTimestamp",
            displayText: "Event",
            sortable: true,
            render: (value: number, row) => {
                if (!value || !row?.lastEventFormatted) return EMPTY;

                const eventCfg = getEventConfig(row.lastEventFormatted);

                return (
                    <span
                        style={{ display: "flex", alignItems: "center", gap: 6 }}
                        title={eventCfg?.label ?? row.lastEventFormatted}
                    >
                        {eventCfg && (
                            <span style={{
                                display: "inline-flex",
                                alignItems: "center",
                                justifyContent: "center",
                                width: 26,
                                height: 26,
                                borderRadius: 6,
                                background: eventCfg.colors.soft,
                                color: eventCfg.colors.base,
                                flexShrink: 0,
                            }}>
                                <eventCfg.icon size={14} />
                            </span>
                        )}
                        <span style={{ fontSize: "11px", color: "#6b7280" }}>
                            {formatDateShort(new Date(value))}
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
                return (
                    <span className={styles.numeric} style={{ color: row.daysSinceLastMeasurement > 7 ? dangerColor : undefined }}>
                        {row.lastMeasurementDate}
                    </span>
                );
            },
        },
    ],
};