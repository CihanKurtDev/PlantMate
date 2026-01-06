"use client";

import React from "react";
import styles from "./Select.module.scss";

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
    label?: string;
    error?: string;
    warning?: string;
    touched?: boolean;
}

export const Select: React.FC<SelectProps> = ({ label, error, warning, touched, ...props }) => {
    return (
        <div className={styles.field}>
            {label && <label className={styles.label}>{label}</label>}
            <select {...props} className={styles.select} />
            {touched && error && <span className={styles.error}>{error}</span>}
            {touched && !error && warning && <span className={styles.warning}>{warning}</span>}
        </div>
    );
};
