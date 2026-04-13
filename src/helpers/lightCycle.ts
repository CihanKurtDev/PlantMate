import type { LightSchedule } from "@/types/environment";

const DEFAULT_DAY_START = 6 * 60;
const MINUTES_PER_DAY = 24 * 60;

export interface LightCycleSnapshot {
    isLightOn: boolean;
    currentPhaseLabel: string;
    scheduleLabel: string;
    progressPercent: number;
    minutesUntilTransition: number;
    dayStartTime: string;
    dayEndTime: string;
}

function minutesToTime(minutes: number): string {
    const wrapped = ((minutes % MINUTES_PER_DAY) + MINUTES_PER_DAY) % MINUTES_PER_DAY;
    const h = Math.floor(wrapped / 60);
    const m = wrapped % 60;
    return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`;
}

export function getLightCycleSnapshot(
    schedule: LightSchedule,
    now: Date = new Date()
): LightCycleSnapshot {
    const dayStart = schedule.dayStartMinutes ?? DEFAULT_DAY_START;
    const lightMinutes = schedule.hoursLight * 60;
    const darkMinutes = schedule.hoursDark * 60;
    const dayEnd = (dayStart + lightMinutes) % MINUTES_PER_DAY;

    const currentMinutes = now.getHours() * 60 + now.getMinutes();

    let minutesIntoDayPhase: number;
    if (dayStart <= dayEnd) {
        minutesIntoDayPhase =
            currentMinutes >= dayStart && currentMinutes < dayEnd
                ? currentMinutes - dayStart
                : -1;
    } else {
        minutesIntoDayPhase =
            currentMinutes >= dayStart
                ? currentMinutes - dayStart
                : currentMinutes < dayEnd
                  ? currentMinutes + (MINUTES_PER_DAY - dayStart)
                  : -1;
    }

    const isLightOn = minutesIntoDayPhase >= 0;

    let progressPercent: number;
    let minutesUntilTransition: number;

    if (isLightOn) {
        progressPercent = lightMinutes > 0 ? (minutesIntoDayPhase / lightMinutes) * 100 : 100;
        minutesUntilTransition = lightMinutes - minutesIntoDayPhase;
    } else {
        let minutesIntoNight: number;
        if (dayStart <= dayEnd) {
            minutesIntoNight =
                currentMinutes >= dayEnd
                    ? currentMinutes - dayEnd
                    : currentMinutes + (MINUTES_PER_DAY - dayEnd);
        } else {
            minutesIntoNight = currentMinutes - dayEnd;
        }
        progressPercent = darkMinutes > 0 ? (minutesIntoNight / darkMinutes) * 100 : 100;
        minutesUntilTransition = darkMinutes - minutesIntoNight;
    }

    if (minutesUntilTransition < 0) {
        minutesUntilTransition = 0;
    }

    return {
        isLightOn,
        currentPhaseLabel: isLightOn ? "Hellphase" : "Dunkelphase",
        scheduleLabel: `${schedule.hoursLight}/${schedule.hoursDark}`,
        progressPercent: Math.min(100, Math.max(0, progressPercent)),
        minutesUntilTransition: Math.round(minutesUntilTransition),
        dayStartTime: minutesToTime(dayStart),
        dayEndTime: minutesToTime(dayEnd),
    };
}

export function formatMinutesRemaining(minutes: number): string {
    if (minutes < 1) return "< 1 Min";
    const h = Math.floor(minutes / 60);
    const m = minutes % 60;
    if (h === 0) return `${m} Min`;
    if (m === 0) return `${h} Std`;
    return `${h} Std ${m} Min`;
}

export function formatMinutesShort(minutes: number): string {
    if (minutes < 1) return "<1m";
    const h = Math.floor(minutes / 60);
    const m = minutes % 60;
    if (h === 0) return `${m}m`;
    if (m === 0) return `${h}h`;
    return `${h}h ${m}m`;
}

export function timeStringToMinutes(time: string): number {
    const [h, m] = time.split(":").map(Number);
    return (h || 0) * 60 + (m || 0);
}

export function minutesToTimeString(minutes: number): string {
    return minutesToTime(minutes);
}
