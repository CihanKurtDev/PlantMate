const LOCALE = "de-DE";
const APP_TIME_ZONE = "Europe/Berlin";

const dateFormatter = new Intl.DateTimeFormat(LOCALE, {
    weekday: "short",
    day: "2-digit",
    month: "short",
    timeZone: APP_TIME_ZONE,
});

const timeFormatter = new Intl.DateTimeFormat(LOCALE, {
    hour: "2-digit",
    minute: "2-digit",
    timeZone: APP_TIME_ZONE,
});

const dateShortFormatter = new Intl.DateTimeFormat(LOCALE, {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    timeZone: APP_TIME_ZONE,
});

const monthYearFormatter = new Intl.DateTimeFormat(LOCALE, {
    month: "long",
    year: "numeric",
    timeZone: APP_TIME_ZONE,
});

const dayMonthFormatter = new Intl.DateTimeFormat(LOCALE, {
    day: "2-digit",
    month: "2-digit",
    timeZone: APP_TIME_ZONE,
});

const dayKeyFormatter = new Intl.DateTimeFormat("en-CA", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    timeZone: APP_TIME_ZONE,
});

export const formatDate = (timestamp: number) => dateFormatter.format(new Date(timestamp));

export const formatTime = (timestamp: number) =>
    timeFormatter.format(new Date(timestamp));

export interface Timestamped {
    timestamp: number;
}

export const toDateKey = (timestamp: number): string => {
    const parts = dayKeyFormatter.formatToParts(new Date(timestamp));
    const year = parts.find((part) => part.type === "year")?.value ?? "1970";
    const month = parts.find((part) => part.type === "month")?.value ?? "01";
    const day = parts.find((part) => part.type === "day")?.value ?? "01";
    return `${year}-${month}-${day}`;
};

export const dateKeyToTimestamp = (dateKey: string): number => {
    const [year, month, day] = dateKey.split("-").map(Number);
    return Date.UTC(year, (month || 1) - 1, day || 1, 12, 0, 0, 0);
};

export const groupEventsByDate = <T extends Timestamped>(events: T[]) => {
    const groups: Record<string, T[]> = {};

    events.forEach(e => {
        const key = toDateKey(e.timestamp);
        groups[key] = groups[key] || [];
        groups[key].push(e);
    });

    return Object.entries(groups).sort((a, b) => b[0].localeCompare(a[0]));
};

export const formatDateShort = (date: Date) => {
    return dateShortFormatter.format(date);
};

export const formatMonthYear = (date: Date) => {
    return monthYearFormatter.format(date);
};

export const getDaysInMonth = (date: Date): (Date | null)[] => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    
    const days: (Date | null)[] = [];
    const startDay = firstDay.getDay() === 0 ? 6 : firstDay.getDay() - 1;
    
    for (let i = 0; i < startDay; i++) {
        days.push(null);
    }
    
    for (let i = 1; i <= lastDay.getDate(); i++) {
        days.push(new Date(year, month, i));
    }
    
    return days;
};

export const getDateRange = (referenceDate: Date, monthsBack: number, monthsForward: number) => {
    const minDate = new Date(referenceDate);
    minDate.setMonth(minDate.getMonth() - monthsBack);
    minDate.setHours(0, 0, 0, 0);
    
    const maxDate = new Date(referenceDate);
    maxDate.setMonth(maxDate.getMonth() + monthsForward);
    maxDate.setHours(23, 59, 59, 999);
    
    return { minDate, maxDate };
};

export const isDateInRange = (date: Date, minDate: Date, maxDate: Date): boolean => {
    const compareDate = new Date(date);
    compareDate.setHours(0, 0, 0, 0);
    return compareDate >= minDate && compareDate <= maxDate;
};

export const isSameDay = (date1: Date, date2: Date): boolean => {
    return toDateKey(date1.getTime()) === toDateKey(date2.getTime());
};

export const setTimeToNoon = (date: Date): Date => {
    const newDate = new Date(date);
    newDate.setHours(12, 0, 0, 0);
    return newDate;
};

export const daysSince = (timestamp: number) =>
    (Date.now() - timestamp) / (1000 * 60 * 60 * 24);

export const formatTimestamp = (timestamp: number): string => {
    return dayMonthFormatter.format(new Date(timestamp));
};