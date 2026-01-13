import { EnvironmentEvent } from '@/types/environment';
import EventsTab from './shared/EventsTab';
import { ENVIRONMENT_EVENT_MAP } from '@/config/environment';

interface EnvironmentEventTabProps {
    events: EnvironmentEvent[];
}

export default function EnvironmentEventTab({ events }: EnvironmentEventTabProps) {
    return (
        <EventsTab
            events={events}
            emptyMessage="Keine Events vorhanden"
            eventMap={ENVIRONMENT_EVENT_MAP}
            getTitle={(event) =>
                event.climateAdjustment?.setting ??
                event.equipmentChange?.equipment ??
                ENVIRONMENT_EVENT_MAP[event.type]?.label ??
                event.type
            }
        />
    );
}
