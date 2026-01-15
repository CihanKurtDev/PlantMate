"use client";

import { useState } from "react";
import { Button } from "@/components/Button/Button";
import { ENVIRONMENT_EVENT_MAP } from '@/config/environment';
import { EnvironmentEvent } from '@/types/environment';
import EnvironmentEventForm from "./EnvironmentEventForm";
import TabContent from "./shared/TabContent";
import EventsList from "./shared/EventsList";

interface EnvironmentEventTabProps {
    events: EnvironmentEvent[];
    hidden: boolean;
    environmentId: string;
}

export default function EnvironmentEventTab({ events, hidden, environmentId }: EnvironmentEventTabProps) {
    const [isAddingEvent, setIsAddingEvent] = useState(false);

    if (hidden) return null;

    return (
        <TabContent id="events" title="Ereignisse">
            {!isAddingEvent ? (
                <>
                    <Button onClick={() => setIsAddingEvent(true)}>Neues Event</Button>
                    <EventsList
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
                </>
            ) : (
                <EnvironmentEventForm
                    environmentId={environmentId}
                    onCancel={() => setIsAddingEvent(false)}
                    onSave={() => setIsAddingEvent(false)}
                />
            )}
        </TabContent>
    );
}
