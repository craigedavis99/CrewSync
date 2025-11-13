import { Navigation } from "@/components/Navigation";
import { HeroSection } from "@/components/HeroSection";
import { ProblemSolutionSection } from "@/components/ProblemSolutionSection";
import { FeaturesSection } from "@/components/FeaturesSection";
import { FAQSection } from "@/components/FAQSection";
import { CTASection } from "@/components/CTASection";
import { Footer } from "@/components/Footer";

export default function Landing() {
  return (
    <div className="min-h-screen">
      <Navigation />
      <HeroSection />
      <ProblemSolutionSection />
      <FeaturesSection />
      <FAQSection />
      <CTASection />
      <Footer />
    </div>
  );
}
