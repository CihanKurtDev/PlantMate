"use client";

import { useMemo, useState } from "react";
import { Button } from "@/components/Button/Button";
import { usePlantMonitor } from "@/context/PlantMonitorContext";
import Form, { FormField, FormSectionTitle } from "@/components/Form/Form";
import { EnvironmentEventType, EnvironmentEvent } from "@/types/environment";
import { Leaf, Thermometer, ActivityIcon, Droplet, Wind, LucideIcon } from "lucide-react";
import styles from "./EnvironmentEventForm.module.scss"
import { BaseEvent, EventBadge } from "./shared/EventsList";

interface EnvironmentEventFormProps {
    environmentId: string;
    onCancel: () => void;
    onSave: () => void;
}

const iconMap =  {Leaf, Thermometer, ActivityIcon, Droplet, Wind } as const
type IconMapKey = keyof typeof iconMap;

interface FormData {
    type: EnvironmentEventType;
    customName: string;
    customIcon: LucideIcon;
    customBgColor: string;
    customTextColor: string;
    customBorderColor: string;
    notes: string;
}

export default function EnvironmentEventForm({ environmentId, onCancel, onSave }: EnvironmentEventFormProps) {
    const { addEventToEnvironment } = usePlantMonitor();
    const [formData, setFormData] = useState<FormData>({
        type: "Climate_Adjustment",
        customName: "",
        customIcon: Leaf,
        customBgColor: "#e0e0e0",
        customTextColor: "#424242",
        customBorderColor: "#bdbdbd",
        notes: "",
    });

    const isCustom = formData.type === "custom";

    const handleChange = (field: keyof FormData, value: any) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (isCustom && !formData.customName.trim()) {
            alert("Bitte gib einen Namen für dein eigenes Event ein.");
            return;
        }

        const newEvent: EnvironmentEvent = {
            id: Date.now().toString(),
            environmentId,
            timestamp: Date.now(),
            type: isCustom ? formData.customName : formData.type,
            notes: formData.notes || undefined,
            customIcon: isCustom ? formData.customIcon : undefined,
            customBgColor: isCustom ? formData.customBgColor : undefined,
            customTextColor: isCustom ? formData.customTextColor : undefined,
            customBorderColor: isCustom ? formData.customBorderColor : undefined,
        };

        addEventToEnvironment(environmentId, newEvent);

        onSave();
    };

    const previewEvent: BaseEvent = {
        id: "preview",
        type: formData.customName || "Vorschau",
        timestamp: Date.now(),
        customIcon: formData.customIcon,
        customBgColor: formData.customBgColor,
        customTextColor: formData.customTextColor,
        customBorderColor: formData.customBorderColor,
        notes: "",
    };

    return (
        <Form onSubmit={handleSubmit}>
            <FormSectionTitle>Neues Ereignis hinzufügen</FormSectionTitle>

            <FormField>
                <label htmlFor="event-type">Event Typ</label>
                <select
                    id="event-type"
                    value={formData.type}
                    onChange={e => handleChange("type", e.target.value)}
                >
                    <option value="Climate_Adjustment">Klimaanpassung</option>
                    <option value="Equipment_Change">Gerätewechsel</option>
                    <option value="Cleaning">Reinigung</option>
                    <option value="Maintenance">Wartung</option>
                    <option value="custom">Eigenes Event</option>
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
                            value={formData.customIcon.name}
                            onChange={e => handleChange("customIcon", iconMap[e.target.value  as IconMapKey])}
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
                        {formData.customIcon && <formData.customIcon size={20} />}
                    </div>
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
