import { Button } from "@/components/ui/button";

const subjects = [
  "Product Question",
  "I want to try the product",
  "I need support",
  "Other",
];

export function ContactSection() {
  return (
    <section
      id="contact"
      className="py-24 px-6 lg:px-8 bg-muted/20 border-t"
      aria-labelledby="contact-heading"
    >
      <div className="max-w-6xl mx-auto grid gap-12 lg:grid-cols-[1fr,1.1fr] items-start">
        <div className="space-y-6">
          <p className="text-sm uppercase tracking-[0.2em] text-primary font-semibold">
            Contact Us
          </p>
          <h2
            id="contact-heading"
            className="text-4xl md:text-5xl font-bold text-foreground"
            data-testid="text-contact-heading"
          >
            Let&apos;s get you the answers you need.
          </h2>
          <p className="text-lg text-muted-foreground leading-relaxed max-w-xl">
            Tell us a bit about you and what you need. We&apos;ll reach out fast
            with clear next steps so you can keep moving.
          </p>
          <div className="grid gap-3 text-muted-foreground">
            <div className="flex items-center gap-3">
              <span className="h-10 w-10 rounded-full bg-primary/10 text-primary flex items-center justify-center font-semibold">
                1
              </span>
              <div>
                <p className="font-semibold text-foreground">Share the basics</p>
                <p className="text-sm">Tell us who you are and how to reach you.</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <span className="h-10 w-10 rounded-full bg-primary/10 text-primary flex items-center justify-center font-semibold">
                2
              </span>
              <div>
                <p className="font-semibold text-foreground">Pick your topic</p>
                <p className="text-sm">Choose what you need help with right now.</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <span className="h-10 w-10 rounded-full bg-primary/10 text-primary flex items-center justify-center font-semibold">
                3
              </span>
              <div>
                <p className="font-semibold text-foreground">Get a quick reply</p>
                <p className="text-sm">We follow up promptly with the answers.</p>
              </div>
            </div>
          </div>
        </div>

        <form
          className="bg-card border rounded-2xl shadow-md p-8 space-y-6"
          onSubmit={(event) => event.preventDefault()}
          data-testid="form-contact"
        >
          <div className="grid gap-2">
            <label htmlFor="contact-name" className="text-sm font-medium text-foreground">
              Name
            </label>
            <input
              id="contact-name"
              name="name"
              required
              className="w-full rounded-lg border bg-background px-4 py-3 text-foreground focus:outline-none focus:ring-2 focus:ring-primary/70 focus:border-primary/70"
              placeholder="Jane Smith"
            />
          </div>

          <div className="grid gap-2">
            <label htmlFor="contact-business" className="text-sm font-medium text-foreground">
              Business Name
            </label>
            <input
              id="contact-business"
              name="business"
              required
              className="w-full rounded-lg border bg-background px-4 py-3 text-foreground focus:outline-none focus:ring-2 focus:ring-primary/70 focus:border-primary/70"
              placeholder="Acme Services"
            />
          </div>

          <div className="grid gap-2">
            <label htmlFor="contact-phone" className="text-sm font-medium text-foreground">
              Phone Number <span className="text-muted-foreground">(optional)</span>
            </label>
            <input
              id="contact-phone"
              name="phone"
              type="tel"
              className="w-full rounded-lg border bg-background px-4 py-3 text-foreground focus:outline-none focus:ring-2 focus:ring-primary/70 focus:border-primary/70"
              placeholder="(555) 123-4567"
            />
          </div>

          <div className="grid gap-2">
            <label htmlFor="contact-subject" className="text-sm font-medium text-foreground">
              Subject
            </label>
            <select
              id="contact-subject"
              name="subject"
              required
              className="w-full rounded-lg border bg-background px-4 py-3 text-foreground focus:outline-none focus:ring-2 focus:ring-primary/70 focus:border-primary/70"
              defaultValue=""
            >
              <option value="" disabled>
                Select an option
              </option>
              {subjects.map((subject) => (
                <option key={subject} value={subject}>
                  {subject}
                </option>
              ))}
            </select>
          </div>

          <div className="grid gap-2">
            <label htmlFor="contact-message" className="text-sm font-medium text-foreground">
              How can we help?
            </label>
            <textarea
              id="contact-message"
              name="message"
              required
              rows={4}
              className="w-full rounded-lg border bg-background px-4 py-3 text-foreground focus:outline-none focus:ring-2 focus:ring-primary/70 focus:border-primary/70"
              placeholder="Share your question or what you want to accomplish."
            />
          </div>

          <Button
            type="submit"
            className="w-full bg-accent text-accent-foreground font-semibold text-lg py-6 shadow-lg hover:shadow-xl"
            data-testid="button-contact-submit"
          >
            Submit
          </Button>
        </form>
      </div>
    </section>
  );
}
