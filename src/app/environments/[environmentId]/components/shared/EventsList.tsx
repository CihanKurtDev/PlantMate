import TabContent from "./TabContent";
import EmptyState from "./EmptyState";
import styles from "./EventsList.module.scss";
import { formatDate, formatTime, groupEventsByDate } from "@/helpers/date";
import { Leaf } from "lucide-react";
import { iconMap } from "@/types/environment";


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

const DEFAULT_ICON = Leaf;

export const EventIcon = ({event, eventMap}: {event: BaseEvent; eventMap?: Record<string, EventMapItem>}) => {
    let Icon: React.ComponentType<{ size?: number }> | undefined;

    // wenn customIcon dann den ensprechenden icon aus dem iconMap nehmen
    // iconMap ist liste der icons die zur verfügung stehen um custom icons zu erstellen
    if (event.customIconName) {
        Icon = iconMap[event.customIconName];
    }

    // wenn kein customIcon dann im eventMap nachschauen
    // das sind die standard icons für die vordefinierten event types
    if (!Icon && eventMap && eventMap[event.type]) {
        Icon = eventMap[event.type].icon;
    }

    if (!Icon) {
        Icon = DEFAULT_ICON;
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

            <p className={styles.eventNotes}>{event.notes ? event.notes : null}</p>
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
        <>
            {groups.map(([date, groupedEvents]) => (
                <section key={date}>
                    <header className={styles.dateHeader}>
                        <h4>{formatDate(new Date(date).getTime())}</h4>
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
                                        eventMap={eventMap}
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
