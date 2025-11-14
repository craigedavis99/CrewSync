import { Button } from "@/components/ui/button";
import { Play } from "lucide-react";

export function CTASection() {
  return (
    <section className="py-32 px-6 lg:px-8 bg-muted/30">
      <div className="max-w-4xl mx-auto text-center">
        <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-6" data-testid="text-cta-heading">
          Ready to simplify your business?
        </h2>
        <p className="text-xl text-muted-foreground mb-10 max-w-2xl mx-auto" data-testid="text-cta-subheading">
          Join service professionals who have more time for what matters most.
        </p>

        <Button
          size="lg"
          className="bg-accent text-accent-foreground font-semibold text-lg px-10 shadow-lg hover:shadow-xl"
          data-testid="button-cta-primary"
        >
          <Play className="mr-2 h-5 w-5" />
          Watch a quick demo
        </Button>

        <p className="text-sm text-muted-foreground mt-6">
          No Risk 30 Day Trial · No credit card required
        </p>
      </div>
    </section>
  );
}
