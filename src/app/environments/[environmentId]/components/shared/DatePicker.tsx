import { ChevronLeft, ChevronRight, Calendar } from "lucide-react";
import styles from "./DatePicker.module.scss";
import { formatDateShort, formatMonthYear, isSameDay } from "@/helpers/date";
import { useDatePicker } from "@/hooks/useDatePicker";

interface DatePickerProps {
  value: number;
  onChange: (timestamp: number) => void;
  label?: string;
  monthsBack?: number;
  monthsForward?: number;
}
const WEEKDAYS = ['Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa', 'So'];

export default function DatePicker({ value, onChange, label = "Datum", monthsBack = 1, monthsForward = 1 }: DatePickerProps) {
    const {
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
    } = useDatePicker({ value, onChange, monthsBack, monthsForward });
        
        
    const getDayClasses = (date: Date | null) => {
        if (!date) return `${styles.day} ${styles.empty}`;

        const classes = [styles.day];
        if (isDateDisabled(date)) classes.push(styles.disabled);
        if (isSameDay(date, selectedDate)) classes.push(styles.selected);
        if (isSameDay(date, today)) classes.push(styles.today);

        return classes.join(' ');
    };
    
    return (
        <div className={styles.datePicker} ref={pickerRef}>
            {label && <label className={styles.label}>{label}</label>}

            <button type="button" onClick={() => setIsOpen(!isOpen)} className={styles.input}>
                <Calendar className={styles.icon} />
                <span>{formatDateShort(selectedDate)}</span>
            </button>

            {isOpen && (
                <div className={styles.dropdown}>
                    <div className={styles.header}>
                        <button
                            type="button"
                            onClick={() => navigateMonth(-1)}
                            disabled={!canNavigate(-1)}
                            className={styles.navButton}
                            aria-label="Vorheriger Monat"
                        >
                            <ChevronLeft />
                        </button>

                        <h3 className={styles.monthYear}>{formatMonthYear(viewDate)}</h3>

                        <button
                            type="button"
                            onClick={() => navigateMonth(1)}
                            disabled={!canNavigate(1)}
                            className={styles.navButton}
                            aria-label="Nächster Monat"
                        >
                            <ChevronRight />
                        </button>
                    </div>

                    <div className={styles.weekdays}>
                        {WEEKDAYS.map(day => (
                            <div key={day} className={styles.weekday}>{day}</div>
                        ))}
                    </div>

                    <div className={styles.calendar}>
                        {days.map((date, index) => (
                            <button
                                key={index}
                                type="button"
                                onClick={() => handleDateClick(date)}
                                disabled={isDateDisabled(date)}
                                className={getDayClasses(date)}
                                aria-label={date ? formatDateShort(date) : undefined}
                            >
                                {date?.getDate()}
                            </button>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}