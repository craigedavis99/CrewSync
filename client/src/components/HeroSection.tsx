import { Button } from "@/components/ui/button";
import { ArrowRight, CheckCircle2 } from "lucide-react";
import heroImage from "@assets/generated_images/Hero_construction_tech_image_407d4255.png";

export function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center pt-20">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-background via-background/95 to-background/60 z-10" />
        <img
          src={heroImage}
          alt="Construction crew using modern technology"
          className="w-full h-full object-cover"
        />
      </div>

      <div className="relative z-20 max-w-7xl mx-auto px-6 lg:px-8 py-20">
        <div className="max-w-3xl">
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-foreground mb-6 leading-tight" data-testid="text-hero-headline">
            Streamline Your Construction Crew Management
          </h1>
          <p className="text-xl md:text-2xl text-muted-foreground mb-8 leading-relaxed" data-testid="text-hero-subheadline">
            Powerful software that helps construction teams schedule, track, and manage their workforce efficiently. Save time, reduce errors, and boost productivity.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 mb-12">
            <Button
              size="lg"
              className="bg-accent text-accent-foreground font-semibold text-lg px-8 shadow-lg hover:shadow-xl"
              data-testid="button-hero-cta-primary"
            >
              Start Free Trial
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="border-2 border-primary/80 backdrop-blur-sm bg-background/50 text-foreground font-semibold text-lg px-8"
              data-testid="button-hero-cta-secondary"
            >
              Watch Demo
            </Button>
          </div>

          <div className="flex items-center gap-2 text-muted-foreground">
            <CheckCircle2 className="h-5 w-5 text-primary" />
            <span className="text-sm font-medium" data-testid="text-trust-indicator">
              Trusted by 500+ construction teams nationwide
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
