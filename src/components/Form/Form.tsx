import styles from './Form.module.scss'
interface FormProps extends React.FormHTMLAttributes<HTMLFormElement> {
    children: React.ReactNode;
}

export default function Form ({children, className ="", ...rest}: FormProps){
    return (
        <form 
            className={`${styles.form} ${className ?? ""}`} 
            {...rest}
        >
            {children}
        </form>
    )
}

export const FormSectionTitle = ({children}: {children: React.ReactNode}) => (
    <h3 className={styles.sectionTitle}>{children}</h3>
);

export const FormField = ({children,}: {children: React.ReactNode;}) => (
    <div className={styles.field}>{children}</div>
);
