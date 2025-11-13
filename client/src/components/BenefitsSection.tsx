import { Button } from "@/components/ui/button";
import { CheckCircle2 } from "lucide-react";
import dashboardImage from "@assets/generated_images/Dashboard_interface_mockup_37adf6c7.png";
import teamImage from "@assets/generated_images/Team_collaboration_photo_00cf84d7.png";
import mobileImage from "@assets/generated_images/Mobile_app_mockup_photo_70e557bf.png";

const benefits = [
  {
    title: "Reduce Scheduling Conflicts by 80%",
    description: "Our intelligent scheduling system automatically detects and prevents conflicts, ensuring optimal crew allocation across all your projects.",
    image: dashboardImage,
    features: [
      "Automated conflict detection",
      "Skill-based crew matching",
      "Real-time availability updates",
      "Multi-project coordination",
    ],
    imagePosition: "right" as const,
  },
  {
    title: "Boost Team Productivity",
    description: "Give your crews the tools they need to work efficiently with mobile access, instant communication, and streamlined workflows.",
    image: teamImage,
    features: [
      "Mobile-first design",
      "Instant notifications",
      "Digital timesheets",
      "Progress tracking",
    ],
    imagePosition: "left" as const,
  },
  {
    title: "Stay Connected Anywhere",
    description: "Full-featured mobile app keeps foremen and crew members in sync, whether they're on the job site or in the office.",
    image: mobileImage,
    features: [
      "Offline capabilities",
      "GPS time tracking",
      "Photo documentation",
      "Two-way communication",
    ],
    imagePosition: "right" as const,
  },
];

export function BenefitsSection() {
  return (
    <section id="about" className="py-24">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="text-center mb-20">
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4" data-testid="text-benefits-heading">
            Built for Modern Construction Teams
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto" data-testid="text-benefits-subheading">
            See how CrewSync transforms construction workforce management
          </p>
        </div>

        <div className="space-y-32">
          {benefits.map((benefit, index) => (
            <div
              key={index}
              className={`grid lg:grid-cols-2 gap-12 items-center ${
                benefit.imagePosition === "left" ? "lg:flex-row-reverse" : ""
              }`}
              data-testid={`section-benefit-${index}`}
            >
              <div className={benefit.imagePosition === "left" ? "lg:order-2" : ""}>
                <h3 className="text-3xl md:text-4xl font-bold text-foreground mb-6" data-testid={`text-benefit-title-${index}`}>
                  {benefit.title}
                </h3>
                <p className="text-lg text-muted-foreground mb-8 leading-relaxed" data-testid={`text-benefit-description-${index}`}>
                  {benefit.description}
                </p>
                <ul className="space-y-4 mb-8">
                  {benefit.features.map((feature, featureIndex) => (
                    <li
                      key={featureIndex}
                      className="flex items-center gap-3"
                      data-testid={`text-benefit-feature-${index}-${featureIndex}`}
                    >
                      <CheckCircle2 className="h-5 w-5 text-primary flex-shrink-0" />
                      <span className="text-foreground">{feature}</span>
                    </li>
                  ))}
                </ul>
                <Button
                  size="lg"
                  className="bg-primary text-primary-foreground font-semibold"
                  data-testid={`button-benefit-cta-${index}`}
                >
                  Learn More
                </Button>
              </div>
              <div className={benefit.imagePosition === "left" ? "lg:order-1" : ""}>
                <img
                  src={benefit.image}
                  alt={benefit.title}
                  className="rounded-xl shadow-2xl w-full"
                  data-testid={`img-benefit-${index}`}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
