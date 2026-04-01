import { EnvironmentTableRow } from "@/components/Table/adapters/environmentTableAdapter";
import { formatDateShort } from "@/helpers/date";
import type { TableConfig } from "@/types/table";
import { CLIMATE_COLORS } from "./icons";
import { ENVIRONMENT_LABELS } from "./environment";
import { ActivityIcon, AlertCircle, CalendarClock, Inbox } from "lucide-react";
import styles from "@/components/Table/Table.module.scss";
import Sparkline from "@/components/Sparkline/Sparkline";
import { THRESHOLDS } from "@/config/thresholds";
import { LastEventTableCell } from "@/components/Table/LastEventTableCell";

const EMPTY = <span style={{ color: "var(--color-text-tertiary)" }}>—</span>;

const warnColor = "var(--color-text-alert)";
const dangerColor = "var(--color-text-error)";

const getWarnStyle = (condition: boolean) =>
    condition ? { color: warnColor } : undefined;

const { measurement } = THRESHOLDS;

export const environmentTableConfig: TableConfig<EnvironmentTableRow> = {
    title: "Environments",
    searchKeys: ["name", "type", "location", "profilesLabel"],

    filters: [
        {
            displayText: "Kritische Temp",
            icon: <AlertCircle size={16} />,
            customSearchFunc: (row) => row.tempBad,
        },
        {
            displayText: "Kritische Luftfeuchte",
            icon: <AlertCircle size={16} />,
            customSearchFunc: (row) => row.humidityBad,
        },
        {
            displayText: "Keine Events",
            icon: <Inbox size={16} />,
            customSearchFunc: (row) => !row.events || row.events.length === 0,
        },
        {
            displayText: "Veraltete Messung",
            icon: <CalendarClock size={16} />,
            customSearchFunc: (row) => row.daysSinceLastMeasurement > measurement.daysSinceLastMeasurement.warn,
        },
        {
            displayText: "Ungesund",
            icon: <ActivityIcon size={16} />,
            customSearchFunc: (row) => {
                const stale =
                    row.lastMeasurementTimestamp > 0 &&
                    row.daysSinceLastMeasurement >
                        measurement.daysSinceLastMeasurement.warn;
                return (
                    row.tempBad ||
                    row.humidityBad ||
                    row.vpdBad ||
                    row.co2Bad ||
                    stale
                );
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
            key: "profilesLabel",
            displayText: "Profil",
            sortable: true,
            render: (value: string) =>
                value ? <span>{value}</span> : EMPTY,
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
                    <span className={styles.numeric} style={getWarnStyle(row?.tempBad ?? false)}>
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
                <Sparkline
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
            render: (value: number | null, row) => {
                if (value === null) return EMPTY;
                return (
                    <span className={styles.numeric} style={getWarnStyle(row?.humidityBad ?? false)}>
                        {value} %
                    </span>
                );
            },
        },
        {
            key: "lastVpd",
            displayText: "VPD",
            sortable: true,
            render: (value: number | null, row) => {
                if (value === null) return EMPTY;
                return (
                    <span className={styles.numeric} style={getWarnStyle(row?.vpdBad ?? false)}>
                        {value} kPa
                    </span>
                );
            },
        },
        {
            key: "lastCo2",
            displayText: "CO₂",
            sortable: true,
            render: (value: number | null, row) => {
                if (value === null) return EMPTY;
                return (
                    <span className={styles.numeric} style={getWarnStyle(row?.co2Bad ?? false)}>
                        {value} ppm
                    </span>
                );
            },
        },
        {
            key: "lastEventTimestamp",
            displayText: "Event",
            sortable: true,
            render: (_value: number, row) =>
                row ? <LastEventTableCell row={row} /> : EMPTY,
        },
        {
            key: "lastMeasurementTimestamp",
            displayText: "Letzte Messung",
            sortable: true,
            render: (value: number, row) => {
                if (!value || !row?.lastMeasurementDate) return EMPTY;
                return (
                    <span className={styles.numeric} style={{ color: row.daysSinceLastMeasurement > measurement.daysSinceLastMeasurement.warn ? dangerColor : undefined }}>
                        {row.lastMeasurementDate}
                    </span>
                );
            },
        },
    ],
};