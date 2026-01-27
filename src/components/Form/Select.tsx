"use client";

import React from "react";
import styles from "./Select.module.scss";

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
    label?: string;
    error?: string;
    warning?: string;
}

export const Select: React.FC<SelectProps> = ({ label, error, warning, ...props }) => {
    return (
        <div className={styles.field}>
            {label && <label className={styles.label}>{label}</label>}
            <select {...props} className={styles.select} />
            {error && <span className={styles.error}>{error}</span>}
            {!error && warning && <span className={styles.warning}>{warning}</span>}
        </div>
    );
};
