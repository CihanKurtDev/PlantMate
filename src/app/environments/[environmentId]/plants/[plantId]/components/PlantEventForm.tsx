"use client";

import { PlantEvent } from "@/types/plant";
import EventForm from "../../../components/shared/EventForm";
import { EventFormData } from "@/types/events";
import { useModal } from "@/context/ModalContext";
import { PLANT_EVENT_FORM_CONFIG } from "@/config/plant";
import { usePlant } from "@/context/PlantContext";
import { mapEventFormToPlantEvent } from "@/helpers/eventMappers";

interface PlantEventFormProps {
    plantId: string;
}

export default function PlantEventForm({ plantId }: PlantEventFormProps) {
    const { addEventToPlant } = usePlant();
    const { closeModal } = useModal();

    const handleSubmit = (eventData: EventFormData) => {
        const newEvent: PlantEvent = mapEventFormToPlantEvent(eventData, plantId);

        addEventToPlant(plantId, newEvent);
        closeModal();
    };

    return (
        <EventForm
            title="Neues Ereignis hinzufügen"
            eventFormConfig={PLANT_EVENT_FORM_CONFIG}
            defaultEventType="REPOTTING"
            onSubmit={handleSubmit}
            onCancel={closeModal}
        />
    );
}