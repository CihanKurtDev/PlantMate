import { PlantTableRow } from "@/components/Table/adapters/plantTableAdapter";
import { formatDateShort } from "@/helpers/date";
import type { TableConfig } from "@/types/table";
import { getEventConfig } from "./icons";
import { TableSparkline } from "@/helpers/tableUtils";
import { ActivityIcon, AlertCircle, Droplet, Inbox } from "lucide-react";
import styles from "@/components/Table/Table.module.scss";

const EMPTY = <span style={{ color: "#6b7280" }}>—</span>;

const warnColor = "#b45309";
const dangerColor = "#b91c1c";
const PH_COLOR = "#087a6d";
const EC_COLOR = "#d3893e";

const getWarnStyle = (condition: boolean) =>
    condition ? { color: warnColor } : undefined;

export const plantTableConfig: TableConfig<PlantTableRow> = {
    title: "Pflanzen",
    searchKeys: ["title", "species"],

    filters: [
        {
            displayText: "Braucht Wasser",
            icon: <AlertCircle size={16} />,
            customSearchFunc: (row) => row.daysSinceWatering > 7,
        },
        {
            displayText: "PH",
            icon: <AlertCircle size={16} />,
            customSearchFunc: (row) =>
                row.phValue !== null && (row.phValue < 5.5 || row.phValue > 7.5),
        },
        {
            displayText: "EC",
            icon: <AlertCircle size={16} />,
            customSearchFunc: (row) =>
                row.ecValue !== null && (row.ecValue < 0.5 || row.ecValue > 3.5),
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
                const waterNeeded = row.daysSinceWatering > 7;
                const phBad       = row.phValue !== null && (row.phValue < 5.5 || row.phValue > 7.5);
                const ecBad       = row.ecValue !== null && (row.ecValue < 0.5 || row.ecValue > 3.5);
                const noEvents    = !row.events || row.events.length === 0;
                return waterNeeded || phBad || ecBad || noEvents;
            },
        },
    ],

    columns: [
        {
            key: "title",
            displayText: "Name",
            sortable: true,
            render: (value: string) =>
                value ? <span>{value}</span> : EMPTY,
        },
        {
            key: "species",
            displayText: "Art",
            sortable: true,
            render: (value: string) =>
                value ? <span>{value}</span> : EMPTY,
        },
        {
            key: "phValue",
            displayText: "pH",
            sortable: true,
            render: (value: number | null, row) => {
                if (value === null) return EMPTY;
                return (
                    <span className={styles.numeric} style={getWarnStyle(value < 5.5 || value > 7.5)}>
                        {value} {row?.phUnit ?? ""}
                    </span>
                );
            },
        },
        {
            key: "phHistory",
            displayText: "pH Trend 30d",
            sortable: false,
            render: (_value, row) => (
                <TableSparkline
                    data={row?.phHistory ?? []}
                    color={PH_COLOR}
                    id={`ph_${row?.key}`}
                />
            ),
        },
        {
            key: "ecValue",
            displayText: "EC",
            sortable: true,
            render: (value: number | null, row) => {
                if (value === null) return EMPTY;
                return (
                    <span className={styles.numeric} style={getWarnStyle(value < 0.5 || value > 3.5)}>
                        {value} {row?.ecUnit ?? ""}
                    </span>
                );
            },
        },
        {
            key: "ecHistory",
            displayText: "EC Trend 30d",
            sortable: false,
            render: (_value, row) => (
                <TableSparkline
                    data={row?.ecHistory ?? []}
                    color={EC_COLOR}
                    id={`ec_${row?.key}`}
                />
            ),
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
            key: "lastWateringTimestamp",
            displayText: "Zuletzt gegossen",
            sortable: true,
            render: (value: number, row) => {
                if (!value || !row?.lastWateringDate) return EMPTY;
                return (
                    <span style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 4,
                        color: row.daysSinceWatering > 10 ? dangerColor : undefined,
                    }}>
                        <Droplet size={16} />
                        {row.lastWateringDate}
                    </span>
                );
            },
        },
    ],
};