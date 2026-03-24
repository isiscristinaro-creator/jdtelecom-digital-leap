import { useState } from "react";
import { Menu, X, Phone, ChevronDown, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import logo from "@/assets/logo.png";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  const navLinks = [
    { label: "Início", href: "#inicio" },
    { label: "Planos", href: "#planos" },
    { label: "Benefícios", href: "#beneficios" },
    { label: "Cobertura", href: "#cobertura" },
    { label: "Contato", href: "#contato" },
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-50">
      {/* Top bar */}
      <div className="bg-[hsl(var(--navbar-bg))] text-[hsl(var(--navbar-fg))]">
        <div className="container mx-auto px-4 flex items-center justify-between h-10 text-xs">
          <div className="flex items-center gap-2">
            <Phone className="w-3 h-3 text-primary" />
            <a href="tel:08005945678" className="hover:text-primary transition-colors">0800 594 5678</a>
          </div>
          <div className="hidden md:flex items-center gap-6">
            <span className="text-[hsl(var(--dark-section-muted))]">Móvel • Fixo • Fibra • TV</span>
          </div>
        </div>
      </div>

      {/* Main nav */}
      <div className="bg-background/95 backdrop-blur-md border-b border-border">
        <div className="container mx-auto px-4 flex items-center justify-between h-16 md:h-20">
          <a href="#inicio" className="shrink-0">
            <img src={logo} alt="JD Telecom" className="h-10 md:h-14 w-auto" />
          </a>

          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="text-sm font-medium text-foreground hover:text-primary transition-colors"
              >
                {link.label}
              </a>
            ))}
          </div>

          <div className="hidden md:flex items-center gap-3">
            <Button variant="outline" size="sm" className="border-primary text-primary hover:bg-primary hover:text-primary-foreground">
              Assine já
            </Button>
            <Button size="sm" className="bg-primary text-primary-foreground hover:bg-primary/90">
              <User className="w-4 h-4 mr-1" />
              Área do Cliente
            </Button>
          </div>

          <button
            className="md:hidden text-foreground"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {isOpen && (
        <div className="md:hidden bg-background border-b border-border px-4 pb-4">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="block py-3 text-sm font-medium text-foreground hover:text-primary transition-colors"
              onClick={() => setIsOpen(false)}
            >
              {link.label}
            </a>
          ))}
          <div className="flex flex-col gap-2 mt-3">
            <Button variant="outline" size="sm" className="border-primary text-primary">
              Assine já
            </Button>
            <Button size="sm" className="bg-primary text-primary-foreground">
              <User className="w-4 h-4 mr-1" />
              Área do Cliente
            </Button>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
