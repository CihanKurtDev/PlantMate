import { FeatureCard } from "./FeatureCard";
import styles from "./FeatureSection.module.scss";
import CardGridSection from "../shared/CardGridSection";

export interface Feature {
  icon: string;
  title: string;
  desc: string;
}

const features: Feature[] = [
  { 
    icon: '📊', 
    title: 'Live Monitoring', 
    desc: 'Verfolge Temperatur, Luftfeuchtigkeit, VPD, CO₂, pH-Wert und EC in Echtzeit. Alle Daten übersichtlich an einem Ort.' 
  },
  { 
    icon: '🔔', 
    title: 'Intelligente Warnungen', 
    desc: 'Erhalte sofortige Benachrichtigungen wenn Werte außerhalb des optimalen Bereichs liegen. Reagiere schnell, bevor Probleme entstehen.' 
  },
  { 
    icon: '🌱', 
    title: 'Mehrere Environments', 
    desc: 'Verwalte unbegrenzt viele Räume, Growboxen oder Gewächshäuser. Perfekt für professionelle Grower mit mehreren Standorten.' 
  }
];

export const FeatureSection = () => (
  <CardGridSection 
    title="Alles was du brauchst"
    subtitle="Professionelles Monitoring für jeden Grower"
    items={features}
    className={styles.featureSection}
    renderItem={(feature, index) => (
        <FeatureCard key={index} {...feature} />
    )}
  />
);