import Link from "next/link";
import styles from "./HeroSection.module.scss";
import { Section } from "@/components/Section/Section";
import { Button } from "@/components/Button/Button";

export const HeroSection = () => (
  <Section className={styles.heroSection}>
    <div className={styles.heroText}>
      <h1>Deine Pflanzen. Perfekt überwacht.</h1>
      <p>
        Von Hobbygärtner bis Profi – überwache Temperatur, Luftfeuchtigkeit, pH-Wert und mehr. 
        Erhalte intelligente Warnungen und optimiere dein Pflanzenwachstum.
      </p>
      <div className={styles.heroBtnWrapper}>
        <Button>
          <Link href="/register" className={styles.buttonLink}>
            Jetzt starten
          </Link>
        </Button>
        <Button variant="secondary">
          <Link href="/login" className={styles.buttonLink}>
            Login
          </Link>
        </Button>
      </div>
    </div>
  </Section>
);