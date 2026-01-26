"use client";

import { usePlantMonitor } from "@/context/PlantMonitorContext";
import { PlantEvent } from "@/types/plant";
import EventForm, { EventOption } from "../../../components/shared/EventForm";
import { EventFormData } from "@/types/events";

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

    const handleSubmit = (eventData: EventFormData) => {
        const isCustom = eventData.type === "custom";
        const isWatering = eventData.type === "WATERING";

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
            ...(isWatering && eventData.waterAmount !== undefined && (
                {
                    watering: {
                        amount: { value: eventData.waterAmount, unit: 'ml' },
                        nutrients: {
                            ...(eventData.waterPh !== undefined && { ph: { value: eventData.waterPh, unit: 'pH' } }),
                            ...(eventData.waterEc !== undefined && { ec: { value: eventData.waterEc, unit: 'mS/cm' } }),
                        }
                    }
                }
            ))
        };

        addEventToPlant(plantId, newEvent);
        onSave();
    };

    return (
        <EventForm
            title="Neues Ereignis hinzufügen"
            eventOptions={plantEventOptions}
            defaultEventType="WATERING"
            onSubmit={handleSubmit}
            onCancel={onCancel}
        />
    );
}