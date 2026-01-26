import { useState } from "react";
import { BaseEvent, EventBadge, EventIcon } from "./EventsList";
import Form, { FormField, FormSectionTitle } from "@/components/Form/Form";
import { Button } from "@/components/Button/Button";
import styles from "./EventForm.module.scss"
import DatePicker from "./DatePicker";
import { EventFormData } from "@/types/events";
import { iconMap } from "@/types/environment";


interface EventFormProps<T extends string> {
    title?: string;
    eventOptions: EventOption[];
    defaultEventType: T;
    onSubmit: (eventData: EventFormData) => void;
    onCancel: () => void;
}

export interface EventOption {
    value: string;
    label: string;
}


export default function EventForm<T extends string>({ 
    onCancel, 
    onSubmit,
    title = "Neues Ereignis hinzufügen",
    defaultEventType,
    eventOptions,
}: EventFormProps<T>) {
    const [formData, setFormData] = useState<EventFormData>({
        type: defaultEventType,
        customName: "",
        customIconName: "Leaf",
        customBgColor: "#e0e0e0",
        customTextColor: "#424242",
        customBorderColor: "#bdbdbd",
        notes: "",
        timestamp: Date.now()
    });

    const isCustom = formData.type === "custom";
    const isWatering = formData.type === "WATERING";

    const handleChange = (field: keyof EventFormData, value: any) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (isCustom && !formData.customName?.trim()) {
            alert("Bitte gib einen Namen für dein eigenes Event ein.");
            return;
        }

        onSubmit(formData);
    };

    const previewEvent: BaseEvent = {
        id: "preview",
        type: formData.customName || "Vorschau",
        timestamp: formData.timestamp,
        customIconName: formData.customIconName,
        customBgColor: formData.customBgColor,
        customTextColor: formData.customTextColor,
        customBorderColor: formData.customBorderColor,
        notes: "",
    };

    return (
        <Form onSubmit={handleSubmit}>
            <FormSectionTitle>{title}</FormSectionTitle>

            <FormField>
                <DatePicker
                    value={formData.timestamp}
                    onChange={(timestamp) => handleChange("timestamp", timestamp)}
                    label="Datum"
                />
            </FormField>

            <FormField>
                <label htmlFor="event-type">Event Typ</label>
                <select id="event-type" value={formData.type} onChange={e => handleChange("type", e.target.value)}>
                    {eventOptions.map(option => (
                        <option key={option.value} value={option.value}>
                            {option.label}
                        </option>
                    ))}
                </select>
            </FormField>

            {isCustom && (
                <>
                    <FormField>
                        <label htmlFor="event-name">Eigenes Event</label>
                        <input
                            id="event-name"
                            type="text"
                            value={formData.customName}
                            onChange={e => handleChange("customName", e.target.value)}
                            placeholder="Name des Events"
                        />
                    </FormField>

                    <FormField>
                        <label>Icon</label>
                        <select
                            value={formData.customIconName}
                            onChange={e => handleChange("customIconName", e.target.value)}
                        >
                            {Object.keys(iconMap).map(key => (
                                <option key={key} value={key}>{key}</option>
                            ))}
                        </select>
                    </FormField>

                    <FormField>
                        <label>Hintergrundfarbe</label>
                        <input 
                            type="color" 
                            value={formData.customBgColor} 
                            onChange={e => handleChange( "customBgColor",e.target.value)} 
                        />
                    </FormField>

                    <FormField>
                        <label>Textfarbe</label>
                        <input 
                            type="color" value={formData.customTextColor} 
                            onChange={e => handleChange("customTextColor" ,e.target.value)} 
                        />
                    </FormField>

                    <FormField>
                        <label>Borderfarbe</label>
                        <input 
                            type="color" 
                            value={formData.customBorderColor} 
                            onChange={e => handleChange("customBorderColor", e.target.value)} 
                        />
                    </FormField>

                    <div className={styles.preview}>
                        <EventBadge event={previewEvent} />
                        {formData.customIconName && <EventIcon event={previewEvent} />}
                    </div>
                </>
            )}

            {isWatering && (
                <>
                    <FormField>
                        <label>pH Wert</label>
                        <input 
                            type="number"
                            step="0.1"
                            value={formData.waterPh ?? ""}
                            onChange={e => handleChange("waterPh", parseFloat(e.target.value))}
                        />
                    </FormField>

                    <FormField>
                        <label>EC Wert</label>
                        <input 
                            type="number"
                            step="0.01"
                            value={formData.waterEc ?? ""}
                            onChange={e => handleChange("waterEc", parseFloat(e.target.value))}
                        />
                    </FormField>

                    <FormField>
                        <label>Menge (ml)</label>
                        <input 
                            type="number"
                            value={formData.waterAmount ?? ""}
                            onChange={e => handleChange("waterAmount", parseInt(e.target.value))}
                        />
                    </FormField>
                </>
            )}


            <FormField>
                <label htmlFor="event-notes">Notizen</label>
                <textarea
                    id="event-notes"
                    value={formData.notes}
                    onChange={e => handleChange("notes", e.target.value)}
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