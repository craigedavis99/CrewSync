import { Card } from "@/components/ui/card";
import { Star } from "lucide-react";

const testimonials = [
  {
    name: "Mike Johnson",
    role: "Project Manager",
    company: "BuildRight Construction",
    content: "CrewSync has completely transformed how we manage our workforce. Scheduling that used to take hours now takes minutes.",
    rating: 5,
  },
  {
    name: "Sarah Chen",
    role: "Operations Director",
    company: "Skyline Builders",
    content: "The mobile app is a game-changer. Our foremen can track everything in real-time, and we've eliminated scheduling conflicts.",
    rating: 5,
  },
  {
    name: "David Martinez",
    role: "Site Supervisor",
    company: "Premier Contracting",
    content: "Finally, a system that actually works for construction crews. The time tracking and compliance features alone are worth it.",
    rating: 5,
  },
];

export function TestimonialsSection() {
  return (
    <section className="py-24 bg-secondary text-secondary-foreground">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-4" data-testid="text-testimonials-heading">
            Trusted by Construction Professionals
          </h2>
          <p className="text-xl text-secondary-foreground/80 max-w-3xl mx-auto" data-testid="text-testimonials-subheading">
            See what construction teams are saying about CrewSync
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <Card
              key={index}
              className="p-8 bg-background hover-elevate transition-all duration-300"
              data-testid={`card-testimonial-${index}`}
            >
              <div className="flex gap-1 mb-4">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star
                    key={i}
                    className="h-5 w-5 fill-accent text-accent"
                  />
                ))}
              </div>
              <p className="text-foreground mb-6 leading-relaxed" data-testid={`text-testimonial-content-${index}`}>
                "{testimonial.content}"
              </p>
              <div>
                <p className="font-semibold text-foreground" data-testid={`text-testimonial-name-${index}`}>
                  {testimonial.name}
                </p>
                <p className="text-sm text-muted-foreground" data-testid={`text-testimonial-role-${index}`}>
                  {testimonial.role}, {testimonial.company}
                </p>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
