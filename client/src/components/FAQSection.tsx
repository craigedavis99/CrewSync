import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const faqs = [
  {
    question: "Is the trial really free?",
    answer: "100%.We don't even ask for your credit card up front like a lot of apps. We truly have a desire to make an app that fits into your workflow an helps you run your business.  We hope our small monthly cost will be a no brainer for you. If it doesn't fit or the value is not there. It would be awesome if you left us some feedback so we can improve",
  },
  {
    question: "Does this work on my phone",
    answer: "Absolutley!  You and your team are our working not chained to a desk. There are some one off side features that you may prefer to do at a desktop but this was built with mobility in mind.",
  },
  {
    question: "Is my data secure with CrewSync?",
    answer: "Absolutely. We use enterprise-grade encryption for all data in transit and at rest. Our platform is SOC 2 compliant and undergoes regular security audits.",
  },
  {
    question: "How long does it take to set up CrewSync?",
    answer: "It will take about a 5-10 minutes of your time with call, chat, or email reply then we do the rest. Up and running <24hrs",
  },
  {
    question: "What kind of support do you offer?",
    answer: "We offer 24/7 customer support via phone, email, and live chat. All plans include access to our knowledge base, video tutorials, ",
  },
  {
    question: "How does the phone answering work, I just use my cell phone?",
    answer: "Awesome, we will show you how to configure your phone to forward any messages you want to our system to create the to-dos and follow-ups.  Some customers might want a dedicated number and we can do that to. ",
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
