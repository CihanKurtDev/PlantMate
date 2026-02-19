"use client";

import { usePlantMonitor } from "@/context/PlantMonitorContext";
import { EnvironmentEvent } from "@/types/environment";
import EventForm, { EventOption } from "./shared/EventForm";
import { EventFormData } from "@/types/events";
import { useModal } from "@/context/ModalContext";

interface EnvironmentEventFormProps {
    environmentId: string;
}

const environmentEventOptions: EventOption[] = [
    { value: "Equipment_Change", label: "Gerätewechsel" },
    { value: "Maintenance", label: "Wartung" },
    { value: "Cleaning", label: "Reinigung" },
    { value: "custom", label: "Eigenes Event" },
];

export default function EnvironmentEventForm({ environmentId }: EnvironmentEventFormProps) {
    const { addEventToEnvironment } = usePlantMonitor();
    const { closeModal } = useModal()

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
        closeModal()
    };

    return (
        <EventForm
            title="Neues Ereignis hinzufügen"
            eventOptions={environmentEventOptions}
            defaultEventType="Equipment_Change"
            onSubmit={handleSubmit}
            onCancel={closeModal}
        />
    );
}
