import { PlantTableRow } from "@/components/Table/adapters/plantTableAdapter";
import { formatDateShort } from "@/helpers/date";
import type { TableConfig } from "@/types/table";
import { ActivityIcon, AlertCircle, CalendarClock, Droplet, Inbox } from "lucide-react";

const EMPTY = <span style={{ color: "#6b7280" }}>—</span>;

const warnColor = "#b45309";
const dangerColor = "#b91c1c";

const getWarnStyle = (condition: boolean) =>
    condition ? { color: warnColor } : undefined;

export const plantTableConfig: TableConfig<PlantTableRow> = {
    title: "Pflanzen",
    searchKeys: ["title", "species"],
    
    filters: [
        {
            displayText: "Braucht Wasser",
            icon: <AlertCircle size={16} />,
            customSearchFunc: (row) => row.daysSinceWatering > 7
        },
        {
            displayText: "PH",
            icon: <AlertCircle size={16} />,
            customSearchFunc: (row) => {
                return row.phValue !== null && (row.phValue < 5.5 || row.phValue > 7.5);
            },
        },
        {
            displayText: "EC",
            icon: <AlertCircle size={16} />,
            customSearchFunc: (row) => {
                return row.ecValue !== null && (row.ecValue < 0.5 || row.ecValue > 3.5);
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
                const waterNeeded = row.daysSinceWatering > 7;
                const phBad = row.phValue !== null && (row.phValue < 5.5 || row.phValue > 7.5);
                const ecBad = row.ecValue !== null && (row.ecValue < 0.5 || row.ecValue > 3.5);
                const noEvents = !row.events || row.events.length === 0;
                
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
                value ? <span>{value}</span> : EMPTY
        },
        
        {
            key: "species",
            displayText: "Art",
            sortable: true,
            render: (value: string) => 
                value ? <span>{value}</span> : EMPTY
        },
        
        {
            key: "phValue",
            displayText: "pH",
            sortable: true,
            render: (value: number | null, row) => {
                if (value === null) return EMPTY;
                
                return (
                    <span style={getWarnStyle(value < 5.5 || value > 7.5)}>
                        {value} {row?.phUnit ?? ""}
                    </span>
                );
            }
        },
        
        {
            key: "ecValue",
            displayText: "EC",
            sortable: true,
            render: (value: number | null, row) => {
                if (value === null) return EMPTY;
                
                return (
                    <span style={getWarnStyle(value < 0.5 || value > 3.5)}>
                        {value} {row?.ecUnit ?? ""}
                    </span>
                );
            }
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
            }
        },
        
        {
            key: "lastWateringTimestamp",
            displayText: "Zuletzt gegossen",
            sortable: true,
            render: (value: number, row) => {
                if (!value || !row?.lastWateringDate) return EMPTY;
                
                const days = row.daysSinceWatering;
                
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
                        {row.lastWateringDate}
                    </span>
                );
            }
        },
    ],
};