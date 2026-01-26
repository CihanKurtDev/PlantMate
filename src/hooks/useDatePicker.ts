import { useState, useRef, useEffect } from "react";
import { getDateRange, getDaysInMonth, isDateInRange, setTimeToNoon } from "@/helpers/date";

interface UseDatePickerProps {
    value: number;
    onChange: (timestamp: number) => void;
    monthsBack?: number;
    monthsForward?: number;
}

export function useDatePicker({ value, onChange, monthsBack = 1, monthsForward = 1 }: UseDatePickerProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [viewDate, setViewDate] = useState(new Date(value));
    const pickerRef = useRef<HTMLDivElement>(null);

    const selectedDate = new Date(value);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const { minDate, maxDate } = getDateRange(today, monthsBack, monthsForward);
    const days = getDaysInMonth(viewDate);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (pickerRef.current && !pickerRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };

        if (isOpen) {
            document.addEventListener("mousedown", handleClickOutside);
            return () => document.removeEventListener("mousedown", handleClickOutside);
        }
    }, [isOpen]);

    const isDateDisabled = (date: Date | null) => {
        if (!date) return true;
        return !isDateInRange(date, minDate, maxDate);
    };

    const handleDateClick = (date: Date | null) => {
        if (!date || isDateDisabled(date)) return;
        const timestamp = setTimeToNoon(date);
        onChange(timestamp.getTime());
        setIsOpen(false);
    };

    const navigateMonth = (direction: number) => {
        setViewDate(prev => {
            const newDate = new Date(prev);
            newDate.setMonth(newDate.getMonth() + direction);
            return newDate;
        });
    };

    const canNavigate = (direction: number) => {
        const targetMonth = new Date(viewDate);
        targetMonth.setMonth(targetMonth.getMonth() + direction);
        targetMonth.setDate(1);

        const compareDate = new Date(
            direction < 0 ? minDate.getFullYear() : maxDate.getFullYear(),
            direction < 0 ? minDate.getMonth() : maxDate.getMonth(),
            1
        );

        return direction < 0 ? targetMonth >= compareDate : targetMonth <= compareDate;
    };

    return {
        isOpen,
        setIsOpen,
        viewDate,
        selectedDate,
        today,
        days,
        pickerRef,
        isDateDisabled,
        handleDateClick,
        navigateMonth,
        canNavigate,
    };
}