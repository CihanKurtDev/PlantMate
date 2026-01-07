import { Activity, Droplet, Thermometer, Wind } from 'lucide-react';
import { groupEventsByDate, formatTime, formatDate } from '../../../helpers/date';
import styles from './EventTab.module.scss';
import { EnvironmentEvent } from '@/types/environment';

//TODO: Die Komponente refactoren wahrcheinlich TabContent was dynamsich befüllt werden kann
// mit children und restlichen aufbau teilen die sich

interface EventsTabProps {
    events: EnvironmentEvent[];
}

export default function EventsTab({ events }: EventsTabProps) {
    const groups = groupEventsByDate(events);
      
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

    return (
        <section>
            <h2 className={styles.sectionHeading}>
                Ereignisse
            </h2>
            {groups.map(([date, evts]) => (
                <div key={date}>
                    <div className={styles.dateHeader}>
                        <h4>{formatDate(new Date(date).getTime())}</h4>
                    </div>
                    <ol  className={styles.timelineList}>
                        {evts.map(event => (
                            <li key={event.id} className={styles.timelineItem}>
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
                        ))}
                    </ol>
                </div>
            ))}
        </section>
    );
}
