"use client";

import { useState } from "react";
import { EnvironmentEvent } from '@/types/environment';
import EnvironmentEventForm from "./EnvironmentEventForm";
import TabContent from "./shared/TabContent";
import EventsList from "./shared/EventsList";
import { Card } from "@/components/Card/Card";
import { getEventConfig } from "@/config/icons";

interface EnvironmentEventTabProps {
    events?: EnvironmentEvent[];
    environmentId: string;
}

export default function EnvironmentEventTab({ events, environmentId }: EnvironmentEventTabProps) {
    const [isAddingEvent, setIsAddingEvent] = useState(false);

    return (
        <TabContent id="events">
            <Card title="events" collapsible={true}>
                {!isAddingEvent ? (
                    <EventsList
                        events={events ?? []}
                        emptyMessage="Keine Events vorhanden"
                        getTitle={(event) => {
                            const config = getEventConfig(event.type);
                            return (
                                event.equipmentChange?.equipment ??
                                config?.label ??
                                event.type
                            );
                        }}
                    />
                ) : (
                    <EnvironmentEventForm
                        environmentId={environmentId}
                        onCancel={() => setIsAddingEvent(false)}
                        onSave={() => setIsAddingEvent(false)}
                    />
                )}
            </Card>
        </TabContent>
    );
}