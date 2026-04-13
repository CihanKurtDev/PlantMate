"use client";

import { useEffect, useMemo, useState } from "react";
import { Button } from "@/components/Button/Button";
import Form, { FormField, FormHint } from "@/components/Form/Form";
import { Input } from "@/components/Form/Input";
import { Select } from "@/components/Form/Select";
import { ProfileKey, PROFILES, getProfile } from "@/config/profiles";
import { useEnvironment } from "@/context/EnvironmentContext";
import { useModal } from "@/context/ModalContext";
import { usePlant } from "@/context/PlantContext";
import { useToast } from "@/context/ToastContext";
import { PLANT_START_MODE_OPTIONS, getPlantStageDescription, getPlantStageLabel, resolvePlantPreviewStage } from "@/helpers/plantStages";
import { MAX_PLANT_COUNT } from "@/helpers/validationUtils";
import { hasValidationErrors } from "@/helpers/validationUtils";
import { usePlantForm } from "@/hooks/usePlantForm";
import { usePlantValidation } from "@/hooks/usePlantValidation";
import type { PlantStartMode } from "@/types/plant";

interface PlantFormProps {
    environmentId?: string;
    plantId?: string;
    onBack?: () => void;
}

function toDateInputValue(timestamp?: number): string {
    const date = new Date(timestamp ?? Date.now());
    const year = date.getFullYear();
    const month = `${date.getMonth() + 1}`.padStart(2, "0");
    const day = `${date.getDate()}`.padStart(2, "0");

    return `${year}-${month}-${day}`;
}

