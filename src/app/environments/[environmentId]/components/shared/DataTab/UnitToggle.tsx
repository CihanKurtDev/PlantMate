import styles from "./UnitToggle.module.scss";

interface UnitToggleProps {
    options: { label: string; value: string }[];
    value: string;
    onChange: (value: string) => void;
}

export function UnitToggle({ options, value, onChange }: UnitToggleProps) {
    return (
        <div className={styles.toggle}>
            {options.map(option => (
                <button
                    key={option.value}
                    className={`${styles.btn} ${value === option.value ? styles.active : ""}`}
                    onClick={() => onChange(option.value)}
                    type="button"
                >
                    {option.label}
                </button>
            ))}
        </div>
    );
}