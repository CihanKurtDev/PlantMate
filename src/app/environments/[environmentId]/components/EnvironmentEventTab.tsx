"use client";

import { useState } from "react";
import { ENVIRONMENT_EVENT_MAP } from '@/config/environment';
import { EnvironmentEvent } from '@/types/environment';
import EnvironmentEventForm from "./EnvironmentEventForm";
import TabContent from "./shared/TabContent";
import EventsList from "./shared/EventsList";
import { Card } from "@/components/Card/Card";

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
                        eventMap={ENVIRONMENT_EVENT_MAP}
                        getTitle={(event) =>
                            event.climateAdjustment?.setting ??
                            event.equipmentChange?.equipment ??
                            ENVIRONMENT_EVENT_MAP[event.type]?.label ??
                            event.type
                        }
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
