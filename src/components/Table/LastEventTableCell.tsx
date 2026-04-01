import { formatDateShort } from "@/helpers/date";
import { getEventConfig } from "@/config/icons";
import { iconMap, type IconMapKey } from "@/types/icons";
import type { LucideIcon } from "lucide-react";

const EMPTY = <span style={{ color: "var(--color-text-tertiary)" }}>—</span>;

export interface LastEventTableRow {
    lastEventTimestamp: number;
    lastEventFormatted: string | null;
    lastEventCustomIconName?: IconMapKey;
    lastEventCustomBgColor?: string;
    lastEventCustomTextColor?: string;
    lastEventCustomBorderColor?: string;
}

export function LastEventTableCell({ row }: { row: LastEventTableRow }) {
    const value = row.lastEventTimestamp;
    if (!value || !row.lastEventFormatted) return EMPTY;

    const eventCfg = getEventConfig(row.lastEventFormatted);
    const customKey = row.lastEventCustomIconName;
    const IconComponent: LucideIcon | undefined =
        customKey && iconMap[customKey]
            ? iconMap[customKey]
            : eventCfg?.icon;

    const soft =
        row.lastEventCustomBgColor ??
        eventCfg?.colors.soft ??
        "var(--color-background-tertiary)";
    const base =
        row.lastEventCustomTextColor ??
        eventCfg?.colors.base ??
        "var(--color-text-secondary)";
    const title = eventCfg?.label ?? row.lastEventFormatted;

    return (
        <span
            style={{ display: "flex", alignItems: "center", gap: 6 }}
            title={title}
        >
            {IconComponent && (
                <span
                    style={{
                        display: "inline-flex",
                        alignItems: "center",
                        justifyContent: "center",
                        width: 26,
                        height: 26,
                        borderRadius: 6,
                        background: soft,
                        color: base,
                        border:
                            row.lastEventCustomBorderColor !== undefined
                                ? `1px solid ${row.lastEventCustomBorderColor}`
                                : undefined,
                        flexShrink: 0,
                    }}
                >
                    <IconComponent size={14} />
                </span>
            )}
            <span style={{ fontSize: "11px", color: "var(--color-text-tertiary)" }}>
                {formatDateShort(new Date(value))}
            </span>
        </span>
    );
}
