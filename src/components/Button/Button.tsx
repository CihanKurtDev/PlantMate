import { ButtonHTMLAttributes, ReactNode } from 'react';
import styles from './Button.module.scss';

// TODO: refactore this whole size variant stuff its stupid the way it is right now

type ButtonVariant = 'primary' | 'secondary' | 'success' | 'alert' | "error" | "floating" | "rounded";
type ButtonSize = 'sm' | 'md' | 'lg'| 'fill' | "round";

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
    <button className={`${styles[variant]} ${styles[size]}`} {...props}>
      {children}
    </button>
  );
}
