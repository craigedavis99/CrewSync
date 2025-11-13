import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const faqs = [
  {
    question: "How does CrewSync help with crew scheduling?",
    answer: "CrewSync uses intelligent algorithms to match crew members with projects based on their skills, certifications, and availability. It automatically detects scheduling conflicts and suggests optimal assignments, reducing scheduling time by up to 80%.",
  },
  {
    question: "Can my crew members use CrewSync on their phones?",
    answer: "Yes! CrewSync includes a full-featured mobile app for both iOS and Android. Crew members can clock in/out, view their schedules, communicate with the team, and upload documentation directly from their phones, even with limited connectivity.",
  },
  {
    question: "Is my data secure with CrewSync?",
    answer: "Absolutely. We use enterprise-grade encryption for all data in transit and at rest. Our platform is SOC 2 compliant and undergoes regular security audits. Your crew and project data is protected with the highest security standards.",
  },
  {
    question: "How long does it take to set up CrewSync?",
    answer: "Most teams are up and running within a day. Our onboarding team helps you import your existing crew data, set up your projects, and train your team. We provide comprehensive training materials and 24/7 support to ensure a smooth transition.",
  },
  {
    question: "What kind of support do you offer?",
    answer: "We offer 24/7 customer support via phone, email, and live chat. All plans include access to our knowledge base, video tutorials, and regular training webinars. Enterprise customers get a dedicated account manager.",
  },
  {
    question: "Can CrewSync integrate with our existing tools?",
    answer: "Yes! CrewSync integrates with popular construction management software, accounting systems, and payroll platforms. Our API also allows custom integrations to fit your specific workflow needs.",
  },
];

export function FAQSection() {
  return (
    <section id="faq" className="py-24">
      <div className="max-w-4xl mx-auto px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4" data-testid="text-faq-heading">
            Frequently Asked Questions
          </h2>
          <p className="text-xl text-muted-foreground" data-testid="text-faq-subheading">
            Everything you need to know about CrewSync
          </p>
        </div>

        <Accordion type="single" collapsible className="space-y-4">
          {faqs.map((faq, index) => (
            <AccordionItem
              key={index}
              value={`item-${index}`}
              className="border rounded-md px-6 bg-card"
              data-testid={`accordion-faq-${index}`}
            >
              <AccordionTrigger className="text-left font-semibold text-foreground hover:text-primary py-4" data-testid={`button-faq-${index}`}>
                {faq.question}
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground pb-4" data-testid={`text-faq-answer-${index}`}>
                {faq.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
}
