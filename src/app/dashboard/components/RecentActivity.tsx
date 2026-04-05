"use client";

import { memo, useMemo } from "react";
import { useRouter } from "next/navigation";
import { EnvironmentData } from "@/types/environment";
import { PlantData } from "@/types/plant";
import TypeIcon from "@/components/TypeIcon/TypeIcon";
import styles from "./RecentActivity.module.scss";
import { ActivityEntry, getRecentActivity } from "@/helpers/getRecentActivity";
import { dateKeyToTimestamp, formatDate, formatTime, groupEventsByDate } from "@/helpers/date";
import { Card } from "@/components/Card/Card";
import TabContent from "@/components/TabContent/TabContent";
import { GhostState } from "@/app/environments/[environmentId]/components/shared/GhostState/GhostState";
import { GhostCard } from "@/app/environments/[environmentId]/components/shared/GhostState/GhostCard";
import { getIconConfig } from "@/config/icons";

const GHOST_BASE = Date.UTC(2024, 0, 8, 12, 0, 0, 0);
const DAY = 86_400_000;

const GHOST_ENTRIES: ActivityEntry[] = [
    {
        id: "ghost-1",
        kind: "event",
        timestamp: GHOST_BASE,
        iconConfig: getIconConfig("Cleaning")!,
        title: "Reinigung",
        subTitle: "Gewächshaus Nord",
        href: "#",
    },
    {
        id: "ghost-2",
        kind: "measurement",
        timestamp: GHOST_BASE - DAY,
        iconConfig: getIconConfig("temp")!,
        title: "Messung eingetragen",
        subTitle: "Gewächshaus Nord",
        href: "#",
    },
    {
        id: "ghost-3",
        kind: "event",
        timestamp: GHOST_BASE - DAY * 2,
        iconConfig: getIconConfig("FERTILIZING")!,
        title: "Düngen · Bio-Bloom",
        subTitle: "Tomatenpflanze · Gewächshaus Nord",
        href: "#",
    },
    {
        id: "ghost-4",
        kind: "measurement",
        timestamp: GHOST_BASE - DAY * 3,
        iconConfig: getIconConfig("ph")!,
        title: "Gegossen",
        subTitle: "Tomatenpflanze · Gewächshaus Nord",
        notes: "500 ml · pH 6.1 · EC 1.8",
        href: "#",
    },
];

interface RecentActivityProps {
    environments: EnvironmentData[];
    plants: PlantData[];
    limit?: number;
}

const RecentActivityTab = ({ environments, plants, limit }: RecentActivityProps) => {
    const router = useRouter();

    const entries = useMemo(
        () => getRecentActivity(environments, plants, limit),
        [environments, plants, limit]
    );

    const isEmpty = entries.length === 0;
    const displayEntries = isEmpty ? GHOST_ENTRIES : entries;
    const grouped = groupEventsByDate(displayEntries);

    const activityList = (
        <div className={styles.wrapper}>
            {grouped.map(([dateKey, items]) => (
                <section key={dateKey} className={styles.group}>
                    <time
                        className={styles.dateLabel}
                        dateTime={new Date(dateKeyToTimestamp(dateKey)).toISOString()}
                    >
                        {formatDate(dateKeyToTimestamp(dateKey))}
                    </time>
                    <ul className={styles.list}>
                        {items.map(entry => (
                            <li key={entry.id}>
                                <button
                                    className={styles.item}
                                    onClick={() => router.push(entry.href)}
                                >
                                    <TypeIcon
                                        icon={entry.iconConfig.icon}
                                        customBgColor={entry.iconConfig.colors.soft}
                                        customTextColor={entry.iconConfig.colors.base}
                                        size="l"
                                    />
                                    <div className={styles.body}>
                                        <span className={styles.title}>{entry.title}</span>
                                        <div className={styles.meta}>
                                            <span className={styles.subTitle}>{entry.subTitle}</span>
                                        </div>
                                    </div>
                                    <time
                                        className={styles.time}
                                        dateTime={new Date(entry.timestamp).toISOString()}
                                    >
                                        {formatTime(entry.timestamp)}
                                    </time>
                                </button>
                            </li>
                        ))}
                    </ul>
                </section>
            ))}
        </div>
    );

    return (
        <TabContent id="recent-activity">
            <Card title="Letzte Aktivitäten" collapsible>
                <GhostState
                    isEmpty={isEmpty}
                    overlay={
                        <GhostCard
                            title="Noch keine Aktivitäten"
                            text="Sobald du Events oder Messungen einträgst, erscheinen sie hier."
                        />
                    }
                >
                    {activityList}
                </GhostState>
            </Card>
        </TabContent>
    );
};

export default memo(RecentActivityTab);