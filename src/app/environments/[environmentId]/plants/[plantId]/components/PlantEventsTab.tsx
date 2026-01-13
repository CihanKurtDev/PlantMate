import { PlantEvent } from '@/types/plant';
import EventsTab from '../../../components/shared/EventsTab';
import { PLANT_EVENT_MAP } from '@/config/plant';

interface PlantEventsTabProps {
    events: PlantEvent[];
}

export default function PlantEventsTab({ events }: PlantEventsTabProps) {
    return (
        <EventsTab
            events={events}
            emptyMessage="Keine Ereignisse vorhanden"
            eventMap={PLANT_EVENT_MAP}
            getTitle={(event) =>
                PLANT_EVENT_MAP[event.type]?.label ?? event.type.replace(/_/g, ' ')
            }
        >
            {(event) => (
                <>
                    {event.watering && (
                        <p>
                            Menge: {event.watering.amount.value} {event.watering.amount.unit}
                        </p>
                    )}

                    {event.repotting && (
                        <p>
                            Neuer Topf: {event.repotting.newPotSize.value} {event.repotting.newPotSize.unit}
                        </p>
                    )}
                </>
            )}
        </EventsTab>
    );
}
