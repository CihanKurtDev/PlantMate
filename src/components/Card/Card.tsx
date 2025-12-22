import { ReactNode } from "react";
import styles from "./Card.module.scss";

interface CardProps {
  className: string;
  icon?: ReactNode;
  children: ReactNode;
};



export const Card = ({ className, icon, children }: CardProps) => (
  <div className={className}>
    {icon && <figure>{icon}</figure>}
    {children}
  </div>
);

