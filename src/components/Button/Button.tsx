import type { ButtonHTMLAttributes, ReactNode } from "react";
import styles from './Button.module.scss';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    children: ReactNode;
    variant?: "primary" | "transparent" | "success" | "danger";
}

export const Button: React.FC<ButtonProps> = ({variant = "primary", children, ...rest}) => {
    const className = `${styles.button} ${variant ? styles[variant] : ""}`;
    return <button className={className} {...rest}>{children}</button>
}