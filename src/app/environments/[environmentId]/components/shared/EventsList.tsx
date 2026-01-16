import TabContent from "./TabContent";
import EmptyState from "./EmptyState";
import styles from "./EventsList.module.scss";
import { formatDate, formatTime, groupEventsByDate } from "@/helpers/date";

export interface BaseEvent {
    id: string;
    type: string;
    timestamp: number;
    notes?: string;

    customIcon?: React.ComponentType<any>;
    customBgColor?: string;
    customTextColor?: string;
    customBorderColor?: string;
}

interface EventMapItem {
    icon: React.ComponentType<any>;
    label: string;
}

interface EventsListProps<T extends BaseEvent> {
    events: T[];
    emptyMessage: string;
    getTitle: (event: T) => string;
    children?: (event: T) => React.ReactNode;
    eventMap?: Record<string, EventMapItem>;
}

const getCustomStyle = (event: BaseEvent): React.CSSProperties | undefined => {
    if (!event.customBgColor) {
        return;
    }

    return {
        backgroundColor: event.customBgColor,
        color: event.customTextColor,
        borderColor: event.customBorderColor,
    };
};

const joinClassNames = (base: string, extra?: string): string => {
    if (extra) {
        return `${base} ${extra}`;
    }

    return base;
};


const getTypeClass = (event: BaseEvent): string | undefined => {
    if (event.customBgColor) {
        return;
    }

    return styles[event.type];
};

const getEventLabel = ( event: BaseEvent, eventMap?: Record<string, EventMapItem> ): string => {
    if (event.customBgColor) {
        return event.type;
    }

    if (eventMap && eventMap[event.type]) {
        return eventMap[event.type].label;
    }

    return event.type;
};

const EventIcon = ({event, eventMap}: {event: BaseEvent, eventMap?: Record<string, EventMapItem>}) => {
    let Icon: React.ComponentType<any> | undefined;

    if (event.customIcon) {
        Icon = event.customIcon;
    } else if (eventMap && eventMap[event.type]) {
        Icon = eventMap[event.type].icon;
    }

    if (!Icon) {
        return null;
    }

    return <Icon size={16} />;
};

export const EventBadge = ({event, eventMap }: { event: BaseEvent; eventMap?: Record<string, EventMapItem> }) => {
    const style = getCustomStyle(event);
    const label = getEventLabel(event, eventMap);
    const typeClass = getTypeClass(event);
    const className = joinClassNames(styles.badge, typeClass);

    return (
        <span className={className} style={style}>
            {label}
        </span>
    );
};

interface EventCardProps {
    event: BaseEvent;
    title: string;
    eventMap?: Record<string, EventMapItem>;
}

const EventCard = ({ event, title, eventMap }: EventCardProps) => {
    const style = getCustomStyle(event);
    const typeClass = getTypeClass(event);
    const iconClassName = joinClassNames(styles.timelineIcon, typeClass);

    return (
        <article className={styles.card}>
            <div className={styles.eventTop}>
                <div className={styles.eventTitleWrapper}>
                    <h4 className={styles.eventTitle}>
                        <span className={iconClassName} style={style}>
                            <EventIcon event={event} eventMap={eventMap} />
                        </span>
                        {title}
                    </h4>

                    <EventBadge event={event} eventMap={eventMap} />
                </div>

                <span className={styles.eventTime}>
                    {formatTime(event.timestamp)}
                </span>
            </div>

            {event.notes ? (
                <p className={styles.eventNotes}>{event.notes}</p>
            ) : null}
        </article>
    );
};

export default function EventsList<T extends BaseEvent>({
    events,
    emptyMessage,
    getTitle,
    children,
    eventMap,
}: EventsListProps<T>) {
    if (!events || events.length === 0) {
        return (
            <TabContent id="events" title="Ereignisse">
                <EmptyState message={emptyMessage} />
            </TabContent>
        );
    }

    const groups = groupEventsByDate(events);

    return (
        <div className={styles.eventsGrid}>
            {groups.map(([date, groupedEvents]) => (
                <div key={date}>
                    <header className={styles.dateHeader}>
                        <h4>{formatDate(new Date(date).getTime())}</h4>
                    </header>

                    <ol className={styles.timelineList}>
                        {groupedEvents.map(event => (
                            <li key={event.id} className={styles.timelineItem}>
                                {children ? (
                                    children(event)
                                ) : (
                                    <EventCard
                                        event={event}
                                        title={getTitle(event)}
                                        eventMap={eventMap}
                                    />
                                )}
                            </li>
                        ))}
                    </ol>
                </div>
            ))}
        </div>
    );
}
