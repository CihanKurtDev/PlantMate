import { Card } from "@/components/Card/Card";
import { Feature } from "./FeatureSection";
import styles from "./FeatureCard.module.scss";

export const FeatureCard = ({ icon, title, desc }: Feature) => (
  <Card className={styles.featureCard} icon={icon}>
    <h3>{title}</h3>
    <p>{desc}</p>
  </Card>
);