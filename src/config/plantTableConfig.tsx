import { PlantTableRow } from "@/components/Table/adapters/plantTableAdapter";
import type { TableConfig } from "@/types/table";
import { ActivityIcon, AlertCircle, Droplet, Inbox } from "lucide-react";
import { LastEventTableCell } from "@/components/Table/LastEventTableCell";
import styles from "@/components/Table/Table.module.scss";
import Sparkline from "@/components/Sparkline/Sparkline";
import { THRESHOLDS } from "@/config/thresholds";

const EMPTY = <span style={{ color: "var(--color-text-tertiary)" }}>—</span>;

const warnColor = "var(--color-text-alert)";
const dangerColor = "var(--color-text-error)";
const PH_COLOR = "#087a6d";
const EC_COLOR = "#d3893e";

const getWarnStyle = (condition: boolean) =>
    condition ? { color: warnColor } : undefined;

const { plant } = THRESHOLDS;

export const plantTableConfig: TableConfig<PlantTableRow> = {
    title: "Pflanzen",
    searchKeys: ["title", "species"],

    filters: [
        {
            displayText: "Braucht Wasser",
            icon: <AlertCircle size={16} />,
            customSearchFunc: (row) => row.daysSinceWatering > plant.daysSinceWatering.warn,
        },
        {
            displayText: "PH",
            icon: <AlertCircle size={16} />,
            customSearchFunc: (row) => row.phBad,
        },
        {
            displayText: "EC",
            icon: <AlertCircle size={16} />,
            customSearchFunc: (row) => row.ecBad,
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
                const waterStale =
                    row.lastWateringTimestamp > 0 &&
                    row.daysSinceWatering > plant.daysSinceWatering.warn;
                return waterStale || row.phBad || row.ecBad;
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
                    <span className={styles.numeric} style={getWarnStyle(row?.phBad ?? false)}>
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
                <Sparkline
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
                    <span className={styles.numeric} style={getWarnStyle(row?.ecBad ?? false)}>
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
                <Sparkline
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
            render: (_value: number, row) =>
                row ? <LastEventTableCell row={row} /> : EMPTY,
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
                        color: row.daysSinceWatering > plant.daysSinceWatering.warn ? dangerColor : undefined,
                    }}>
                        <Droplet size={16} />
                        {row.lastWateringDate}
                    </span>
                );
            },
        },
    ],
};