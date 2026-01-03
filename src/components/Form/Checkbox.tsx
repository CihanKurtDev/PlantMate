import styles from "./Checkbox.module.scss"

interface CheckboxProps {
    label: string
    checked: boolean
    onChange: (checked: boolean) => void
    disabled?: boolean
    className?: string
}

export const Checkbox = ({ 
    label, 
    checked, 
    onChange, 
    disabled = false,
    className 
} : CheckboxProps) => {
    return (
        <div className={`${styles.fieldCheckbox} ${className || ""}`}>
            <label className={styles.checkboxLabel}>
                <input
                type="checkbox"
                checked={checked}
                onChange={e => onChange(e.target.checked)}
                disabled={disabled}
                className={styles.checkboxInput}
                />
                {label}
            </label>
        </div>
    )
}

export default Checkbox