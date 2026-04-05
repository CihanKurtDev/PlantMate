"use client";

import { EnvironmentEvent } from "@/types/environment";
import EventForm from "./shared/EventForm";
import { EventFormData } from "@/types/events";
import { useModal } from "@/context/ModalContext";
import { ENVIRONMENT_EVENT_FORM_CONFIG } from "@/config/environment";
import { useEnvironment } from "@/context/EnvironmentContext";
import { mapEventFormToEnvironmentEvent } from "@/helpers/eventMappers";
import { useToast } from "@/context/ToastContext";

interface EnvironmentEventFormProps {
    environmentId: string;
}

export default function EnvironmentEventForm({ environmentId }: EnvironmentEventFormProps) {
    const { addEventToEnvironment } = useEnvironment();
    const { closeModal } = useModal();
    const { addToast } = useToast();

    const handleSubmit = (eventData: EventFormData) => {
        const newEvent: EnvironmentEvent = mapEventFormToEnvironmentEvent(eventData, environmentId);

        addEventToEnvironment(environmentId, newEvent);
        closeModal();
        addToast("Event erstellt");
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