import { ReactNode } from "react";
import styles from "./Card.module.scss";

interface CardProps {
  className: string;
  icon?: ReactNode;
  children: ReactNode;
};


// Todo: make icon component
const iconStyles = {
  width: "56px",
  height: "56px",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  fontSize: "1.75rem",
  marginBottom: "1rem",
}

export const Card = ({ className, icon, children }: CardProps) => (
  <div className={className}>
    {icon && <div style={iconStyles}>{icon}</div>}
    {children}
  </div>
);

