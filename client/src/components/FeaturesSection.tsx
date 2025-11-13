import { Card } from "@/components/ui/card";
import { Calendar, Users, Clock, BarChart3, Shield, Smartphone } from "lucide-react";

const features = [
  {
    icon: Calendar,
    title: "Smart Scheduling",
    description: "Automated crew scheduling that optimizes assignments based on skills, availability, and project needs.",
  },
  {
    icon: Users,
    title: "Team Management",
    description: "Centralized crew database with certifications, skills tracking, and performance metrics.",
  },
  {
    icon: Clock,
    title: "Time Tracking",
    description: "Accurate time and attendance tracking with mobile clock-in/out and GPS verification.",
  },
  {
    icon: BarChart3,
    title: "Real-time Analytics",
    description: "Comprehensive dashboards and reports to track productivity, costs, and project progress.",
  },
  {
    icon: Shield,
    title: "Compliance & Safety",
    description: "Ensure all crew members have valid certifications and safety training documentation.",
  },
  {
    icon: Smartphone,
    title: "Mobile Access",
    description: "Full-featured mobile app for foremen and crew members to stay connected on the job site.",
  },
];

export function FeaturesSection() {
  return (
    <section id="solutions" className="py-24 bg-muted/30">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4" data-testid="text-features-heading">
            Everything You Need to Manage Your Crew
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto" data-testid="text-features-subheading">
            Powerful features designed specifically for construction workforce management
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <Card
              key={index}
              className="p-8 hover-elevate transition-all duration-300"
              data-testid={`card-feature-${index}`}
            >
              <div className="mb-4">
                <div className="w-12 h-12 rounded-md bg-primary/10 flex items-center justify-center">
                  <feature.icon className="h-6 w-6 text-primary" />
                </div>
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-3" data-testid={`text-feature-title-${index}`}>
                {feature.title}
              </h3>
              <p className="text-muted-foreground leading-relaxed" data-testid={`text-feature-description-${index}`}>
                {feature.description}
              </p>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
