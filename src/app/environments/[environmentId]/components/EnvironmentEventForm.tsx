"use client";

import { usePlantMonitor } from "@/context/PlantMonitorContext";
import { EnvironmentEvent } from "@/types/environment";
import EventForm, { EventOption } from "./shared/EventForm";
import { EventFormData } from "@/types/events";

interface EnvironmentEventFormProps {
    environmentId: string;
    onCancel: () => void;
    onSave: () => void;
}

const environmentEventOptions: EventOption[] = [
    { value: "Climate_Adjustment", label: "Klimaanpassung" },
    { value: "Equipment_Change", label: "Gerätewechsel" },
    { value: "Maintenance", label: "Wartung" },
    { value: "Cleaning", label: "Reinigung" },
    { value: "custom", label: "Eigenes Event" },
];

export default function EnvironmentEventForm({ environmentId, onCancel, onSave }: EnvironmentEventFormProps) {
    const { addEventToEnvironment } = usePlantMonitor();

    const handleSubmit = (eventData: EventFormData) => {
        const isCustom = eventData.type === "custom";
        
        const newEvent: EnvironmentEvent = {
            id: Date.now().toString(),
            environmentId,
            timestamp: Date.now(),
            type: isCustom ? eventData.customName! : eventData.type,
            notes: eventData.notes || undefined,
            customIconName: isCustom ? eventData.customIconName : undefined,
            customBgColor: isCustom ? eventData.customBgColor : undefined,
            customTextColor: isCustom ? eventData.customTextColor : undefined,
            customBorderColor: isCustom ? eventData.customBorderColor : undefined,
        };

        addEventToEnvironment(environmentId, newEvent);
        onSave();
    };

    return (
        <EventForm
            title="Neues Ereignis hinzufügen"
            eventOptions={environmentEventOptions}
            defaultEventType="Climate_Adjustment"
            onSubmit={handleSubmit}
            onCancel={onCancel}
        />
    );
}
