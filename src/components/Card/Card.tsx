"use client"
import { ReactNode, useState, useEffect } from "react";
import styles from "./Card.module.scss"
import { CardHeader } from "./CardHeader";

interface CardProps {
  className?: string;
  icon?: ReactNode;
  children: ReactNode;
  variant?: 'elevated' | 'flat' | "interactive";
  title: string;
  collapsible?: boolean;
  defaultCollapsed?: boolean;
  headingLevel?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6'; 
};

export const Card = ({ 
  className, 
  icon, 
  children, 
  variant = "elevated",
  title,
  collapsible = false,
  defaultCollapsed = false,
  headingLevel = "h2",
}: CardProps) => {
  const [collapsed, setCollapsed] = useState(defaultCollapsed);
  const [isFirstRender, setIsFirstRender] = useState(true);

  useEffect(() => {
    setIsFirstRender(false);
  }, []);

  return(
    <section className={`${styles[variant]} ${className || ''}`}>
      <CardHeader 
        title={title}
        collapsible={collapsible}
        collapsed={collapsed}
        onToggle={() => setCollapsed((p) => !p)}
        icon={icon}
        headingLevel={headingLevel}
      />
      <div className={`${styles.collapsable} ${collapsed ? styles.collapsed : ''} ${isFirstRender ? styles.noTransition : ''}`}>
        <div className={styles.content}>
          {children}
        </div>
      </div>
    </section>
  );
};