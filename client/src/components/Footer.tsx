import logoImage from "@/assets/crewsynch-logo.svg";

export function Footer() {
  const footerSections = [
    {
      title: "Company",
      links: [
        { label: "About Us", href: "#about" },
        { label: "Contact", href: "#contact" },
      ],
    },
    {
      title: "Product",
      links: [
        { label: "Solutions", href: "#solutions" },
        { label: "Pricing", href: "#pricing" },
      ],
    },
    {
      title: "Resources",
      links: [
        { label: "Help Center", href: "#help" },
        { label: "FAQ", href: "#faq" },
        { label: "Case Studies", href: "#case-studies" },
      ],
    },
    {
      title: "Legal",
      links: [
        { label: "Privacy Policy", href: "#privacy" },
        { label: "Terms of Service", href: "#terms" },
        { label: "Security", href: "#security" },
        { label: "Compliance", href: "#compliance" },
      ],
    },
  ];

  return (
    <footer className="bg-muted/30 border-t">
      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-16">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8 mb-12">
          <div className="col-span-2 md:col-span-1">
            <img
              src={logoImage}
              alt="CrewSynch Logo"
              className="h-10 mb-4"
              data-testid="img-footer-logo"
            />
          </div>

          {footerSections.map((section, index) => (
            <div key={index}>
              <h3 className="font-semibold text-foreground mb-4" data-testid={`text-footer-section-${index}`}>
                {section.title}
              </h3>
              <ul className="space-y-3">
                {section.links.map((link, linkIndex) => (
                  <li key={linkIndex}>
                    <a
                      href={link.href}
                      className="text-sm text-muted-foreground hover:text-primary transition-colors"
                      data-testid={`link-footer-${link.label.toLowerCase().replace(/\s+/g, '-')}`}
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="border-t pt-8">
          <p className="text-sm text-muted-foreground text-center" data-testid="text-copyright">
            © {new Date().getFullYear()} CrewSynch. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
