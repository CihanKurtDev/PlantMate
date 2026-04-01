"use client";

import Form, { FormField, FormSectionTitle } from "@/components/Form/Form";
import { Button } from "@/components/Button/Button";
import styles from "./EventForm.module.scss";
import DatePicker from "./DatePicker";
import TypeIcon from "@/components/TypeIcon/TypeIcon";
import { Input } from "@/components/Form/Input";
import { Select } from "@/components/Form/Select";
import {
    EventFormData,
    EventTypeConfig,
    ExtraFieldConfig,
    CUSTOM_EXTRA_KEYS,
} from "@/types/events";
import { iconMap } from "@/types/environment";
import { useEventForm } from "@/hooks/useEventForm";
import { useEventValidation } from "@/hooks/useEventValidation";

interface EventFormProps {
    title?: string;
    eventFormConfig: EventTypeConfig[];
    defaultEventType: string;
    onSubmit: (eventData: EventFormData) => void;
    onCancel: () => void;
}

interface FieldProps {
    field: ExtraFieldConfig;
    error?: string;
    value: string | number | undefined;
    onChange: (key: string, value: string | number | undefined) => void;
}

function ExtraField({ field, value, onChange, error }: FieldProps) {
    const strValue = (value as string) ?? "";
    const colorValue = /^#[0-9a-fA-F]{6}$/.test(strValue) ? strValue : "#e0e0e0";

    switch (field.type) {
        case "select":
            return (
                <Select
                    label={`${field.label}${field.required ? " *" : ""}`}
                    id={`extra-${field.key}`}
                    value={strValue}
                    error={error}
                    onChange={(e) => onChange(field.key, e.target.value)}
                >
                    <option value="" disabled>Bitte wählen</option>
                    {field.options?.map((opt) => (
                        <option key={opt.value} value={opt.value}>{opt.label}</option>
                    ))}
                </Select>
            );

        case "color":
            return (
                <div className={styles.colorField}>
                    <label htmlFor={`extra-${field.key}`} className={styles.label}>
                        {field.label}{field.required ? " *" : ""}
                    </label>
                    <div className={styles.colorRow}>
                        <input
                            id={`extra-${field.key}`}
                            type="color"
                            value={colorValue}
                            className={styles.colorPicker}
                            onChange={(e) => onChange(field.key, e.target.value)}
                        />
                        <input
                            type="text"
                            value={strValue}
                            placeholder="#e0e0e0"
                            className={`${styles.colorHexInput} ${error ? styles.textareaError : ""}`}
                            onChange={(e) => onChange(field.key, e.target.value)}
                        />
                    </div>
                    {error && <span className={styles.fieldError}>{error}</span>}
                </div>
            );

        case "icon-select":
            return (
                <Select
                    label={`${field.label}${field.required ? " *" : ""}`}
                    id={`extra-${field.key}`}
                    value={strValue}
                    error={error}
                    onChange={(e) => onChange(field.key, e.target.value)}
                >
                    {Object.keys(iconMap).map((key) => (
                        <option key={key} value={key}>{key}</option>
                    ))}
                </Select>
            );

        case "number":
            return (
                <Input
                    label={`${field.label}${field.required ? " *" : ""}`}
                    id={`extra-${field.key}`}
                    type="number"
                    value={value === undefined ? "" : String(value)}
                    placeholder={field.placeholder}
                    error={error}
                    onChange={(e) => onChange(field.key, e.target.value)}
                />
            );

        default:
            return (
                <Input
                    label={`${field.label}${field.required ? " *" : ""}`}
                    id={`extra-${field.key}`}
                    type="text"
                    value={strValue}
                    placeholder={field.placeholder}
                    error={error}
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
    const {
        formData,
        activeConfig,
        setType,
        setTimestamp,
        setNotes,
        setExtra,
    } = useEventForm(defaultEventType, eventFormConfig);
    const { errors, hasErrors } = useEventValidation(formData, eventFormConfig);
    const isCustom = formData.type === "custom";
    const extraFields = activeConfig?.extraFields ?? [];
    const colorFields = extraFields.filter((field) => field.type === "color");
    const nonColorFields = extraFields.filter((field) => field.type !== "color");

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (hasErrors) {
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
                    onChange={setTimestamp}
                    label="Datum"
                />
                {errors.timestamp && <span className={styles.fieldError}>{errors.timestamp}</span>}
            </FormField>

            <FormField>
                <Select
                    label="Event Typ"
                    id="event-type"
                    value={formData.type}
                    error={errors.type}
                    onChange={(e) => setType(e.target.value)}
                >
                    {eventFormConfig.map((config) => (
                        <option key={config.value} value={config.value}>
                            {config.label}
                        </option>
                    ))}
                </Select>
            </FormField>

            {nonColorFields.map((field) => (
                <FormField key={field.key}>
                    <ExtraField
                        field={field}
                        value={formData.extra[field.key]}
                        error={errors.extra[field.key]}
                        onChange={setExtra}
                    />
                </FormField>
            ))}

            {colorFields.length > 0 && (
                <div className={styles.colorGrid}>
                    {colorFields.map((field) => (
                        <div key={field.key} className={styles.colorGridItem}>
                            <ExtraField
                                field={field}
                                value={formData.extra[field.key]}
                                error={errors.extra[field.key]}
                                onChange={setExtra}
                            />
                        </div>
                    ))}
                </div>
            )}

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
                <label htmlFor="event-notes" className={styles.label}>Notizen</label>
                <textarea
                    id="event-notes"
                    className={`${styles.textarea} ${errors.notes ? styles.textareaError : ""}`}
                    value={formData.notes ?? ""}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="Optional: Weitere Details eintragen"
                />
                {errors.notes && <span className={styles.fieldError}>{errors.notes}</span>}
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