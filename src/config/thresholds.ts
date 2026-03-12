/**
 * THRESHOLDS – Warn-Schwellen (gelb/orange)
 * Werte außerhalb dieser Grenzen lösen Warnungen aus,
 * sind aber technisch noch gültig.
 */
export const THRESHOLDS = {
    climate: {
        temp: { warn: 30 },
        humidity: { min: 40, max: 70 },
        co2: { warn: 1500 },
        vpd: { min: 0.4, max: 1.6 },
    },
    water: {
        ph: { min: 5.5, max: 7.5 },
        ec: { min: 0.5, max: 3.5 },
    },
    plant: {
        daysSinceWatering: { warn: 7 },
    },
    measurement: {
        daysSinceLastMeasurement: { warn: 7 },
    },
} as const;

/**
 * LIMITS – Hard Limits für die Validierung (rot)
 * Werte außerhalb dieser Grenzen sind physikalisch unrealistisch
 * und werden als Fehler abgelehnt.
 */
export const LIMITS = {
    climate: {
        temp: { min: 0, max: 50 },
        humidity: { min: 0, max: 100 },
        co2: { min: 0, max: 5000 },
        vpd: { min: 0, max: 5 },
    },
    water: {
        ph: { min: 0, max: 14 },
        ec: { min: 0, max: 10 },
        amount: { min: 0, max: 100000 },
    },
} as const;