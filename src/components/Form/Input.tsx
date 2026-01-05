import styles from "./Input.module.scss"

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string | React.ReactNode
  error?: string
  warning?: string
  touched?: boolean
  iconLeft?: React.ReactNode
  suffix?: string  | React.ReactNode
}

export const Input = ({ 
  label, 
  error, 
  warning, 
  touched, 
  className = "", 
  id,
  iconLeft,
  suffix,
  ...props 
}: InputProps) => {
  const inputId = id || `input-${typeof label === "string" ? label.toLowerCase().replace(/\s+/g, "-") : "custom"}`

  return (
    <div className={styles.field}>
      <label htmlFor={inputId} className={styles.label}>
        {iconLeft && <span className={styles.iconLeft}>{iconLeft}</span>}
        {label}
      </label>

      <div className={styles.inputWrapper}>
        <input
          id={inputId}
          className={`${styles.input} ${touched && error ? styles.inputError : ""} ${className}`}
          {...props}
        />
        <div className={styles.suffixWrapper}>
          {suffix && <span className={styles.inputSuffix}>{suffix}</span>}
          {touched && error && <span className={styles.fieldError}>{error}</span>}
          {touched && !error && warning && <span className={styles.fieldWarning}>{warning}</span>}
        </div>
      </div>

    </div>
  )
}
