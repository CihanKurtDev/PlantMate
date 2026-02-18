import { ButtonHTMLAttributes, ReactNode } from 'react';
import styles from './Button.module.scss';

type ButtonVariant = 'primary' | 'secondary' | 'success' | 'alert' | "error" | "floating" | "rounded";
type ButtonSize = 'sm' | 'md' | 'lg' | 'fill' | "round";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  variant?: ButtonVariant;
  size?: ButtonSize;
  isActive?: boolean;
}

export function Button({
  children,
  variant = 'primary',
  size = 'md',
  isActive = false,
  ...props
}: ButtonProps) {
  return (
    <button
      className={`${styles[variant]} ${styles[size]} ${isActive ? styles.isActive : ''}`}
      {...props}
    >
      {children}
    </button>
  );
}