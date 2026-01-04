import { Card } from "@/components/Card/Card";
import { Step } from "./StepSection";
import styles from "./StepCard.module.scss";

export const StepCard = ({ num, title, desc }: Step) => (
  <Card className={styles.stepCard}>
    <div><span className={styles.num}>{num}</span></div>
    <h3>{title}</h3>
    <p>{desc}</p>
  </Card>
);