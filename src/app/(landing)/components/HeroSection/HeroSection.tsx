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
        <Link href="/register" className={styles.buttonLink}>
          <Button>
            Jetzt starten
          </Button>
        </Link>
        <Link href="/login" className={styles.buttonLink}>
          <Button variant="secondary">
            Login
          </Button>
        </Link>
      </div>
    </div>
  </Section>
);