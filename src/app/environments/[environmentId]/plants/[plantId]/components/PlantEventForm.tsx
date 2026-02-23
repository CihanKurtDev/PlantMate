"use client";

import { usePlantMonitor } from "@/context/PlantMonitorContext";
import { PlantEvent } from "@/types/plant";
import EventForm, { EventOption } from "../../../components/shared/EventForm";
import { EventFormData } from "@/types/events";
import { useModal } from "@/context/ModalContext";

interface PlantEventFormProps {
    plantId: string;
}

const plantEventOptions: EventOption[] = [
    { value: "REPOTTING", label: "Umtopfen" },
    { value: "FERTILIZING", label: "Düngen" },
    { value: "PEST_CONTROL", label: "Schädlingsbekämpfung" },
    { value: "PRUNING", label: "Beschneiden" },
    { value: "custom", label: "Eigenes Event" },
];

export default function PlantEventForm({ plantId }: PlantEventFormProps) {
    const { addEventToPlant } = usePlantMonitor();
    const { closeModal } = useModal();

    const handleSubmit = (eventData: EventFormData) => {
        const isCustom = eventData.type === "custom";

        const newEvent: PlantEvent = {
            id: Date.now().toString(),
            plantId,
            timestamp: eventData.timestamp,
            type: isCustom ? eventData.customName! : eventData.type,
            notes: eventData.notes || undefined,
            customIconName: isCustom ? eventData.customIconName : undefined,
            customBgColor: isCustom ? eventData.customBgColor : undefined,
            customTextColor: isCustom ? eventData.customTextColor : undefined,
            customBorderColor: isCustom ? eventData.customBorderColor : undefined,
        };

        addEventToPlant(plantId, newEvent);
        closeModal();
    };

    return (
        <EventForm
            title="Neues Ereignis hinzufügen"
            eventOptions={plantEventOptions}
            defaultEventType="REPOTTING"
            onSubmit={handleSubmit}
            onCancel={closeModal}
        />
    );
}