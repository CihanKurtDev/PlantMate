"use client";

import { useState } from "react";
import { Button } from "@/components/Button/Button";
import { usePlantMonitor } from "@/context/PlantMonitorContext";
import Form, { FormField, FormSectionTitle } from "@/components/Form/Form";
import { PlantEventType } from "@/types/plant";

interface PlantEventFormProps {
    plantId: string;
    onCancel: () => void;
    onSave: () => void;
}

export default function PlantEventForm({ plantId, onCancel, onSave }: PlantEventFormProps) {
    const { addEventToPlant } = usePlantMonitor();
    const [type, setType] = useState<PlantEventType>("WATERING");
    const [notes, setNotes] = useState("");

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        addEventToPlant(plantId, {
            id: Date.now().toString(),
            plantId,
            type,
            notes,
            timestamp:  Date.now(),
        });

        onSave();
    };

    return (
        <Form onSubmit={handleSubmit}>
            <FormSectionTitle>Neues Ereignis hinzufügen</FormSectionTitle>

            <FormField>
                <label htmlFor="event-type">Event Typ</label>
                <select id="event-type" value={type} onChange={e => setType(e.target.value as PlantEventType)}>
                    <option value="WATERING">Wässern</option>
                    <option value="REPOTTING">Umtopfen</option>
                    <option value="FERTILIZING">Düngen</option>
                    <option value="PEST_CONTROL">Schädlingsbekämpfung</option>
                    <option value="PRUNING">Beschneiden</option>
                </select>
            </FormField>

            <FormField>
                <label htmlFor="event-notes">Notizen</label>
                <textarea
                    id="event-notes"
                    value={notes}
                    onChange={e => setNotes(e.target.value)}
                    placeholder="Optional: Weitere Details eintragen"
                />
            </FormField>

            <FormField>
                <Button type="submit">Speichern</Button>
                <Button variant="secondary" type="button" onClick={onCancel}>
                    Abbrechen
                </Button>
            </FormField>
        </Form>
    );
}