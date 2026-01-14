import { Button } from '@/components/Button/Button';
import TabContent from '../../../components/shared/TabContent';
import { useState } from 'react';
import PlantEventForm from './PlantEventForm';
import { usePlantMonitor } from '@/context/PlantMonitorContext';
import EventsList from '../../../components/shared/EventsList';
import { PLANT_EVENT_MAP } from '@/config/plant';

interface PlantEventsTabProps {
    hidden: boolean;
    plantId: string;
}

export default function PlantEventsTab({ hidden, plantId  }: PlantEventsTabProps) {
    const [isAddingEvent, setIsAddingEvent] = useState(false);
    const { plants } = usePlantMonitor();
    const plant = plants.find(plant => plant.id === plantId);
    
    if (hidden) return null;

    return (
        <TabContent title="Ereignisse">
            {!isAddingEvent ? (
                <>
                    <Button onClick={() => setIsAddingEvent(true)}>Neues Event</Button>
                    <EventsList
                        events={plant?.events}
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
