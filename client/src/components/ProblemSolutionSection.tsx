import { X, CheckCircle2 } from "lucide-react";

const problems = [
  "Missing calls and losing potential customers",
  "Spending hours on invoicing and payment tracking",
  "Forgetting follow-ups and scheduling conflicts",
  "Constantly being interrupted answering texts and calls",
];

const solutions = [
  "Never miss a lead with automated call logging",
  "Get paid faster with simple invoicing and reminders",
  "Stay organized with a clear schedule and task list",
  "Simple to use technology, no learning curve needed",
];

export function ProblemSolutionSection() {
  return (
    <section className="py-24 px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        <div className="grid md:grid-cols-2 gap-16">
          <div>
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-8" data-testid="text-problem-heading">
              Running a service business is overwhelming
            </h2>
            <div className="space-y-4">
              {problems.map((problem, index) => (
                <div
                  key={index}
                  className="flex items-start gap-3"
                  data-testid={`text-problem-${index}`}
                >
                  <X className="h-5 w-5 text-destructive flex-shrink-0 mt-1" />
                  <span className="text-lg text-foreground">{problem}</span>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-8" data-testid="text-solution-heading">Crew Sync makes it simple</h2>
            <div className="space-y-4">
              {solutions.map((solution, index) => (
                <div
                  key={index}
                  className="flex items-start gap-3"
                  data-testid={`text-solution-${index}`}
                >
                  <CheckCircle2 className="h-5 w-5 text-primary flex-shrink-0 mt-1" />
                  <span className="text-lg text-foreground">{solution}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
