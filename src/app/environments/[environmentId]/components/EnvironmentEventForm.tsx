"use client";

import { useState } from "react";
import { Button } from "@/components/Button/Button";
import { usePlantMonitor } from "@/context/PlantMonitorContext";
import Form, { FormField, FormSectionTitle } from "@/components/Form/Form";
import { EnvironmentEventType, EnvironmentEvent } from "@/types/environment";

interface EnvironmentEventFormProps {
    environmentId: string;
    onCancel: () => void;
    onSave: () => void;
}

export default function EnvironmentEventForm({ environmentId, onCancel, onSave }: EnvironmentEventFormProps) {
    const { addEventToEnvironment } = usePlantMonitor();
    const [type, setType] = useState<EnvironmentEventType>("Climate_Adjustment");
    const [notes, setNotes] = useState("");

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        const newEvent: EnvironmentEvent = {
            id: Date.now().toString(),
            environmentId,
            type,
            notes,
            timestamp: Date.now(),
        };

        addEventToEnvironment(environmentId, newEvent);

        onSave();
    };

    return (
        <Form onSubmit={handleSubmit}>
            <FormSectionTitle>Neues Ereignis hinzufügen</FormSectionTitle>

            <FormField>
                <label htmlFor="event-type">Event Typ</label>
                <select
                    id="event-type"
                    value={type}
                    onChange={e => setType(e.target.value as EnvironmentEventType)}
                >
                    <option value="Climate_Adjustment">Klimaanpassung</option>
                    <option value="Equipment_Change">Gerätewechsel</option>
                    <option value="Cleaning">Reinigung</option>
                    <option value="Maintenance">Wartung</option>
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
