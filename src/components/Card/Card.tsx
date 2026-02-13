"use client"
import { ReactNode, useState, useEffect, useRef } from "react";
import styles from "./Card.module.scss"
import { CardHeader } from "./CardHeader";

interface CardProps {
  className?: string;
  icon?: ReactNode;
  children: ReactNode;
  variant?: 'elevated' | 'flat' | 'interactive';
  title: string;
  collapsible?: boolean;
  defaultCollapsed?: boolean;
  headingLevel?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';
  headerLayout?: 'inline' | 'centered';
}

export const Card = ({
  className,
  icon,
  children,
  variant = 'elevated',
  title,
  collapsible = false,
  defaultCollapsed = false,
  headingLevel = 'h2',
  headerLayout = 'inline',
}: CardProps) => {
  const [collapsed, setCollapsed] = useState(defaultCollapsed);
  const [mounted, setMounted] = useState(false);
  const [bodyHeight, setBodyHeight] = useState<string>('2000px');
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!contentRef.current) return;

    const ro = new ResizeObserver(() => {
      if (contentRef.current) {
        setBodyHeight(contentRef.current.scrollHeight + 'px');
      }
    });

    ro.observe(contentRef.current);
    return () => ro.disconnect();
  }, []);

  const wrapStyle = collapsed
    ? { maxHeight: '0px' }
    : { maxHeight: bodyHeight };

  return (
    <section className={`${styles[variant]} ${className ?? ''}`}>
      <CardHeader
        title={title}
        icon={icon}
        headerLayout={headerLayout}
        collapsible={collapsible}
        collapsed={collapsed}
        onToggle={() => setCollapsed((prev) => !prev)}
        headingLevel={headingLevel}
      />
      <div
        style={wrapStyle}
        className={`${styles.collapsable} ${collapsed ? styles.collapsed : ''} ${!mounted ? styles.noTransition : ''}`}
      >
        <div ref={contentRef} className={styles.content}>
          {children}
        </div>
      </div>
    </section>
  );
};