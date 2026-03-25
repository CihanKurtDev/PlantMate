"use client";

import { useMemo } from "react";
import { BaseEvent } from "@/types/events";
import { iconMap } from "@/types/icons";
import styles from "./EventsList.module.scss";
import { formatDate, formatTime, groupEventsByDate } from "@/helpers/date";
import { Leaf, TrendingUp } from "lucide-react";
import TypeIcon from "@/components/TypeIcon/TypeIcon";
import { getEventConfig } from "@/config/icons";
import { Button } from "@/components/Button/Button";

interface EventsListProps<T extends BaseEvent> {
    events: T[];
    emptyMessage: string;
    getTitle: (event: T) => string;
    onAddEvent?: () => void;
    children?: (event: T) => React.ReactNode;
}

interface EventCardProps {
    event: BaseEvent;
    title: string;
}

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
                    {event.notes ? event.notes : "Keine Notizen vorhanden"}
                </p>
            </div>
            <span className={styles.eventTime}>{formatTime(event.timestamp)}</span>
        </article>
    );
};

function generateExampleEvents(): BaseEvent[] {
    const now = Date.now();
    const day = 86_400_000;

    return [
        {
            id: "ghost-1",
            type: "Cleaning",
            timestamp: now,
            notes: "Substrate gewechselt",
        },
        {
            id: "ghost-2",
            type: "Equipment_Change",
            timestamp: now,
            notes: undefined,
        },
        {
            id: "ghost-3",
            type: "Maintenance",
            timestamp: now - day * 3,
            notes: "Filter gereinigt",
        },
        {
            id: "ghost-4",
            type: "Cleaning",
            timestamp: now - day * 7,
            notes: undefined,
        },
    ];
}

interface ExampleOverlayProps {
    message: string;
    onAddEvent?: () => void;
}

function ExampleOverlay({ message, onAddEvent }: ExampleOverlayProps) {
    return (
        <div className={styles.exampleOverlay}>
            <div className={styles.exampleOverlayCard}>
                <TrendingUp size={28} strokeWidth={1.5} />
                <p>Verlauf aktivieren</p>
                <p className={styles.exampleOverlayDescription}>{message}</p>
                {onAddEvent && (
                    <Button variant="secondary" type="button" onClick={onAddEvent}>
                        Event eintragen
                    </Button>
                )}
            </div>
        </div>
    );
}

export default function EventsList<T extends BaseEvent>({
    events,
    emptyMessage,
    getTitle,
    onAddEvent,
    children,
}: EventsListProps<T>) {
    const isEmpty = !events || events.length === 0;

    const displayEvents = useMemo(
        () => (isEmpty ? (generateExampleEvents() as unknown as T[]) : events),
        [isEmpty, events]
    );

    const groups = groupEventsByDate(displayEvents);

    return (
        <div className={styles.container}>
            <div className={isEmpty ? styles.ghostContent : undefined}>
                {groups.map(([date, groupedEvents]) => (
                    <section key={date}>
                        <header className={styles.dateHeader}>
                            <h3 className={styles.dateTitle}>
                                {formatDate(new Date(date).getTime())}
                            </h3>
                            <div className={styles.dateLine} />
                        </header>

                        <ol className={styles.eventsGrid}>
                            {groupedEvents.map((event) => (
                                <li key={event.id} className={styles.timelineItem}>
                                    {children ? (
                                        children(event)
                                    ) : (
                                        <EventCard
                                            event={event}
                                            title={getTitle(event)}
                                        />
                                    )}
                                </li>
                            ))}
                        </ol>
                    </section>
                ))}
            </div>

            {isEmpty && (
                <ExampleOverlay message={emptyMessage} onAddEvent={onAddEvent} />
            )}
        </div>
    );
}