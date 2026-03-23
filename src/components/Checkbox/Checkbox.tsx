import { ReactNode } from "react";
import styles from "./Checkbox.module.scss";

interface CheckboxProps {
    label?: string
    children?: ReactNode
    checked: boolean
    onChange: (checked: boolean) => void
    disabled?: boolean
    disabledReason?: string;
    className?: string
    variant?: "default" | "success"
}

export const Checkbox = ({
    label,
    children,
    checked,
    onChange,
    disabled = false,
    disabledReason,
    className,
    variant = "default",
}: CheckboxProps) => {
    return (
        <label
            className={`${styles.fieldCheckbox} ${disabled ? styles.disabled : ""} ${className || ""}`}
            title={disabled && disabledReason ? disabledReason : undefined}
        >
            <input
                type="checkbox"
                checked={checked}
                onChange={(e) => onChange(e.target.checked)}
                disabled={disabled}
                className={styles.checkboxInput}
                aria-label={!label && !children ? label : undefined}
            />
            <span
                className={`
                    ${styles.checkboxControl}
                    ${styles[variant]}
                    ${checked ? styles.checked : ""}
                    ${disabled ? styles.disabledControl : ""}
                `}
                aria-hidden="true"
            >
                {checked && (
                    <svg width="10" height="8" viewBox="0 0 10 8" fill="none">
                        <polyline
                            points="1,4 4,7 9,1"
                            stroke="currentColor"
                            strokeWidth="1.5"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        />
                    </svg>
                )}
            </span>
            {label && <span className={styles.checkboxLabelText}>{label}</span>}
            {children}
        </label>
    )
}

export default Checkbox