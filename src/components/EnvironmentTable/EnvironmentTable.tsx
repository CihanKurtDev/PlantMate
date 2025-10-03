import React from "react";
import { type TentData } from "../../data/tents";
import styles from './EnvironmentTable.module.scss'

interface EnvironmentOverviewProps {
  environment: TentData["environment"];
}

const variableColors: Record<string, string> = {
  temp: "green",
  rlf: "cyan",
  vpd: "yellow",
  co2: "red",
};

const allKeys: (keyof TentData["environment"])[] = ["temp", "rlf", "vpd", "co2"];

export const EnvironmentOverview: React.FC<EnvironmentOverviewProps> = ({ environment }) => {
  if (!environment || Object.keys(environment).length === 0) return null;

  return (
    <div className={styles.overview}>
      {allKeys.map((key) => {
        const envValue = environment[key];
        const colorClass = variableColors[key] || "gray";

        return (
          <div key={key} className={styles.chip}>
            <span className={`${styles.label} ${styles[colorClass]}`}>{key.toUpperCase()}</span>
            <span className={styles.value}>
              {envValue ? `${envValue.value}${envValue.unit}` : "—"}
            </span>
          </div>
        );
      })}
    </div>
  );
};
