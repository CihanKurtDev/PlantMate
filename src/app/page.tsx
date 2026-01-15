import { HeroSection } from "./(landing)/components/HeroSection/HeroSection";
import { FeatureSection } from "./(landing)/components/FeatureSection/FeatureSection";
import { CustomerSection } from "./(landing)/components/CustomerSection/CustomerSection";
import { StepSection } from "./(landing)/components/StepSection/StepSection";

export default function Home() {
  return (
    <>
      <HeroSection />
      <FeatureSection />
      <StepSection />
      <CustomerSection />
    </>
  );
}
