import { Button } from "@/components/ui/button";
import { ArrowRight, Shield, Clock, Users } from "lucide-react";

export function CTASection() {
  return (
    <section className="py-24 bg-gradient-to-br from-primary/5 via-background to-accent/5">
      <div className="max-w-4xl mx-auto px-6 lg:px-8 text-center">
        <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-6" data-testid="text-cta-heading">
          Ready to Transform Your Crew Management?
        </h2>
        <p className="text-xl text-muted-foreground mb-12 max-w-2xl mx-auto" data-testid="text-cta-subheading">
          Join hundreds of construction teams who have streamlined their operations with CrewSync. Start your free trial today.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
          <Button
            size="lg"
            className="bg-accent text-accent-foreground font-semibold text-lg px-8 shadow-lg hover:shadow-xl"
            data-testid="button-cta-primary"
          >
            Start Free Trial
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
          <Button
            size="lg"
            variant="outline"
            className="border-2 border-primary text-primary font-semibold text-lg px-8"
            data-testid="button-cta-secondary"
          >
            Schedule a Demo
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16">
          <div className="flex flex-col items-center gap-3" data-testid="section-trust-badge-0">
            <div className="w-12 h-12 rounded-md bg-primary/10 flex items-center justify-center">
              <Shield className="h-6 w-6 text-primary" />
            </div>
            <p className="text-sm font-medium text-muted-foreground">
              Enterprise-grade security
            </p>
          </div>
          <div className="flex flex-col items-center gap-3" data-testid="section-trust-badge-1">
            <div className="w-12 h-12 rounded-md bg-primary/10 flex items-center justify-center">
              <Clock className="h-6 w-6 text-primary" />
            </div>
            <p className="text-sm font-medium text-muted-foreground">
              24/7 customer support
            </p>
          </div>
          <div className="flex flex-col items-center gap-3" data-testid="section-trust-badge-2">
            <div className="w-12 h-12 rounded-md bg-primary/10 flex items-center justify-center">
              <Users className="h-6 w-6 text-primary" />
            </div>
            <p className="text-sm font-medium text-muted-foreground">
              No credit card required
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
