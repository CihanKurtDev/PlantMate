import TabContent from "./TabContent";
import EmptyState from "./EmptyState";
import styles from "./EventsList.module.scss";
import { formatDate, formatTime, groupEventsByDate } from "@/helpers/date";
import { Leaf, Settings, Sparkles, Thermometer, Wrench } from "lucide-react";
import { iconMap } from "@/types/environment";
import { Card } from "@/components/Card/Card";
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
            <div className={styles.eventTitleWrapper}>
                <div className={styles.eventInfoWrapper}>
                    <TypeIcon
                        icon={IconComponent}
                        variant={event.customBgColor ? undefined : event.type}
                        customBgColor={event.customBgColor}
                        customTextColor={event.customTextColor}
                        customBorderColor={event.customBorderColor}
                    />
                    <h4>{title}</h4>
                    <p className={styles.eventNotes}>{event.notes ?? null}</p>
                </div>

                <EventBadge event={event} />
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
        return (
            <TabContent id="events" title="Ereignisse">
                <EmptyState message={emptyMessage} />
            </TabContent>
        );
    }

    const groups = groupEventsByDate(events);

    return (
        <Card 
            collapsible={true}
            title="Events"
        > 
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
        </Card>
    );
}
