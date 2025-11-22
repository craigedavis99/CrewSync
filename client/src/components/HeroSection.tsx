import { Button } from "@/components/ui/button";
import { Play, CheckCircle2 } from "lucide-react";
import dashboardImage from "@assets/generated_images/Dashboard_interface_mockup_37adf6c7.png";

export function HeroSection() {
  return (
    <section className="pt-28 pb-6 px-6 lg:px-8">
      <div className="max-w-5xl mx-auto text-center">
        <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-foreground mb-4 leading-tight" data-testid="text-hero-headline">
          Simple tools so you can focus on the work, not the paperwork.
        </h1>
        <p className="text-xl md:text-2xl text-muted-foreground mb-6 leading-relaxed max-w-3xl mx-auto" data-testid="text-hero-subheadline">From first call to final invoice, CrewSynch keeps it all organized in one simple, easy-to-use interface</p>
        
        <div className="mb-8">
          <Button
            size="lg"
            className="bg-[#67bcd9] text-accent-foreground font-bold text-2xl px-16 py-7 shadow-2xl hover:shadow-3xl transition-all duration-300 hover:scale-105 border-2 border-accent"
            data-testid="button-hero-help-today"
          >
            Let us help today
          </Button>
        </div>

        <div className="flex flex-col items-center gap-3 mb-6">
          <Button
            size="lg"
            className="bg-accent text-accent-foreground font-semibold text-lg px-10 shadow-lg hover:shadow-xl"
            data-testid="button-hero-cta-primary"
          >
            <Play className="mr-2 h-5 w-5" />
            Watch a quick demo
          </Button>
          <div className="flex items-center gap-6 text-sm text-muted-foreground">
            <span className="flex items-center gap-1">
              <CheckCircle2 className="h-4 w-4 text-primary" />
              No Risk 30 Day Trial
            </span>
            <span className="flex items-center gap-1">
              <CheckCircle2 className="h-4 w-4 text-primary" />
              No credit card required
            </span>
          </div>
        </div>

      </div>
    </section>
  );
}
