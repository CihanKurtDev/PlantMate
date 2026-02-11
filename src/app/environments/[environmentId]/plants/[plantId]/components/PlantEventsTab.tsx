import TabContent from '../../../components/shared/TabContent';
import { useState } from 'react';
import PlantEventForm from './PlantEventForm';
import EventsList from '../../../components/shared/EventsList';
import { PlantEvent } from '@/types/plant';
import { Card } from '@/components/Card/Card';
import { getEventConfig } from '@/config/icons';

interface PlantEventsTabProps {
    events?: PlantEvent[];
    plantId: string;
}

export default function PlantEventsTab({ plantId, events }: PlantEventsTabProps) {
    const [isAddingEvent, setIsAddingEvent] = useState(false);
    
    return (
        <TabContent id="Ereignisse">
            <Card 
                collapsible={true}
                title="Events"
            >
                {!isAddingEvent ? (
                    <EventsList
                        events={events ?? []}
                        emptyMessage="Keine Events für diese Pflanze vorhanden"
                        getTitle={(event) => {
                            const config = getEventConfig(event.type);
                            return config?.label ?? event.type.replace(/_/g, ' ');
                        }}
                    />
                ) : (
                    <PlantEventForm
                        plantId={plantId}
                        onCancel={() => setIsAddingEvent(false)}
                        onSave={() => setIsAddingEvent(false)}
                    />
                )}
            </Card> 
        </TabContent>
    );
}