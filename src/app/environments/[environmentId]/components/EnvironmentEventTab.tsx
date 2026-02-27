"use client";

import { EnvironmentEvent } from '@/types/environment';
import TabContent from "./shared/TabContent";
import EventsList from "./shared/EventsList";
import { Card } from "@/components/Card/Card";
import { getEventConfig } from "@/config/icons";

interface EnvironmentEventTabProps {
    events?: EnvironmentEvent[];
}

export default function EnvironmentEventTab({ events }: EnvironmentEventTabProps) {

    return (
        <TabContent id="events">
            <Card title="events" collapsible={true}>
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
            </Card>
        </TabContent>
    );
}