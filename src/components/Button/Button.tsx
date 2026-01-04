import { ButtonHTMLAttributes, ReactNode } from 'react';
import styles from './Button.module.scss';

type ButtonVariant = 'primary' | 'secondary' | 'success' | 'alert' | "error";
type ButtonSize = 'sm' | 'md' | 'lg'| 'fill';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  variant?: ButtonVariant;
  size?: ButtonSize;
}

export function Button({
  children,
  variant = 'primary',
  size = 'md',
  ...props
}: ButtonProps) {

  return (
    <button className={`${styles.button} ${styles[variant]} ${styles[size]}`} {...props}>
      {children}
    </button>
  );
}
