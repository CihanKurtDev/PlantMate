import { Card } from "@/components/Card/Card";
import { Customer } from "./CustomerSection";
import styles from "./CustomerCard.module.scss";

export const CustomerCard = ({ icon, title, desc, checkListItems }: Customer) => (
  <Card className={styles.customerCard} icon={icon}>
    <h3>{title}</h3>
    <p>{desc}</p>
    <ul>
      {checkListItems.map(item => <li key={item}>✓ {item}</li>)}
    </ul>
  </Card>
);