import { Section } from "@/components/Section/Section";
import { CustomerCard } from "./CustomerCard";
import styles from "./CustomerSection.module.scss";

export interface Customer {
  icon: string;
  title: string;
  desc: string;
  checkListItems: string[];
}

const customers: Customer[] = [
  { 
    icon: '🌱', 
    title: 'Mehrere Environments', 
    desc: 'Verwalte unbegrenzt viele Räume, Growboxen oder Gewächshäuser. Perfekt für professionelle Grower mit mehreren Standorten.',
    checkListItems: ["Einfache Bedienung", "Hilfreiche Tipps", "Kostenloser Start"] 
  },
  { 
    icon: '🏆', 
    title: 'Mehrere Environments', 
    desc: 'Verwalte unbegrenzt viele Räume, Growboxen oder Gewächshäuser. Perfekt für professionelle Grower mit mehreren Standorten.',
    checkListItems: ["Unbegrenzte Environments", "Erweiterte Analytik"] 
  },
];

export const CustomerSection = () => (
  <Section className={styles.customerSection}>
    <h2>Alles was du brauchst</h2>
    <p>Professionelles Monitoring für jeden Grower</p>
    <div className={styles.customerListWrapper}>
      {customers.map((feature, index) => (
        <CustomerCard key={index} {...feature} />
      ))}
    </div>
  </Section>
);