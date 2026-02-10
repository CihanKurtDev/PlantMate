import { Card } from "@/components/Card/Card";
import { Feature } from "./FeatureSection";
import styles from "./FeatureCard.module.scss";

export const FeatureCard = ({ icon, title, desc }: Feature) => (
  <Card 
    title={title} 
    className={styles.featureCard} 
    icon={icon}
    headingLevel="h3"
  >
    <p>{desc}</p>
  </Card>
);