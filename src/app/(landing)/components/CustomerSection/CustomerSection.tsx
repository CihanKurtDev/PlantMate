import { CustomerCard } from "./CustomerCard";
import styles from "./CustomerSection.module.scss";
import CardGridSection from "../shared/CardGridSection";

export interface Customer {
  icon: string;
  title: string;
  desc: string;
  checkListItems: string[];
}

const customers: Customer[] = [
  { 
    icon: '✨', 
    title: 'Einfacher Start', 
    desc: 'Starte sofort ohne komplizierte Einrichtung und lerne dein Setup schnell kennen.',
    checkListItems: ["Schneller Einstieg", "Keine Vorkenntnisse nötig", "Kostenlos testen"] 
  },
  { 
    icon: '📈', 
    title: 'Optimiertes Wachstum', 
    desc: 'Hole das Beste aus deinen Pflanzen heraus und verbessere kontinuierlich deine Ergebnisse.',
    checkListItems: ["Bessere Erträge", "Gesündere Pflanzen", "Effiziente Pflege"] 
  },
  { 
    icon: '🤝', 
    title: 'Stressfreies Monitoring', 
    desc: 'Behalte alles im Blick und spare Zeit, während deine Pflanzen optimal versorgt werden.',
    checkListItems: ["Alles auf einen Blick", "Praktische Übersicht", "Sicher & zuverlässig"] 
  },
];

export const CustomerSection = () => (
  <CardGridSection 
    title="Deine Vorteile auf einen Blick"
    subtitle="Starte unkompliziert, behalte alles im Blick und hole das Beste aus deinen Pflanzen heraus."
    items={customers}
    className={styles.customerSection}
    renderItem={(customer, i) => (
      <CustomerCard key={i} {...customer} />
    )}
  />
);