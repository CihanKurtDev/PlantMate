"use client";

import { useMemo, useState } from "react";
import { Sun, Moon } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { Button } from "@/components/Button/Button";
import Form, { FormField, FormHint } from "@/components/Form/Form";
import { Input } from "@/components/Form/Input";
import { Select } from "@/components/Form/Select";
import { useEnvironment } from "@/context/EnvironmentContext";
import { useToast } from "@/context/ToastContext";
import { normalizeLightSchedule } from "@/helpers/plantStages";
import { minutesToTimeString, timeStringToMinutes } from "@/helpers/lightCycle";
import { hasValidationErrors } from "@/helpers/validationUtils";
import { useEnvironmentForm } from "@/hooks/useEnvironmentForm";
import { useEnvironmentValidation } from "@/hooks/useEnvironmentValidation";
import type { EnvironmentType } from "@/types/environment";
import styles from "./EnvironmentForm.module.scss";

interface EnvironmentFormProps {
    onSaved?: (envId: string, nextStep: "plant" | "dashboard") => void;
    environmentId?: string;
    existingId?: string;
}

const LIGHT_PRESETS = [24, 20, 18, 16, 12] as const;

export const EnvironmentForm = ({
    onSaved,
    environmentId,
    existingId,
}: EnvironmentFormProps) => {
    const { environments, addEnvironment, updateEnvironment } = useEnvironment();
    const { validate } = useEnvironmentValidation();
    const { addToast } = useToast();
    const searchParams = useSearchParams();
    const editId = environmentId ?? searchParams.get("editId");

    const existingEnvironment = editId
        ? environments.find((environment) => environment.id === editId)
        : existingId
          ? environments.find((environment) => environment.id === existingId)
          : undefined;

    const { formState, setField } = useEnvironmentForm(existingEnvironment);
    const { errors: validationErrors } = validate(formState);

    const [hoursLight, setHoursLight] = useState<number>(
        existingEnvironment?.currentLightSchedule?.hoursLight ?? 18
    );
    const [dayStartMinutes, setDayStartMinutes] = useState<number>(
        existingEnvironment?.currentLightSchedule?.dayStartMinutes ?? 6 * 60
    );

    const currentLightSchedule = useMemo(
        () => normalizeLightSchedule(hoursLight, dayStartMinutes),
        [hoursLight, dayStartMinutes]
    );

    const lightPct = `${((hoursLight / 24) * 100).toFixed(1)}%`;
    const isPreset = LIGHT_PRESETS.includes(hoursLight as typeof LIGHT_PRESETS[number]);

    const handleSubmit = (e: React.FormEvent, nextStep: "plant" | "dashboard") => {
        e.preventDefault();

        if (hasValidationErrors(validationErrors)) {
            return;
        }

        const finalId = existingEnvironment?.id || crypto.randomUUID();
        const existingSchedule = existingEnvironment?.currentLightSchedule;
        const scheduleChanged =
            existingSchedule?.hoursLight !== currentLightSchedule.hoursLight ||
            existingSchedule?.hoursDark !== currentLightSchedule.hoursDark ||
            existingSchedule?.dayStartMinutes !== currentLightSchedule.dayStartMinutes;

        const lightScheduleEvents = scheduleChanged
            ? [
                  ...(existingEnvironment?.events ?? []),
                  {
                      id: crypto.randomUUID(),
                      environmentId: finalId,
                      timestamp: Date.now(),
                      type: "LIGHT_SCHEDULE_CHANGE",
                      lightScheduleChange: currentLightSchedule,
                  },
              ]
            : existingEnvironment?.events;

        const payload = {
            ...formState,
            id: finalId,
            currentLightSchedule,
            events: lightScheduleEvents,
        };

        if (!existingEnvironment) {
            addEnvironment(payload);
            addToast("Umgebung erfolgreich erstellt");
        } else {
            updateEnvironment({
                ...existingEnvironment,
                ...payload,
            });
            addToast("Änderungen gespeichert");
        }

        onSaved?.(finalId, nextStep);
    };

    return (
        <Form onSubmit={(e) => handleSubmit(e, "dashboard")}>
            <Input
                data-demo="environment-name"
                label="Name"
                value={formState.name}
                onChange={(e) => setField("name", e.target.value)}
                error={validationErrors.name}
                placeholder="z.B. Gewächshaus Nord, Anzuchtzelt"
            />

            <FormField>
                <Select
                    data-demo="environment-type"
                    label="Typ"
                    value={formState.type}
                    onChange={(e) => setField("type", e.target.value as EnvironmentType)}
                >
                    <option value="ROOM">🏠 Raum — offener Raum, natürliche Belüftung</option>
                    <option value="TENT">⛺ Growzelt — geschlossenes Growzelt, kontrolliertes Klima</option>
                    <option value="GREENHOUSE">🌱 Gewächshaus — Gewächshaus mit Tageslicht</option>
                </Select>
            </FormField>

            <Input
                data-demo="environment-location"
                label="Standort"
                value={formState.location ?? ""}
                onChange={(e) => setField("location", e.target.value)}
                error={validationErrors.location}
                placeholder="z.B. Keller, Dachboden, Garage"
            />
            <FormHint>Hilft dir später dabei, mehrere Umgebungen auseinanderzuhalten.</FormHint>

            <div className={styles.lightSection}>
                <span className={styles.lightSectionTitle}>Lichtzyklus</span>

                <div className={styles.lightPresets}>
                    {LIGHT_PRESETS.map((preset) => (
                        <button
                            key={preset}
                            type="button"
                            className={`${styles.presetChip} ${hoursLight === preset ? styles.presetChipActive : ""}`}
                            onClick={() => setHoursLight(preset)}
                        >
                            {preset}/{24 - preset}
                        </button>
                    ))}
                </div>

                <div className={styles.sliderWrapper}>
                    <input
                        type="range"
                        min={0}
                        max={24}
                        step={1}
                        value={hoursLight}
                        onChange={(e) => setHoursLight(Number(e.target.value))}
                        className={styles.sliderTrack}
                        style={{ "--light-pct": lightPct } as React.CSSProperties}
                    />
                    <div className={styles.sliderLabels}>
                        <span className={styles.sliderLabelDay}>
                            <Sun size={14} /> {hoursLight} h Licht
                        </span>
                        <span className={styles.sliderLabelNight}>
                            <Moon size={14} /> {24 - hoursLight} h Dunkel
                        </span>
                    </div>
                </div>

                <div className={styles.timeRow}>
                    <Sun size={14} />
                    <span>Licht an ab</span>
                    <input
                        type="time"
                        className={styles.timeInput}
                        value={minutesToTimeString(dayStartMinutes)}
                        onChange={(e) => setDayStartMinutes(timeStringToMinutes(e.target.value))}
                    />
                </div>
            </div>
            <FormHint>
                {isPreset
                    ? "Die Summe bleibt automatisch bei 24 Stunden. Photoperiodische Profile leiten die Blütephase aus dem Lichtzyklus ab."
                    : `Aktuell: ${hoursLight} h Licht / ${24 - hoursLight} h Dunkel. Du kannst den Slider für Feineinstellungen nutzen.`}
            </FormHint>

            <div className={styles.buttonRow}>
                {editId ? (
                    <Button type="button" variant="primary" onClick={(e) => handleSubmit(e, "dashboard")}>
                        Änderungen speichern
                    </Button>
                ) : (
                    <>
                        <Button type="button" variant="primary" onClick={(e) => handleSubmit(e, "plant")}>
                            Weiter zu Pflanzen
                        </Button>
                        <Button type="button" variant="secondary" onClick={(e) => handleSubmit(e, "dashboard")}>
                            Zum Dashboard
                        </Button>
                    </>
                )}
            </div>
        </Form>
    );
};
