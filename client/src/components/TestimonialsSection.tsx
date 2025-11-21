const testimonials = [
  {
    name: "Tom Richards",
    role: "Owner",
    company: "Richards Plumbing",
    content: "I use CrewSynch to track everything and make sure important jobs get done. It's the best investment I've made in my business.",
  },
  {
    name: "Maria Santos",
    role: "HVAC Technician",
    company: "CoolAir Services",
    content: "CrewSynch is the productivity tool I've been searching for my whole career. Actually, it's even better than I imagined.",
  },
  {
    name: "James Chen",
    role: "Garage Door Specialist",
    company: "DoorMasters LLC",
    content: "The tool that has had the greatest impact on my business is unquestionably CrewSynch. I can't imagine working without it.",
  },
];

export function TestimonialsSection() {
  return (
    <section className="py-24 px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <div className="grid md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <div
              key={index}
              className="space-y-4"
              data-testid={`card-testimonial-${index}`}
            >
              <p className="text-foreground text-lg leading-relaxed italic" data-testid={`text-testimonial-content-${index}`}>
                "{testimonial.content}"
              </p>
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center">
                  <span className="font-semibold text-foreground">
                    {testimonial.name.split(' ').map(n => n[0]).join('')}
                  </span>
                </div>
                <div>
                  <p className="font-semibold text-foreground" data-testid={`text-testimonial-name-${index}`}>
                    {testimonial.name}
                  </p>
                  <p className="text-sm text-muted-foreground" data-testid={`text-testimonial-role-${index}`}>
                    {testimonial.role}, {testimonial.company}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
