import { Calendar, Phone, DollarSign, Users, Clock, Smartphone } from "lucide-react";
import teamImage from "@assets/generated_images/Team_collaboration_photo_00cf84d7.png";
import mobileImage from "@assets/generated_images/Mobile_app_mockup_photo_70e557bf.png";
import plumberImage from "@assets/generated_images/Plumber_with_missed_calls_9acda0fe.png";

const features = [
  {
    icon: Phone,
    title: "Never Miss a Call",
    description: "Automatically log every call and capture leads, even when you're on a job.",
    image: plumberImage,
  },
  {
    icon: Calendar,
    title: "Smart Scheduling",
    description: "See your jobs, appointments, and crew availability in one simple calendar.",
    image: teamImage,
  },
  {
    icon: DollarSign,
    title: "Fast Invoicing",
    description: "Create and send professional invoices in seconds. Get paid faster with automatic reminders.",
    image: null,
  },
  {
    icon: Users,
    title: "Crew Coordination",
    description: "Know who's working where and when. Keep your whole team on the same page.",
    image: null,
  },
  {
    icon: Clock,
    title: "Time Tracking",
    description: "Track hours worked on each job automatically. No more paper timesheets.",
    image: null,
  },
  {
    icon: Smartphone,
    title: "Works on Your Phone",
    description: "Full access from your phone, tablet, or computer. Work from anywhere.",
    image: mobileImage,
  },
];

export function FeaturesSection() {
  return (
    <section id="solutions" className="py-24 px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-20">
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-6" data-testid="text-features-heading">
            Everything you need to run your business
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto" data-testid="text-features-subheading">
            Simple tools for small service businesses
          </p>
        </div>

        <div className="space-y-32">
          {features.map((feature, index) => (
            <div
              key={index}
              className={`grid lg:grid-cols-2 gap-12 items-center ${
                index % 2 === 1 ? "lg:flex-row-reverse" : ""
              }`}
              data-testid={`section-feature-${index}`}
            >
              <div className={index % 2 === 1 ? "lg:order-2" : ""}>
                <div className="mb-6">
                  <div className="w-14 h-14 rounded-md bg-primary/10 flex items-center justify-center mb-4">
                    <feature.icon className="h-7 w-7 text-primary" />
                  </div>
                </div>
                <h3 className="text-3xl md:text-4xl font-bold text-foreground mb-4" data-testid={`text-feature-title-${index}`}>
                  {feature.title}
                </h3>
                <p className="text-lg text-muted-foreground leading-relaxed" data-testid={`text-feature-description-${index}`}>
                  {feature.description}
                </p>
              </div>
              <div className={index % 2 === 1 ? "lg:order-1" : ""}>
                {feature.image ? (
                  <img
                    src={feature.image}
                    alt={feature.title}
                    className="rounded-xl shadow-2xl w-full"
                    data-testid={`img-feature-${index}`}
                  />
                ) : (
                  <div className="aspect-[4/3] bg-muted/50 rounded-xl flex items-center justify-center">
                    <feature.icon className="h-24 w-24 text-muted-foreground/20" />
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
