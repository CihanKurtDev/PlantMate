"use client";

import { EnvironmentEvent } from '@/types/environment';
import TabContent from "@/components/TabContent/TabContent";
import EventsList from "./shared/EventsList";
import { Card } from "@/components/Card/Card";
import { getEventConfig } from "@/config/icons";

interface EnvironmentEventTabProps {
    events?: EnvironmentEvent[];
    onAddEvent?: () => void;
}

export default function EnvironmentEventTab({ events, onAddEvent }: EnvironmentEventTabProps) {
    return (
        <TabContent id="events">
            <Card title="events" collapsible={true}>
                <EventsList
                    events={events ?? []}
                    emptyMessage="Trage mindestens 1 Event ein um deinen Verlauf zu sehen."
                    onAddEvent={onAddEvent}
                    getTitle={(event) => {
                        const config = getEventConfig(event.type);
                        return (
                            event.equipmentChange?.equipment ??
                            config?.label ??
                            event.type
                        );
                    }}
                />
            </Card>
        </TabContent>
    );
}