import EmptyState from "./EmptyState";
import styles from "./EventsList.module.scss";
import { formatDate, formatTime, groupEventsByDate } from "@/helpers/date";
import { Leaf } from "lucide-react";
import { iconMap } from "@/types/environment";
import TypeIcon from "@/components/TypeIcon/TypeIcon";
import { getEventConfig } from "@/config/icons";

export interface BaseEvent {
    id: string;
    type: string;
    timestamp: number;
    notes?: string;

    customIconName?: keyof typeof iconMap;
    customBgColor?: string;
    customTextColor?: string;
    customBorderColor?: string;
}

interface EventsListProps<T extends BaseEvent> {
    events: T[];
    emptyMessage: string;
    getTitle: (event: T) => string;
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

export default function EventsList<T extends BaseEvent>({
    events,
    emptyMessage,
    getTitle,
    children,
}: EventsListProps<T>) {
    if (!events || events.length === 0) {
        return <EmptyState message={emptyMessage} />;
    }

    const groups = groupEventsByDate(events);

    return (
        <>
            {groups.map(([date, groupedEvents]) => (
                <section key={date}>
                    <header className={styles.dateHeader}>
                        <h3 className={styles.dateTitle}>
                            {formatDate(new Date(date).getTime())}
                        </h3>
                        <div className={styles.dateLine} />
                    </header>

                    <ol className={styles.eventsGrid}>
                        {groupedEvents.map(event => (
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
        </>
    );
}