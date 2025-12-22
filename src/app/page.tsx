import styles from "./page.module.scss";
import { HeroSection } from "./HeroSection";
import { StepSection } from "./StepSection";
import { FeatureSection } from "./FeatureSection";
import { CustomerSection } from "./CustomerSection";

export default function Home() {
  return (
    <div className={styles.page}>
      <main className={styles.main}>
        <HeroSection />
        <FeatureSection />
        <StepSection />
        <CustomerSection />
      </main>
    </div>
  );
}
