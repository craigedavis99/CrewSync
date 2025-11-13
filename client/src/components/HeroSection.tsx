import { Button } from "@/components/ui/button";
import { Play, CheckCircle2 } from "lucide-react";
import dashboardImage from "@assets/generated_images/Dashboard_interface_mockup_37adf6c7.png";

export function HeroSection() {
  return (
    <section className="pt-32 pb-20 px-6 lg:px-8">
      <div className="max-w-5xl mx-auto text-center">
        <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-foreground mb-6 leading-tight" data-testid="text-hero-headline">
          Simple tools so you can focus on the work, not the paperwork.
        </h1>
        <p className="text-xl md:text-2xl text-muted-foreground mb-3 leading-relaxed max-w-3xl mx-auto" data-testid="text-hero-subheadline">
          CrewSync helps you provide better customer service, stop missing leads, and eliminate the hassle of tracking invoices and payments — all in one simple place.
        </p>
        
        <p className="text-lg text-primary font-medium mb-10" data-testid="text-hero-microline">
          Let us help today.
        </p>

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
              0 Risk 30 Day Trial
            </span>
            <span className="flex items-center gap-1">
              <CheckCircle2 className="h-4 w-4 text-primary" />
              No credit card required
            </span>
          </div>
        </div>

        <a
          href="#join"
          className="text-primary hover:text-primary/80 font-medium text-base underline underline-offset-4"
          data-testid="link-hero-cta-secondary"
        >
          Join the first 25 crews
        </a>

        <div className="mt-16">
          <img
            src={dashboardImage}
            alt="CrewSync Dashboard"
            className="rounded-xl shadow-2xl w-full"
            data-testid="img-hero-product"
          />
        </div>
      </div>
    </section>
  );
}
