"use client";

import { useState } from "react";
import Form, { FormField, FormSectionTitle } from "@/components/Form/Form";
import { Button } from "@/components/Button/Button";
import styles from "./EventForm.module.scss";
import DatePicker from "./DatePicker";
import TypeIcon from "@/components/TypeIcon/TypeIcon";
import {
    EventFormData,
    EventTypeConfig,
    ExtraFieldConfig,
    CUSTOM_EXTRA_KEYS,
} from "@/types/events";
import { iconMap } from "@/types/environment";


interface EventFormProps {
    title?: string;
    eventFormConfig: EventTypeConfig[];
    defaultEventType: string;
    onSubmit: (eventData: EventFormData) => void;
    onCancel: () => void;
}


function buildInitialExtra(config: EventTypeConfig): Record<string, string | number | undefined> {
    return Object.fromEntries(
        (config.extraFields ?? [])
            .filter((f) => f.defaultValue !== undefined)
            .map((f) => [f.key, f.defaultValue])
    );
}

function buildInitialFormData(
    defaultEventType: string,
    configs: EventTypeConfig[]
): EventFormData {
    const activeConfig = configs.find((c) => c.value === defaultEventType);
    return {
        type: defaultEventType,
        timestamp: Date.now(),
        notes: "",
        extra: activeConfig ? buildInitialExtra(activeConfig) : {},
    };
}

interface FieldProps {
    field: ExtraFieldConfig;
    value: string | number | undefined;
    onChange: (key: string, value: string | number) => void;
}

function ExtraField({ field, value, onChange }: FieldProps) {
    const strValue = (value as string) ?? "";

    switch (field.type) {
        case "select":
            return (
                <select
                    id={`extra-${field.key}`}
                    value={strValue}
                    onChange={(e) => onChange(field.key, e.target.value)}
                >
                    <option value="" disabled>Bitte wählen</option>
                    {field.options?.map((opt) => (
                        <option key={opt.value} value={opt.value}>{opt.label}</option>
                    ))}
                </select>
            );

        case "color":
            return (
                <input
                    id={`extra-${field.key}`}
                    type="color"
                    value={strValue || "#000000"}
                    onChange={(e) => onChange(field.key, e.target.value)}
                />
            );

        case "icon-select":
            return (
                <select
                    id={`extra-${field.key}`}
                    value={strValue}
                    onChange={(e) => onChange(field.key, e.target.value)}
                >
                    {Object.keys(iconMap).map((key) => (
                        <option key={key} value={key}>{key}</option>
                    ))}
                </select>
            );

        case "number":
            return (
                <input
                    id={`extra-${field.key}`}
                    type="number"
                    value={value ?? ""}
                    placeholder={field.placeholder}
                    onChange={(e) => onChange(field.key, parseFloat(e.target.value))}
                />
            );

        default:
            return (
                <input
                    id={`extra-${field.key}`}
                    type="text"
                    value={strValue}
                    placeholder={field.placeholder}
                    onChange={(e) => onChange(field.key, e.target.value)}
                />
            );
    }
}

export default function EventForm({
    onCancel,
    onSubmit,
    title = "Neues Ereignis hinzufügen",
    defaultEventType,
    eventFormConfig,
}: EventFormProps) {
    const [formData, setFormData] = useState<EventFormData>(() =>
        buildInitialFormData(defaultEventType, eventFormConfig)
    );

    const activeConfig = eventFormConfig.find((c) => c.value === formData.type);
    const isCustom = formData.type === "custom";

    const handleTypeChange = (newType: string) => {
        const newConfig = eventFormConfig.find((c) => c.value === newType);
        setFormData((prev) => ({
            ...prev,
            type: newType,
            extra: newConfig ? buildInitialExtra(newConfig) : {},
        }));
    };

    const handleExtraChange = (key: string, value: string | number) => {
        setFormData((prev) => ({
            ...prev,
            extra: { ...prev.extra, [key]: value },
        }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        const missingField = activeConfig?.extraFields?.find(
            (f) => f.required && !formData.extra[f.key]
        );

        if (missingField) {
            alert(`Bitte fülle das Feld "${missingField.label}" aus.`);
            return;
        }

        onSubmit(formData);
    };

    const previewIcon = isCustom
        ? iconMap[formData.extra[CUSTOM_EXTRA_KEYS.iconName] as keyof typeof iconMap]
        : null;

    return (
        <Form onSubmit={handleSubmit}>
            <FormSectionTitle>{title}</FormSectionTitle>

            <FormField>
                <DatePicker
                    value={formData.timestamp}
                    onChange={(timestamp) =>
                        setFormData((prev) => ({ ...prev, timestamp }))
                    }
                    label="Datum"
                />
            </FormField>

            <FormField>
                <label htmlFor="event-type">Event Typ</label>
                <select
                    id="event-type"
                    value={formData.type}
                    onChange={(e) => handleTypeChange(e.target.value)}
                >
                    {eventFormConfig.map((config) => (
                        <option key={config.value} value={config.value}>
                            {config.label}
                        </option>
                    ))}
                </select>
            </FormField>

            {activeConfig?.extraFields?.map((field) => (
                <FormField key={field.key}>
                    <label htmlFor={`extra-${field.key}`}>
                        {field.label}{field.required && " *"}
                    </label>
                    <ExtraField
                        field={field}
                        value={formData.extra[field.key]}
                        onChange={handleExtraChange}
                    />
                </FormField>
            ))}

            {isCustom && previewIcon && (
                <div className={styles.preview}>
                    <TypeIcon
                        icon={previewIcon}
                        customBgColor={formData.extra[CUSTOM_EXTRA_KEYS.bgColor] as string}
                        customTextColor={formData.extra[CUSTOM_EXTRA_KEYS.textColor] as string}
                        customBorderColor={formData.extra[CUSTOM_EXTRA_KEYS.borderColor] as string}
                    />
                </div>
            )}

            <FormField>
                <label htmlFor="event-notes">Notizen</label>
                <textarea
                    id="event-notes"
                    value={formData.notes ?? ""}
                    onChange={(e) =>
                        setFormData((prev) => ({ ...prev, notes: e.target.value }))
                    }
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