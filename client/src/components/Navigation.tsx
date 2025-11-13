import { useState } from "react";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "./ThemeToggle";
import logoImage from "@assets/image_1762998239376.png";

export function Navigation() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = [
    { label: "About Us", href: "#about" },
    { label: "Solutions", href: "#solutions" },
    { label: "FAQ", href: "#faq" },
    { label: "Contact Us", href: "#contact" },
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-sm border-b">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          <div className="flex items-center">
            <img
              src={logoImage}
              alt="CrewSync Logo"
              className="h-12"
              data-testid="img-logo"
            />
          </div>

          <div className="hidden md:flex items-center gap-8">
            {navItems.map((item) => (
              <a
                key={item.label}
                href={item.href}
                className="text-[0.9375rem] font-medium text-foreground hover:text-primary transition-colors relative group"
                data-testid={`link-nav-${item.label.toLowerCase().replace(/\s+/g, '-')}`}
              >
                {item.label}
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-primary transition-all group-hover:w-full" />
              </a>
            ))}
          </div>

          <div className="hidden md:flex items-center gap-4">
            <ThemeToggle />
            <Button
              variant="outline"
              className="border-2 border-primary text-primary font-semibold"
              data-testid="button-login"
            >
              Log In
            </Button>
            <Button
              className="bg-accent text-accent-foreground font-semibold shadow-md hover:shadow-lg"
              data-testid="button-signup"
            >
              Sign up for Free Trial
            </Button>
          </div>

          <div className="md:hidden flex items-center gap-2">
            <ThemeToggle />
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              data-testid="button-mobile-menu"
            >
              {mobileMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </Button>
          </div>
        </div>
      </div>

      {mobileMenuOpen && (
        <div className="md:hidden bg-background border-t">
          <div className="px-6 py-4 space-y-3">
            {navItems.map((item) => (
              <a
                key={item.label}
                href={item.href}
                className="block py-3 text-base font-medium text-foreground hover:text-primary"
                data-testid={`link-mobile-${item.label.toLowerCase().replace(/\s+/g, '-')}`}
                onClick={() => setMobileMenuOpen(false)}
              >
                {item.label}
              </a>
            ))}
            <div className="pt-4 space-y-3">
              <Button
                variant="outline"
                className="w-full border-2 border-primary text-primary font-semibold"
                data-testid="button-mobile-login"
              >
                Log In
              </Button>
              <Button
                className="w-full bg-accent text-accent-foreground font-semibold"
                data-testid="button-mobile-signup"
              >
                Sign up for Free Trial
              </Button>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
