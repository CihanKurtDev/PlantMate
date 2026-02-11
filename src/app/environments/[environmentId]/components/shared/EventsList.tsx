import EmptyState from "./EmptyState";
import styles from "./EventsList.module.scss";
import { formatDate, formatTime, groupEventsByDate } from "@/helpers/date";
import { Leaf, Settings, Sparkles, Thermometer, Wrench } from "lucide-react";
import { iconMap } from "@/types/environment";
import TypeIcon from "@/components/TypeIcon/TypeIcon";

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

interface EventCardProps {
    event: BaseEvent;
    title: string;
    eventMap?: Record<string, EventMapItem>;
}

const ICONS: Record<string, any> = {
    Climate_Adjustment: Thermometer,
    Equipment_Change: Settings,
    Maintenance: Wrench,
    Cleaning: Sparkles,
};

const EventCard = ({ event, title }: EventCardProps) => {
    const IconComponent = event.customIconName ? iconMap[event.customIconName] : ICONS[event.type] || Leaf;

    return (
        <article className={styles.card}>
            <TypeIcon
                icon={IconComponent}
                variant={event.customBgColor ? undefined : event.type}
                customBgColor={event.customBgColor}
                customTextColor={event.customTextColor}
                customBorderColor={event.customBorderColor}
            />
            <div className={styles.eventInfoWrapper}>
                <h4>{title}</h4>
                {event.notes && <p className={styles.eventNotes}>{event.notes}</p>}
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
    eventMap,
}: EventsListProps<T>) {
    if (!events || events.length === 0) {
        return <EmptyState message={emptyMessage} />
    }

    const groups = groupEventsByDate(events);

    return (
        <>
            {groups.map(([date, groupedEvents]) => (
                <section className={styles.dateSection} key={date}>
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
