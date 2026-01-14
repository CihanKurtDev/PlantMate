import TabContent from './TabContent';
import EmptyState from './EmptyState';
import styles from './EventsList.module.scss';
import { formatDate, formatTime, groupEventsByDate } from '@/helpers/date';

interface BaseEvent {
    id: string;
    type: string;
    timestamp: number;
    notes?: string;
}

interface EventsListProps<T extends BaseEvent> {
    events: T[];
    emptyMessage: string;
    getTitle: (event: T) => string;
    children?: (event: T) => React.ReactNode;
    eventMap: Record<string, { icon: React.ComponentType<any>; label: string }>;
}

export default function EventsList<T extends BaseEvent>({
    events,
    emptyMessage,
    getTitle,
    children,
    eventMap
}: EventsListProps<T>) {
    if (!events || events.length === 0) {
        return (
            <TabContent id="events" title="Ereignisse">
                <EmptyState message={emptyMessage} />
            </TabContent>
        );
    }

    const groups = groupEventsByDate(events);

    const getIcon = (type: T['type']) => {
        const Icon = eventMap[type]?.icon;
        return Icon ? <Icon size={16} /> : null;
    };

    const getBadge = (type: T['type']) => {
        return eventMap[type]?.label ?? type;
    };

    return (
        <div className={styles.eventsGrid}>
            {groups.map(([date, events]) => (
                <div key={date}>
                    <header className={styles.dateHeader}>
                    <h4>{formatDate(new Date(date).getTime())}</h4>
                    </header>

                    <ol className={styles.timelineList}>
                        {events.map(event => (
                            <li key={event.id} className={styles.timelineItem}>
                                {children ? (
                                    children(event)
                                ) : (
                                    <article className={styles.card}>
                                        <div className={styles.eventTop}>
                                            <div className={styles.eventTitleWrapper}>
                                                <h4 className={styles.eventTitle}>
                                                    <span className={`${styles.timelineIcon} ${styles[event.type]}`}>
                                                        {getIcon(event.type)}
                                                    </span>
                                                    {getTitle(event)}
                                                </h4>

                                                <span className={`${styles.badge} ${styles[event.type]}`}>
                                                    {getBadge(event.type)}
                                                </span>
                                            </div>

                                            <span className={styles.eventTime}>
                                                {formatTime(event.timestamp)}
                                            </span>
                                        </div>

                                        {event.notes && (
                                            <p className={styles.eventNotes}>{event.notes}</p>
                                        )}
                                    </article>
                                )}
                            </li>
                        ))}
                    </ol>
                </div>
            ))}
        </div>
    );
}
