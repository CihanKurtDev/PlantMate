import { Card } from "@/components/Card/Card";
import { Step } from "./StepSection";
import styles from "./StepCard.module.scss";

export const StepCard = ({ num, title, desc }: Step) => (
  <Card 
    title={title} 
    className={styles.stepCard} 
    headingLevel="h3"
  >
    <div><span className={styles.num}>{num}</span></div>
    <p>{desc}</p>
  </Card>
);