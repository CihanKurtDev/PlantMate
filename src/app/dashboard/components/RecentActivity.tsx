"use client";

import { useMemo } from "react";
import { useRouter } from "next/navigation";
import { EnvironmentData } from "@/types/environment";
import { PlantData } from "@/types/plant";
import TypeIcon from "@/components/TypeIcon/TypeIcon";
import styles from "./RecentActivity.module.scss";
import { getRecentActivity } from "@/helpers/getRecentActivity";
import { formatDate, formatTime, groupEventsByDate } from "@/helpers/date";
import { Card } from "@/components/Card/Card";
import TabContent from "@/app/environments/[environmentId]/components/shared/TabContent";
import EmptyState from "@/app/environments/[environmentId]/components/shared/EmptyState";

interface RecentActivityProps {
    environments: EnvironmentData[];
    plants: PlantData[];
    limit?: number;
}

const RecentActivityTab = ({ environments, plants, limit}: RecentActivityProps) => {
    const router = useRouter();

    const entries = useMemo(
        () => getRecentActivity(environments, plants, limit),
        [environments, plants, limit]
    );

    const grouped = groupEventsByDate(entries);

    return (
        <TabContent id="recent-activity">
            <Card title="Letzte Aktivitäten" collapsible>
                {!entries.length ? (
                    <EmptyState message="Noch keine Aktivitäten vorhanden." />
                ) : (
                    <div className={styles.wrapper}>
                        {grouped.map(([dateKey, items]) => (
                            <section key={dateKey} className={styles.group}>
                                <time
                                    className={styles.dateLabel}
                                    dateTime={new Date(dateKey).toISOString()}
                                >
                                    {formatDate(new Date(dateKey).getTime())}
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
                )}
            </Card>
        </TabContent>
    );
};

export default RecentActivityTab;