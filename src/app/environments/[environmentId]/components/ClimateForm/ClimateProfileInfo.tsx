import { getProfile } from "@/config/profiles";
import type { CultivationProfile, MetricProfile, ProfileKey } from "@/config/profiles";
import type { PlantStage } from "@/types/plant";
import {
    CLIMATE_KEYS,
    CLIMATE_KEY_LABELS,
    ClimateKey,
    PreparedMetric,
    prepareMetrics,
} from "./climateMetrics";
import styles from "./ClimateForm.module.scss";
import { getIntersectedClimateMetrics } from "../shared/DataTab/dataTabUtils";

interface ClimateProfileInfoProps {
    profiles: CultivationProfile[];
    stageByProfile?: Partial<Record<ProfileKey, PlantStage>>;
}

function getClimateMetricsForProfile(
    profile: CultivationProfile,
    stage?: PlantStage
): MetricProfile[] {
    const resolvedStage = stage ?? profile.defaultStage ?? "VEGETATIVE";

    return (
        profile.stages[resolvedStage]?.climate ||
        profile.stages[profile.defaultStage ?? "VEGETATIVE"]?.climate ||
        profile.stages.VEGETATIVE?.climate ||
        []
    );
}

function getStageLabel(stage: PlantStage): string {
    switch (stage) {
        case "SEEDLING":
            return "Keimling";
        case "VEGETATIVE":
            return "Wachstum";
        case "FLOWERING":
            return "Blüte";
        default:
            return stage;
    }
}

export function ClimateProfileInfo({ profiles, stageByProfile }: ClimateProfileInfoProps) {
    if (profiles.length === 0) {
        return null;
    }

    if (profiles.length === 1) {
        const profile = profiles[0];
        const stage = stageByProfile?.[profile.key] ?? profile.defaultStage;
        const climateMetrics = getClimateMetricsForProfile(profile, stage);

        return (
            <div className={styles.profileBlock}>
                <div className={styles.profileChips}>
                    <span className={styles.profileChip}>
                        <span
                            className={styles.profileChipDot}
                            style={{ background: profile.color }}
                        />
                        {profile.label} · {getStageLabel(stage)}
                    </span>
                </div>
                <div className={styles.singleMetrics}>
                    {climateMetrics
                        .filter((metric): metric is MetricProfile & { key: ClimateKey } =>
                            (CLIMATE_KEYS as readonly string[]).includes(metric.key)
                        )
                        .map((metric) => (
                            <span key={metric.key} className={styles.singlePill}>
                                <strong>{CLIMATE_KEY_LABELS[metric.key]}</strong>{" "}
                                {metric.idealMin}–{metric.idealMax} {metric.unit}
                            </span>
                        ))}
                </div>
            </div>
        );
    }

    const intersectedMetrics = getIntersectedClimateMetrics(
        profiles.map((profile) => {
            const stage = stageByProfile?.[profile.key];

            return {
                id: undefined,
                title: "",
                species: "",
                environmentId: "",
                profile: profile.key,
                stageHistory: stage
                    ? [
                          {
                              id: `${profile.key}-stage`,
                              plantId: `${profile.key}-plant`,
                              stage,
                              startTimestamp: 0,
                              source: "manual" as const,
                          },
                      ]
                    : undefined,
            };
        })
    );

    const genericClimate = getClimateMetricsForProfile(getProfile("generic"), "VEGETATIVE");

    const preparedMetrics = prepareMetrics(
        profiles.map((profile) => ({
            profile,
            metrics: getClimateMetricsForProfile(profile, stageByProfile?.[profile.key]),
        })),
        intersectedMetrics,
        genericClimate
    );

    return (
        <div className={styles.profileBlock}>
            <div className={styles.profileChips}>
                {profiles.map((profile) => {
                    const stage = stageByProfile?.[profile.key] ?? profile.defaultStage ?? "VEGETATIVE";

                    return (
                        <span key={profile.key} className={styles.profileChip}>
                            <span
                                className={styles.profileChipDot}
                                style={{ background: profile.color }}
                            />
                            {profile.label} · {getStageLabel(stage)}
                        </span>
                    );
                })}
            </div>
            <div className={styles.profileDivider} />
            <div className={styles.metricRows}>
                {preparedMetrics.map(({ key, label, intersected, perProfile, rangesConflict }: PreparedMetric) => (
                    <div key={key} className={styles.metricRow}>
                        <span className={styles.metricKey}>{label}</span>
                        <div className={styles.metricValues}>
                            {perProfile.map(({ profile, metric }: PreparedMetric["perProfile"][number]) => (
                                <span
                                    key={profile.key}
                                    className={styles.metricPill}
                                    style={{
                                        borderColor: `${profile.color}44`,
                                        background: `${profile.color}12`,
                                        color: profile.color,
                                    }}
                                >
                                    {profile.label} {metric.idealMin}–{metric.idealMax} {metric.unit}
                                </span>
                            ))}
                        </div>
                        <span
                            className={[
                                styles.metricResult,
                                rangesConflict ? styles.metricResultWarn : styles.metricResultOk,
                            ].join(" ")}
                        >
                            {rangesConflict
                                ? "kein gemeinsamer Bereich"
                                : `→ ${intersected.idealMin}–${intersected.idealMax} ${intersected.unit}`}
                        </span>
                    </div>
                ))}
            </div>
        </div>
    );
}
