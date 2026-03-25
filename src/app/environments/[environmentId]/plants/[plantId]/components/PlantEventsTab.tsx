import EventsList from '../../../components/shared/EventsList';
import { PlantEvent } from '@/types/plant';
import { Card } from '@/components/Card/Card';
import { getEventConfig } from '@/config/icons';
import TabContent from '@/components/TabContent/TabContent';

interface PlantEventsTabProps {
    events?: PlantEvent[];
}

export default function PlantEventsTab({  events }: PlantEventsTabProps) {
    
    return (
        <TabContent id="Ereignisse">
            <Card 
                collapsible={true}
                title="Events"
            >
                <EventsList
                    events={events ?? []}
                    emptyMessage="Keine Events für diese Pflanze vorhanden"
                    getTitle={(event) => {
                        const config = getEventConfig(event.type);
                        return config?.label ?? event.type.replace(/_/g, ' ');
                    }}
                />
            </Card> 
        </TabContent>
    );
}