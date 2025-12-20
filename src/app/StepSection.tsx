import styles from "./StepSection.module.scss";
import { StepCard } from "./StepCard";
import { Section } from "@/components/Section/Section";

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
  <Section className={styles.stepSection}>
    <h2>So einfach geht's</h2>
    <p>In 3 Schritten zu optimalen Wachstumsbedingungen</p>
    <div className={styles.steps}>
      {steps.map((step, index) => (
        <StepCard key={index} {...step} />
      ))}
    </div>
  </Section>
);