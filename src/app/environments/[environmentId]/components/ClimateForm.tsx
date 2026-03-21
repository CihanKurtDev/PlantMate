"use client";

import { usePlantMonitor } from "@/context/PlantMonitorContext";
import { EnvironmentData_Historical } from "@/types/environment";
import Form, { FormField, FormSectionTitle } from "@/components/Form/Form";
import { Button } from "@/components/Button/Button";
import { ClimateInputs } from "./shared/ClimateInputs";
import { convertClimateInputToData } from "@/helpers/climateConverter";
import { useModal } from "@/context/ModalContext";
import { useClimateValidation } from "@/hooks/useClimateValidation";
import { useClimateForm } from "@/hooks/useClimateForm";
import { getProfile, ProfileKey, CultivationProfile, MetricProfile } from "@/config/profiles";
import { getIntersectedClimateMetrics } from "./shared/DataTab/dataTabUtils";
import styles from "./ClimateForm.module.scss";

const CLIMATE_KEYS = ["temp", "humidity", "vpd", "co2"] as const;
type ClimateKey = typeof CLIMATE_KEYS[number];

const CLIMATE_KEY_LABELS: Record<ClimateKey, string> = {
    temp: "Temperatur",
    humidity: "Luftfeuchtigkeit",
    vpd: "VPD",
    co2: "CO₂",
};

interface PreparedMetric {
    key: ClimateKey;
    label: string;
    intersected: MetricProfile;
    base: MetricProfile;
    perProfile: Array<{ profile: CultivationProfile; metric: MetricProfile }>;
    rangesConflict: boolean;
}

function prepareMetrics(
    profiles: CultivationProfile[],
    intersectedMetrics: MetricProfile[],
    genericClimate: MetricProfile[]
): PreparedMetric[] {
    return CLIMATE_KEYS.flatMap(key => {
        const intersected = intersectedMetrics.find(m => m.key === key);
        const base = genericClimate.find(m => m.key === key);

        if (!intersected || !base) return [];

        const perProfile = profiles.flatMap(profile => {
            const metric = profile.climate.find(m => m.key === key);
            return metric ? [{ profile, metric }] : [];
        });

        const rangesConflict =
            intersected.idealMin !== base.idealMin &&
            intersected.idealMax === base.idealMax;

        return [{ key, label: CLIMATE_KEY_LABELS[key], intersected, base, perProfile, rangesConflict }];
    });
}

interface ClimateProfileInfoProps {
    profiles: CultivationProfile[];
}

function ClimateProfileInfo({ profiles }: ClimateProfileInfoProps) {
    if (profiles.length === 0) return null;

    if (profiles.length === 1) {
        const profile = profiles[0];
        return (
            <div className={styles.profileBlock}>
                <div className={styles.profileChips}>
                    <span className={styles.profileChip}>
                        <span
                            className={styles.profileChipDot}
                            style={{ background: profile.color }}
                        />
                        {profile.label}
                    </span>
                </div>
                <div className={styles.singleMetrics}>
                    {profile.climate
                        .filter((m): m is MetricProfile & { key: ClimateKey } =>
                            (CLIMATE_KEYS as readonly string[]).includes(m.key)
                        )
                        .map(metric => (
                            <span key={metric.key} className={styles.singlePill}>
                                <strong>{CLIMATE_KEY_LABELS[metric.key as ClimateKey]}</strong>{" "}
                                {metric.idealMin}–{metric.idealMax} {metric.unit}
                            </span>
                        ))}
                </div>
            </div>
        );
    }

    const intersectedMetrics = getIntersectedClimateMetrics(
        profiles.map(profile => ({
            id: undefined,
            title: "",
            species: "",
            environmentId: "",
            profile: profile.key,
        }))
    );
    const genericClimate = getProfile("generic").climate;
    const preparedMetrics = prepareMetrics(profiles, intersectedMetrics, genericClimate);

    return (
        <div className={styles.profileBlock}>
            <div className={styles.profileChips}>
                {profiles.map(profile => (
                    <span key={profile.key} className={styles.profileChip}>
                        <span
                            className={styles.profileChipDot}
                            style={{ background: profile.color }}
                        />
                        {profile.label}
                    </span>
                ))}
            </div>
            <div className={styles.profileDivider} />
            <div className={styles.metricRows}>
                {preparedMetrics.map(({ key, label, intersected, perProfile, rangesConflict }) => (
                    <div key={key} className={styles.metricRow}>
                        <span className={styles.metricKey}>{label}</span>
                        <div className={styles.metricValues}>
                            {perProfile.map(({ profile, metric }) => (
                                <span
                                    key={profile.key}
                                    className={styles.metricPill}
                                    style={{
                                        borderColor: profile.color + "44",
                                        background: profile.color + "12",
                                        color: profile.color,
                                    }}
                                >
                                    {profile.label} {metric.idealMin}–{metric.idealMax} {metric.unit}
                                </span>
                            ))}
                        </div>
                        <span className={`${styles.metricResult} ${rangesConflict ? styles.metricResultWarn : styles.metricResultOk}`}>
                            {rangesConflict
                                ? "kein Overlap"
                                : `→ ${intersected.idealMin}–${intersected.idealMax} ${intersected.unit}`
                            }
                        </span>
                    </div>
                ))}
            </div>
        </div>
    );
}

interface ClimateFormProps {
    environmentId: string;
    entryId?: string;
}

export default function ClimateForm({ environmentId, entryId }: ClimateFormProps) {
    const { environments, addHistoryData, updateHistoryData, getPlantsByEnvironment } = usePlantMonitor();
    const { closeModal } = useModal();

    const environment = environments.find(e => e.id === environmentId);
    const plants = getPlantsByEnvironment(environmentId);

    const uniqueProfileKeys = [...new Set(plants.map(p => p.profile).filter(Boolean))] as ProfileKey[];
    const profiles = uniqueProfileKeys.length > 0
        ? uniqueProfileKeys.map(key => getProfile(key))
        : [getProfile("generic")];

    const existingEntry = entryId
        ? environment?.historical?.find(h => h.id === entryId)
        : undefined;

    const { climateInput, setClimateInput } = useClimateForm(existingEntry);
    const { errors: validationErrors, warnings: validationWarnings } = useClimateValidation(climateInput, profiles);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (Object.keys(validationErrors).length > 0) {
            console.warn("Form has validation errors:", validationErrors);
            return;
        }

        const climateData = convertClimateInputToData(climateInput);
        if (!climateData) {
            console.warn("Keine Klimadaten eingegeben.");
            return;
        }

        const timestamp = Date.now();
        const entry: EnvironmentData_Historical = {
            id: existingEntry?.id ?? timestamp.toString(),
            environmentId,
            timestamp: existingEntry?.timestamp ?? timestamp,
            climate: climateData,
        };

        if (existingEntry) {
            updateHistoryData(environmentId, entry);
        } else {
            addHistoryData(environmentId, entry);
        }

        closeModal();
    };

    return (
        <Form onSubmit={handleSubmit}>
            <FormSectionTitle>
                {existingEntry ? "Klimamessung bearbeiten" : "Klimamessung eintragen"}
            </FormSectionTitle>
            <ClimateProfileInfo profiles={profiles} />
            <ClimateInputs
                climate={climateInput}
                onChange={setClimateInput}
                errors={validationErrors}
                warnings={validationWarnings}
            />
            <FormField>
                <Button type="submit">Speichern</Button>
                <Button variant="secondary" type="button" onClick={closeModal}>Abbrechen</Button>
            </FormField>
        </Form>
    );
}