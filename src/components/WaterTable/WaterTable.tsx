import React from "react";
import { type PlantData } from "../../data/tents";
import styles from './WaterTable.module.scss'

interface WaterTableProps {
  water: PlantData["water"];
}

export const WaterTable: React.FC<WaterTableProps> = ({ water }) => {
  if (!water) return null;

  return (
    <table className={styles["water-table"]}>
      <tbody>
        {Object.entries(water).map(([key, value]) => {
          return(
                  <tr key={key}>
                  <td className={styles["table-key"]}>
                      {key.toUpperCase()}
                  </td>
                  <td  className={styles["table-value"]}>
                      {`${value}`}
                  </td>
              </tr>
          )
        })}
      </tbody>
    </table>
  );
};
