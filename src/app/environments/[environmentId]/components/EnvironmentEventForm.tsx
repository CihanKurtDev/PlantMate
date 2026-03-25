"use client";

import { EnvironmentEvent } from "@/types/environment";
import EventForm from "./shared/EventForm";
import { EventFormData, extractCustomFields } from "@/types/events";
import { useModal } from "@/context/ModalContext";
import { ENVIRONMENT_EVENT_FORM_CONFIG } from "@/config/environment";
import { useEnvironment } from "@/context/EnvironmentContext";

interface EnvironmentEventFormProps {
    environmentId: string;
}

export default function EnvironmentEventForm({ environmentId }: EnvironmentEventFormProps) {
    const { addEventToEnvironment } = useEnvironment();
    const { closeModal } = useModal();

    const handleSubmit = (eventData: EventFormData) => {
        const { type, timestamp, notes, extra } = eventData;
        const { resolvedType, ...customFields } = extractCustomFields(type, extra);

        const newEvent: EnvironmentEvent = {
            id: Date.now().toString(),
            environmentId,
            timestamp,
            notes: notes || undefined,
            type: resolvedType,
            ...customFields,
            equipmentChange:
                type === "Equipment_Change" && extra.equipment
                    ? {
                        equipment: extra.equipment as string,
                        action: extra.action as "ADDED" | "REMOVED" | "REPLACED",
                      }
                    : undefined,
        };

        addEventToEnvironment(environmentId, newEvent);
        closeModal();
    };

    return (
        <EventForm
            title="Neues Ereignis hinzufügen"
            eventFormConfig={ENVIRONMENT_EVENT_FORM_CONFIG}
            defaultEventType="Equipment_Change"
            onSubmit={handleSubmit}
            onCancel={closeModal}
        />
    );
}