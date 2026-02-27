"use client";

import { usePlantMonitor } from "@/context/PlantMonitorContext";
import { PlantEvent } from "@/types/plant";
import EventForm from "../../../components/shared/EventForm";
import { EventFormData, extractCustomFields } from "@/types/events";
import { useModal } from "@/context/ModalContext";
import { PLANT_EVENT_FORM_CONFIG } from "@/config/plant";

interface PlantEventFormProps {
    plantId: string;
}

export default function PlantEventForm({ plantId }: PlantEventFormProps) {
    const { addEventToPlant } = usePlantMonitor();
    const { closeModal } = useModal();

    const handleSubmit = (eventData: EventFormData) => {
        const { type, timestamp, notes, extra } = eventData;
        const { resolvedType, ...customFields } = extractCustomFields(type, extra);

        const newEvent: PlantEvent = {
            id: Date.now().toString(),
            plantId,
            timestamp,
            notes: notes || undefined,
            type: resolvedType,
            ...customFields,
            repotting:
                type === "REPOTTING" && extra.newPotSize != null
                    ? {
                        newPotSize: { value: Number(extra.newPotSize), unit: "L" },
                        oldPotSize: extra.oldPotSize != null
                        ? { value: Number(extra.oldPotSize), unit: "L" }
                            : undefined,
                        substrate: extra.substrate as string | undefined,
                      }
                    : undefined,
            pestControl:
                type === "PEST_CONTROL"
                    ? { pest: extra.pest as string, treatment: extra.treatment as string }
                    : undefined,
            fertilizing:
                type === "FERTILIZING" && extra.fertilizer
                    ? {
                        fertilizer: extra.fertilizer as string,
                        amount: extra.amount != null
                            ? { value: Number(extra.amount), unit: "ml" as const }
                            : undefined,
                      }
                    : undefined,
        };

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