import { Sprout, Droplets, Activity, Leaf } from 'lucide-react';
import { formatDate, formatTime, groupEventsByDate } from '@/helpers/date';
import styles from './EventTab.module.scss';
import { PlantEvent } from '@/types/plant';
import TabContent from '../../../components/TabContent';
import EmptyState from '../../../components/shared/EmptyState';

interface PlantEventsTabProps {
  events: PlantEvent[];
}

export default function EventTab({ events }: PlantEventsTabProps) {
    if (!events || events.length === 0) {
        return (
            <TabContent id="events" title="Ereignisse">
                <EmptyState message="Keine Ereignisse vorhanden" />
            </TabContent>
        );
    }
    
    const groups = groupEventsByDate(events);


    const getEventIcon = (type: PlantEvent['type']) => {
        switch (type) {
            case 'WATERING':
                return <Droplets size={16} />;
            case 'FERTILIZING':
                return <Leaf size={16} />;
            case 'REPOTTING':
                return <Sprout size={16} />;
            case 'PEST_CONTROL':
                return <Activity size={16} />;
            case 'PRUNING':
                return <Activity size={16} />;
            default:
                return <Activity size={16} />;
        }
    };

    const EventItem = ({ event }: { event: PlantEvent }) => (
        <li className={styles.timelineItem}>
            <article className={styles.card}>
                <div className={styles.eventTop}>
                    <div className={styles.eventTitleWrapper}>
                        <h4 className={styles.eventTitle}>
                            <span className={`${styles.timelineIcon} ${styles[event.type]}`}>
                                {getEventIcon(event.type)}
                            </span>
                            {event.type.replace(/_/g, ' ')}
                        </h4>
                        <span className={`${styles.badge} ${styles[event.type]}`}>
                            {event.type.replace(/_/g, ' ')}
                        </span>
                    </div>
                    <span className={styles.eventTime}>{formatTime(event.timestamp)}</span>
                </div>

                <div className={styles.eventContent}>
                    {event.notes && <p className={styles.eventNotes}>{event.notes}</p>}

                    {event.watering && (
                        <p>
                            Menge: {event.watering.amount.value} {event.watering.amount.unit}
                            {event.watering.nutrients?.ph && `, pH: ${event.watering.nutrients.ph.value}`}
                            {event.watering.nutrients?.ec && `, EC: ${event.watering.nutrients.ec.value}`}
                        </p>
                    )}

                    {event.repotting && (
                        <p>
                            Neuer Topf: {event.repotting.newPotSize.value} {event.repotting.newPotSize.unit}
                            {event.repotting.substrate && `, Substrat: ${event.repotting.substrate}`}
                        </p>
                    )}

                    {event.fertilizing && (
                        <p>
                            Dünger: {event.fertilizing.fertilizer}
                            {event.fertilizing.amount && `, Menge: ${event.fertilizing.amount.value} ${event.fertilizing.amount.unit}`}
                        </p>
                    )}

                    {event.pestControl && (
                        <p>
                            Schädling: {event.pestControl.pest}, Behandlung: {event.pestControl.treatment}
                        </p>
                    )}
                </div>
            </article>
        </li>
    );

    const EventGroup = ({ date, events }: { date: string; events: PlantEvent[] }) => (
        <div key={date}>
            <header className={styles.dateHeader}>
                <h4>{formatDate(new Date(date).getTime())}</h4>
            </header>
            <ol className={styles.timelineList}>
                {events.map(event => (
                    <EventItem key={event.id} event={event} />
                ))}
            </ol>
        </div>
    );

    return (
        <TabContent id="events" title="Ereignisse">
            <div className={styles.eventsGrid}>
                {groups.map(([date, events]) => (
                    <EventGroup key={date} date={date} events={events} />
                ))}
            </div>
        </TabContent>
    );
}
