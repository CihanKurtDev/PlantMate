import { CultivationProfile, MetricProfile, getProfile } from "@/config/profiles";
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
}

export function ClimateProfileInfo({ profiles }: ClimateProfileInfoProps) {
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
                        .map((metric) => (
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
        profiles.map((profile) => ({
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
                {profiles.map((profile: CultivationProfile) => (
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
                {preparedMetrics.map(({ key, label, intersected, perProfile, rangesConflict }: PreparedMetric) => (
                    <div key={key} className={styles.metricRow}>
                        <span className={styles.metricKey}>{label}</span>
                        <div className={styles.metricValues}>
                            {perProfile.map(({ profile, metric }: PreparedMetric["perProfile"][number]) => (
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
                        <span
                            className={[
                                styles.metricResult,
                                rangesConflict ? styles.metricResultWarn : styles.metricResultOk,
                            ].join(" ")}
                        >
                            {rangesConflict
                                ? "kein Overlap"
                                : `→ ${intersected.idealMin}–${intersected.idealMax} ${intersected.unit}`}
                        </span>
                    </div>
                ))}
            </div>
        </div>
    );
}