"use client"
import { ReactNode, useState } from "react";
import styles from "./Card.module.scss"
import { CardHeader } from "./CardHeader";

interface CardProps {
  className?: string;
  icon?: ReactNode;
  children: ReactNode;
  variant?: string;
  title?: string;
  collapsible?: boolean;
  defaultCollapsed?: boolean;
  headingLevel?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6'; 
};

export const Card = ({ 
  className, 
  icon, 
  children, 
  variant = "base", 
  title,
  collapsible = false,
  defaultCollapsed = false,
  headingLevel = "h2", //
}: CardProps) => {
  const [collapsed, setCollapsed] = useState(defaultCollapsed);

  return(
    <section className={`${className} ${styles[variant]}`}>
      {title && (
        <CardHeader 
          title={title}
          collapsible={collapsible}
          collapsed={collapsed}
          onToggle={() => setCollapsed((p) => !p)}
          icon={icon}
          headingLevel={headingLevel}
        />
      )}
      <div className={`${styles.collapsable} ${collapsed ? styles.collapsed : ''}`}>
        {children}
      </div>
    </section>
)};

