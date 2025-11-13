import { Button } from "@/components/ui/button";
import { Play } from "lucide-react";
import heroImage from "@assets/generated_images/Blue_collar_services_hero_aa248fb0.png";

export function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center pt-20">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-background via-background/95 to-background/60 z-10" />
        <img
          src={heroImage}
          alt="Blue collar service professionals"
          className="w-full h-full object-cover"
        />
      </div>

      <div className="relative z-20 max-w-7xl mx-auto px-6 lg:px-8 py-20">
        <div className="max-w-3xl">
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-foreground mb-6 leading-tight" data-testid="text-hero-headline">
            Simple tools so you can focus on the work, not the paperwork.
          </h1>
          <p className="text-xl md:text-2xl text-muted-foreground mb-4 leading-relaxed" data-testid="text-hero-subheadline">
            CrewSync helps you provide better customer service, stop missing leads, and eliminate the hassle of tracking invoices and payments — all in one simple place.
          </p>
          
          <p className="text-lg text-primary font-medium mb-8" data-testid="text-hero-microline">
            Let us help today.
          </p>

          <div className="flex flex-col gap-4 mb-12">
            <Button
              size="lg"
              className="bg-accent text-accent-foreground font-semibold text-lg px-8 shadow-lg hover:shadow-xl w-fit"
              data-testid="button-hero-cta-primary"
            >
              <Play className="mr-2 h-5 w-5" />
              Watch a quick demo
            </Button>
            <a
              href="#join"
              className="text-primary hover:text-primary/80 font-medium text-base underline underline-offset-4 w-fit"
              data-testid="link-hero-cta-secondary"
            >
              Join the first 25 crews
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
