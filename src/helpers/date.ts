export const formatDate = (timestamp: number) => {
    const date = new Date(timestamp);
    return date.toLocaleDateString('de-DE', { weekday: 'short', day: '2-digit', month: 'short' });
};

export const formatTime = (timestamp: number) =>
    new Date(timestamp).toLocaleTimeString('de-DE', { hour: '2-digit', minute: '2-digit' });

export interface Timestamped {
    timestamp: number;
}

export const groupEventsByDate = <T extends Timestamped>(events: T[]) => {
    const groups: Record<string, T[]> = {};

    events.forEach(e => {
        const key = new Date(e.timestamp).toDateString();
        groups[key] = groups[key] || [];
        groups[key].push(e);
    });

    return Object.entries(groups).sort(
        (a, b) => new Date(b[0]).getTime() - new Date(a[0]).getTime()
    );
};

export const formatDateShort = (date: Date) => {
    return date.toLocaleDateString('de-DE', { 
        day: '2-digit', 
        month: '2-digit', 
        year: 'numeric' 
    });
};

export const formatMonthYear = (date: Date) => {
    return date.toLocaleDateString('de-DE', { 
        month: 'long', 
        year: 'numeric' 
    });
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
    return date1.toDateString() === date2.toDateString();
};

export const setTimeToNoon = (date: Date): Date => {
    const newDate = new Date(date);
    newDate.setHours(12, 0, 0, 0);
    return newDate;
};

export const daysSince = (timestamp: number) =>
    (Date.now() - timestamp) / (1000 * 60 * 60 * 24);