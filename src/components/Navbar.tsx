import { useState } from "react";
import { Menu, X, Phone, User, Gauge, FileText, PhoneCall, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import logo from "@/assets/logo.png";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  const navLinks = [
    { label: "Home", href: "#inicio" },
    { label: "Empresa", href: "#beneficios" },
    { label: "Planos", href: "#planos" },
    { label: "Cobertura", href: "#cobertura" },
    { label: "Contato", href: "#contato" },
  ];

  const quickLinks = [
    { icon: Gauge, label: "Teste de Velocidade", href: "https://wa.me/558005945678" },
    { icon: FileText, label: "2ª Via da Fatura", href: "https://wa.me/558005945678" },
    { icon: PhoneCall, label: "Ligamos para você", href: "https://wa.me/558005945678" },
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-50">
      {/* Top bar */}
      <div className="bg-[hsl(var(--navbar-bg))] text-[hsl(var(--navbar-fg))]">
        <div className="container mx-auto px-4 flex items-center justify-between h-10 text-xs">
          <div className="flex items-center gap-2">
            <Phone className="w-3 h-3 text-primary" />
            <a href="tel:08005945678" className="hover:text-primary transition-colors font-medium">0800 594 5678</a>
          </div>
          <div className="hidden md:flex items-center gap-1 text-[hsl(var(--dark-section-muted))]">
            <span>HOJE É UM BOM DIA PARA NAVEGAR NA INTERNET</span>
          </div>
        </div>
      </div>

      {/* Quick links bar */}
      <div className="hidden md:block bg-background border-b border-border">
        <div className="container mx-auto px-4 flex items-center justify-between h-12">
          <div className="flex items-center gap-8">
            {quickLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-xs font-medium text-primary hover:text-primary/80 transition-colors"
              >
                <link.icon className="w-4 h-4" />
                {link.label}
              </a>
            ))}
          </div>
          <a
            href="https://wa.me/558005945678"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2 rounded-lg text-xs font-bold hover:bg-primary/90 transition-colors"
          >
            <MessageCircle className="w-4 h-4" />
            Fale via Whatsapp
          </a>
        </div>
      </div>

      {/* Main nav */}
      <div className="bg-background/95 backdrop-blur-md border-b border-border shadow-sm">
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
            <Button variant="outline" size="sm" className="border-primary text-primary hover:bg-primary hover:text-primary-foreground rounded-full px-6">
              Assine já
            </Button>
            <Button size="sm" className="bg-[hsl(var(--navbar-bg))] text-[hsl(var(--navbar-fg))] hover:bg-[hsl(var(--navbar-bg))]/90 rounded-full px-6">
              <User className="w-4 h-4 mr-1" />
              Área do Cliente
            </Button>
          </div>

          <button className="md:hidden text-foreground" onClick={() => setIsOpen(!isOpen)}>
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {isOpen && (
        <div className="md:hidden bg-background border-b border-border px-4 pb-4 shadow-lg">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="block py-3 text-sm font-medium text-foreground hover:text-primary transition-colors border-b border-border/50"
              onClick={() => setIsOpen(false)}
            >
              {link.label}
            </a>
          ))}
          <div className="flex flex-col gap-2 mt-4">
            <Button variant="outline" size="sm" className="border-primary text-primary rounded-full">Assine já</Button>
            <Button size="sm" className="bg-primary text-primary-foreground rounded-full">
              <User className="w-4 h-4 mr-1" /> Área do Cliente
            </Button>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
