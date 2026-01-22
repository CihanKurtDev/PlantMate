import { Button } from '@/components/Button/Button';
import TabContent from '../../../components/shared/TabContent';
import { useState } from 'react';
import PlantEventForm from './PlantEventForm';
import EventsList from '../../../components/shared/EventsList';
import { PLANT_EVENT_MAP } from '@/config/plant';
import { PlantEvent } from '@/types/plant';

interface PlantEventsTabProps {
    events?: PlantEvent[];
    hidden: boolean;
    plantId: string;
}

export default function PlantEventsTab({ hidden, plantId, events }: PlantEventsTabProps) {
    const [isAddingEvent, setIsAddingEvent] = useState(false);
    
    if (hidden) return null;

    return (
        <TabContent title="Ereignisse">
            {!isAddingEvent ? (
                <>
                    <Button onClick={() => setIsAddingEvent(true)}>Neues Event</Button>
                    <EventsList
                        events={events ?? []}
                        emptyMessage="Keine Events für diese Pflanze vorhanden"
                        eventMap={PLANT_EVENT_MAP}
                        getTitle={(event) => PLANT_EVENT_MAP[event.type]?.label ?? event.type.replace(/_/g, ' ')}
                    />
                </>
            ) : (
                <PlantEventForm
                    plantId={plantId}
                    onCancel={() => setIsAddingEvent(false)}
                    onSave={() => setIsAddingEvent(false)}
                />
            )}
        </TabContent>
    );
}
