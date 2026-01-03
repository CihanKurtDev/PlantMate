import styles from "./Input.module.scss"

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string
  error?: string
  touched?: boolean
}

export const Input = ({ 
  label, 
  error, 
  touched, 
  className, 
  id,
  ...props 
}: InputProps) => {
  const inputId = id || `input-${label.toLowerCase().replace(/\s+/g, "-")}`
  
  return (
    <div className={styles.field}>
      <label htmlFor={inputId} className={styles.label}>
        {label}
      </label>
      <input
        id={inputId}
        className={`${styles.input} ${touched && error ? styles.inputError : ""} ${className || ""}`}
        {...props}
      />
      {touched && error && (
        <span className={styles.fieldError}>{error}</span>
      )}
    </div>
  )
}