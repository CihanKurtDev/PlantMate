import { HeroSection } from "./components/HeroSection/HeroSection";
import { FeatureSection } from "./components/FeatureSection/FeatureSection";
import { CustomerSection } from "./components/CustomerSection/CustomerSection";
import { StepSection } from "./components/StepSection/StepSection";

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
