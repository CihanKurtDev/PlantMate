"use client";

import { usePlantMonitor } from "@/context/PlantMonitorContext";
import { PlantEvent, PlantEventType } from "@/types/plant";
import EventForm, { EventFormData, EventOption } from "../../../components/shared/EventForm";

interface PlantEventFormProps {
    plantId: string;
    onCancel: () => void;
    onSave: () => void;
}

const plantEventOptions: EventOption[] = [
    { value: "WATERING", label: "Wässern" },
    { value: "REPOTTING", label: "Umtopfen" },
    { value: "FERTILIZING", label: "Düngen" },
    { value: "PEST_CONTROL", label: "Schädlingsbekämpfung" },
    { value: "PRUNING", label: "Beschneiden" },
    { value: "custom", label: "Eigenes Event" },
];

export default function PlantEventForm({ plantId, onCancel, onSave }: PlantEventFormProps) {
    const { addEventToPlant } = usePlantMonitor();

    const handleSubmit = (eventData: EventFormData<PlantEventType>) => {
        const isCustom = eventData.type === "custom";
        
        const newEvent: PlantEvent = {
            id: Date.now().toString(),
            plantId,
            timestamp: Date.now(),
            type: isCustom ? eventData.customName : eventData.type,
            notes: eventData.notes || undefined,
            customIconName: isCustom ? eventData.customIconName : undefined,
            customBgColor: isCustom ? eventData.customBgColor : undefined,
            customTextColor: isCustom ? eventData.customTextColor : undefined,
            customBorderColor: isCustom ? eventData.customBorderColor : undefined,
        };

        addEventToPlant(plantId, newEvent);
        onSave();
    };

    return (
        <EventForm<PlantEventType>
            title="Neues Ereignis hinzufügen"
            eventOptions={plantEventOptions}
            defaultEventType="WATERING"
            onSubmit={handleSubmit}
            onCancel={onCancel}
        />
    );
}