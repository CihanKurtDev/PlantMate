"use client";

import { useMemo } from "react";
import { BaseEvent } from "@/types/events";
import { iconMap } from "@/types/icons";
import styles from "./EventsList.module.scss";
import { dateKeyToTimestamp, formatDate, formatTime, groupEventsByDate } from "@/helpers/date";
import { Leaf } from "lucide-react";
import TypeIcon from "@/components/TypeIcon/TypeIcon";
import { getEventConfig } from "@/config/icons";
import { GhostState } from "./GhostState/GhostState";
import { GhostCard } from "./GhostState/GhostCard";

interface EventsListProps<T extends BaseEvent> {
    events: T[];
    emptyMessage: string;
    emptyTitle?: string;
    ctaLabel?: string;
    getTitle: (event: T) => string;
    onAddEvent?: () => void;
    children?: (event: T) => React.ReactNode;
}

interface EventCardProps {
    event: BaseEvent;
    title: string;
}

const EXAMPLE_BASE_TIMESTAMP = Date.UTC(2024, 0, 8, 12, 0, 0, 0);

const EventCard = ({ event, title }: EventCardProps) => {
    const eventConfig = getEventConfig(event.type);

    let IconComponent = Leaf;
    if (event.customIconName && iconMap[event.customIconName]) {
        IconComponent = iconMap[event.customIconName];
    } else if (eventConfig?.icon) {
        IconComponent = eventConfig.icon;
    }

    const bgColor = event.customBgColor ?? eventConfig?.colors.soft;
    const textColor = event.customTextColor ?? eventConfig?.colors.base;

    return (
        <article className={styles.card}>
            <TypeIcon
                icon={IconComponent}
                customBgColor={bgColor}
                customTextColor={textColor}
                customBorderColor={event.customBorderColor}
                size="fill"
            />
            <div className={styles.eventInfoWrapper}>
                <h4>{title}</h4>
                <p className={styles.eventNotes}>
                    {event.notes ?? "Keine Notizen vorhanden"}
                </p>
            </div>
            <span className={styles.eventTime}>{formatTime(event.timestamp)}</span>
        </article>
    );
};

function generateExampleEvents(): BaseEvent[] {
    const day = 86_400_000;
    return [
        { id: "ghost-1", type: "Cleaning",        timestamp: EXAMPLE_BASE_TIMESTAMP,           notes: "Substrate gewechselt" },
        { id: "ghost-2", type: "Equipment_Change", timestamp: EXAMPLE_BASE_TIMESTAMP,           notes: undefined },
        { id: "ghost-3", type: "Maintenance",      timestamp: EXAMPLE_BASE_TIMESTAMP - day * 3, notes: "Filter gereinigt" },
        { id: "ghost-4", type: "Cleaning",         timestamp: EXAMPLE_BASE_TIMESTAMP - day * 7, notes: undefined },
    ];
}

export default function EventsList<T extends BaseEvent>({
    events,
    emptyMessage,
    emptyTitle = "Verlauf aktivieren",
    ctaLabel = "Event eintragen",
    getTitle,
    onAddEvent,
    children,
}: EventsListProps<T>) {
    const isEmpty = events.length === 0;

    const displayEvents = useMemo(
        () => (isEmpty ? (generateExampleEvents() as unknown as T[]) : events),
        [isEmpty, events]
    );

    const groups = groupEventsByDate(displayEvents);

    const eventGroups = (
        <div className={styles.container}>
            {groups.map(([date, groupedEvents]) => (
                <section key={date}>
                    <header className={styles.dateHeader}>
                        <h3 className={styles.dateTitle}>
                            {formatDate(dateKeyToTimestamp(date))}
                        </h3>
                        <div className={styles.dateLine} />
                    </header>
                    <ol className={styles.eventsGrid}>
                        {groupedEvents.map((event) => (
                            <li key={event.id} className={styles.timelineItem}>
                                {children ? children(event) : (
                                    <EventCard event={event} title={getTitle(event)} />
                                )}
                            </li>
                        ))}
                    </ol>
                </section>
            ))}
        </div>
    );

    return (
        <GhostState
            isEmpty={isEmpty}
            overlay={
                <GhostCard
                    title={emptyTitle}
                    text={emptyMessage}
                    cta={ctaLabel}
                    onClick={onAddEvent}
                />
            }
        >
            {eventGroups}
        </GhostState>
    );
}