export const PlantForm = ({ environmentId, plantId, onBack }: PlantFormProps) => {
    const { addPlant, updatePlant, plants } = usePlant();
    const { environments } = useEnvironment();
    const { validate } = usePlantValidation();
    const { addToast } = useToast();
    const { closeModal } = useModal();
    const [plantCount, setPlantCount] = useState<number>(1);

    const existingPlant = plantId ? plants.find((plant) => plant.id === plantId) : undefined;
    const { formState, setField, resetForm } = usePlantForm(existingPlant);
    const [startMode, setStartMode] = useState<PlantStartMode>(existingPlant?.startMode ?? "ESTABLISHED");
    const [startDate, setStartDate] = useState<string>(toDateInputValue(existingPlant?.startedAt));

    useEffect(() => {
        if (!existingPlant && environmentId) {
            setField("environmentId", environmentId);
        }
    }, [environmentId, existingPlant, setField]);

    const validationErrors = validate(formState, plantId ? undefined : plantCount);
    const selectedEnvironment = environments.find((environment) => environment.id === formState.environmentId);
    const selectedProfile = getProfile(formState.profile);
    const fallbackStartedAt = existingPlant?.startedAt ?? 0;
    const startedAt = useMemo(() => {
        const parsed = new Date(startDate).getTime();
        return Number.isFinite(parsed) ? parsed : fallbackStartedAt;
    }, [startDate, fallbackStartedAt]);
    const previewStage = useMemo(() => {
        return resolvePlantPreviewStage(formState.profile, selectedEnvironment, startMode, startedAt);
    }, [formState.profile, selectedEnvironment, startMode, startedAt]);
    const stageDescription = useMemo(() => {
        return getPlantStageDescription(
            {
                id: existingPlant?.id,
                title: formState.title,
                species: formState.species,
                environmentId: formState.environmentId,
                profile: formState.profile,
                startMode,
                startedAt,
                stageHistory: existingPlant?.stageHistory,
                historical: existingPlant?.historical,
                events: existingPlant?.events,
            },
            selectedEnvironment
        );
    }, [existingPlant?.events, existingPlant?.historical, existingPlant?.id, existingPlant?.stageHistory, formState.environmentId, formState.profile, formState.species, formState.title, selectedEnvironment, startMode, startedAt]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (hasValidationErrors(validationErrors)) {
            return;
        }

        const payload = {
            ...formState,
            startMode,
            startedAt,
        };

        if (existingPlant) {
            updatePlant({
                ...existingPlant,
                ...payload,
            });
            addToast("Pflanze aktualisiert");
        } else {
            for (let index = 0; index < plantCount; index += 1) {
                addPlant({
                    ...payload,
                    id: crypto.randomUUID(),
                });
            }
            addToast(plantCount > 1 ? `${plantCount} Pflanzen angelegt` : "Pflanze angelegt");
            resetForm();
        }

        closeModal();
    };

    return (
        <Form onSubmit={handleSubmit}>
            <Input
                data-demo="plant-name"
                label="Name"
                value={formState.title}
                onChange={(e) => setField("title", e.target.value)}
                error={validationErrors.title}
                placeholder="z.B. Tomate Cherry, Basilikum #3"
                required
            />

            <Input
                data-demo="plant-species"
                label="Art / Sorte"
                value={formState.species}
                onChange={(e) => setField("species", e.target.value)}
                error={validationErrors.species}
                placeholder="z.B. Solanum lycopersicum"
            />
            <FormHint>Optional — hilft bei sortenspezifischen Richtwerten.</FormHint>

            <FormField>
                <Select
                    data-demo="plant-environment"
                    label="Umgebung"
                    value={formState.environmentId}
                    onChange={(e) => setField("environmentId", e.target.value)}
                    error={validationErrors.environmentId}
                >
                    <option value="">Bitte wählen...</option>
                    {environments.map((environment) => (
                        <option key={environment.id} value={environment.id}>{environment.name}</option>
                    ))}
                </Select>
            </FormField>
            <FormHint>Pflichtfeld für Schritt 2 (optional im Gesamtflow): Für das Anlegen werden mindestens Name und Umgebung benötigt.</FormHint>

            <FormField>
                <Select
                    data-demo="plant-profile"
                    label="Profil"
                    value={formState.profile ?? "generic"}
                    onChange={(e) => setField("profile", e.target.value as ProfileKey)}
                >
                    {Object.values(PROFILES).map((profile) => (
                        <option key={profile.key} value={profile.key}>{profile.label}</option>
                    ))}
                </Select>
            </FormField>
            <FormHint>Das Profil legt Zielwerte und die Phasenlogik fest.</FormHint>

            <FormField>
                <Select
                    label="Status beim Hinzufügen"
                    value={startMode}
                    onChange={(e) => setStartMode(e.target.value as PlantStartMode)}
                >
                    {PLANT_START_MODE_OPTIONS.map((option) => (
                        <option key={option.value} value={option.value}>{option.label}</option>
                    ))}
                </Select>
            </FormField>
            <FormHint>
                Neu gestartet nutzt zuerst die Seedling-Phase. Bereits etablierte Pflanzen starten direkt in der normalen Logik.
            </FormHint>

            <Input
                label="Startdatum"
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
            />

            <div
                style={{
                    border: "1px solid var(--color-border, rgba(255,255,255,0.12))",
                    borderRadius: 16,
                    padding: 16,
                    marginTop: 8,
                }}
            >
                <div style={{ display: "flex", justifyContent: "space-between", gap: 12, flexWrap: "wrap" }}>
                    <strong>Automatisch erkannte Phase</strong>
                    <span>{getPlantStageLabel(previewStage)}</span>
                </div>
                <div style={{ marginTop: 8, opacity: 0.8 }}>
                    {stageDescription}
                </div>
                {selectedProfile.stageStrategy.mode === "PHOTOPERIOD" && selectedEnvironment?.currentLightSchedule && (
                    <div style={{ marginTop: 8, opacity: 0.8 }}>
                        Aktueller Lichtzyklus im Environment: {selectedEnvironment.currentLightSchedule.hoursLight}/
                        {selectedEnvironment.currentLightSchedule.hoursDark}
                    </div>
                )}
            </div>

            {!plantId && (
                <Input
                    data-demo="plant-count"
                    label="Anzahl Pflanzen"
                    type="number"
                    value={plantCount}
                    onChange={(e) => setPlantCount(Math.max(1, Math.min(MAX_PLANT_COUNT, parseInt(e.target.value, 10) || 1)))}
                    error={validationErrors.count}
                    min={1}
                    max={MAX_PLANT_COUNT}
                />
            )}

            <div>
                {onBack && (
                    <Button type="button" variant="secondary" onClick={onBack}>
                        Zurück
                    </Button>
                )}
                <Button type="button" onClick={handleSubmit}>
                    {plantId ? "Änderungen speichern" : "Speichern"}
                </Button>
            </div>
        </Form>
    );
};
