import styles from "./StepSection.module.scss";
import { StepCard } from "./StepCard";
import CardGridSection from "../shared/CardGridSection";

export interface Step {
  num: string;
  title: string;
  desc: string;
}

const steps: Step[] = [
  { 
    num: '1', 
    title: 'Environments anlegen', 
    desc: 'Erstelle deine Growräume, Zelte oder Gewächshäuser' 
  },
  { 
    num: '2', 
    title: 'Pflanzen hinzufügen', 
    desc: 'Trage deine Pflanzen ein und notiere wichtige Daten' 
  },
  { 
    num: '3', 
    title: 'Überwachen & optimieren', 
    desc: 'Behalte alle Werte im Blick und erhalte Warnungen' 
  }
]

export const StepSection = () => (
  <CardGridSection 
    title="So einfach geht's"
    subtitle="In 3 Schritten zu optimalen Wachstumsbedingungen"
    items={steps}
    className={styles.steps}
    renderItem={(step, i) => (
      <StepCard key={i} {...step} />
    )}
  />
);