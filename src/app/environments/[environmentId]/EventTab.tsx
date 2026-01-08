import { Activity, Droplet, Thermometer, Wind } from 'lucide-react';
import { groupEventsByDate, formatTime, formatDate } from '../../../helpers/date';
import styles from './EventTab.module.scss';
import { EnvironmentEvent } from '@/types/environment';
import TabContent from './TabContent';
import EmptyState from './EmptyState';

//TODO: Die Komponente refactoren wahrcheinlich TabContent was dynamsich befüllt werden kann
// mit children und restlichen aufbau teilen die sich

interface EventsTabProps {
    events: EnvironmentEvent[];
}

export default function EventsTab({ events }: EventsTabProps) {
    const groups = groupEventsByDate(events);
    
    if (!groups || groups.length === 0) {
        return (
            <TabContent id="events" title="Ereignisse">
                <EmptyState message="Keine Events vorhanden" />
            </TabContent>
        );
    }
      
    const getEventIcon = (type: EnvironmentEvent['type']) => {
        switch (type) {
        case 'Climate_Adjustment':
            return <Thermometer size={16} />;
        case 'Equipment_Change':
            return <Activity size={16} />;
        case 'Maintenance':
            return <Wind size={16} />;
        case 'Cleaning':
            return <Droplet size={16} />;
        default:
            return <Activity size={16} />;
        }
    };

    //TODO: filter für events einbauen beipsiel: Heute | 7 Tage | 30 Tage | Alles 

    const EventItem = ({ event }: { event: EnvironmentEvent }) => (
        <li className={styles.timelineItem}>
            <article className={styles.card}>
                <div className={styles.eventTop}>
                    <div className={styles.eventTitleWrapper}>
                        <h4 className={styles.eventTitle}>
                            <span className={`${styles.timelineIcon} ${styles[event.type]}`}>
                                {getEventIcon(event.type)}
                            </span>
                            {
                                event.climateAdjustment?.setting ??
                                event.equipmentChange?.equipment ??
                                event.type.replace(/_/g, ' ')
                            }
                        </h4>
                        <span className={`${styles.badge} ${styles[event.type]}`}>
                            {event.type.replace(/_/g, ' ')}
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
        </li>
    )

    const EventGroup = ({ date, events }: { date: string; events: EnvironmentEvent[] }) => (
        <div key={date}>
            <div className={styles.dateHeader}>
                <h4>{formatDate(new Date(date).getTime())}</h4>
            </div>
            <ol  className={styles.timelineList}>
                {events.map(event => (
                    <EventItem key={event.id} event={event} />
                ))}
            </ol>
        </div>
    )

    return (
        <TabContent id="events" title="Ereignisse">
            {groups.map(([date, events]) => (
                <EventGroup key={date} date={date} events={events} /> 
            ))}
        </TabContent>
    );
}
