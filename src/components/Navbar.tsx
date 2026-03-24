import { useState } from "react";
import { Menu, X, Phone, User, Gauge, FileText, PhoneCall, MessageCircle, Wifi, Tv, Smartphone, Headphones } from "lucide-react";
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

  const subNavLinks = [
    { label: "Internet", href: "#planos", icon: Wifi },
    { label: "Móvel 5G", href: "#chip", icon: Smartphone },
    { label: "Combos", href: "#planos", icon: Tv },
    { label: "Autoatendimento", href: "#autoatendimento", icon: Headphones },
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-50">
      {/* Top bar - dark, sophisticated */}
      <div className="bg-[hsl(var(--navbar-bg))] border-b border-[hsl(var(--dark-section-border))]">
        <div className="container mx-auto px-4 flex items-center justify-between h-10 text-xs">
          <div className="flex items-center gap-6">
            <a href="tel:08005945678" className="flex items-center gap-1.5 text-[hsl(var(--navbar-fg))] hover:text-primary transition-colors">
              <Phone className="w-3 h-3 text-primary" />
              <span className="font-medium">0800 594 5678</span>
            </a>
            <span className="hidden md:inline text-[hsl(var(--dark-section-muted))]">|</span>
            <a href="https://www.speedtest.net/pt" target="_blank" rel="noopener noreferrer" className="hidden md:flex items-center gap-1.5 text-[hsl(var(--navbar-fg))] hover:text-primary transition-colors">
              <Gauge className="w-3 h-3 text-primary" />
              Teste de Velocidade
            </a>
            <a href="https://wa.me/558005945678" target="_blank" rel="noopener noreferrer" className="hidden md:flex items-center gap-1.5 text-[hsl(var(--navbar-fg))] hover:text-primary transition-colors">
              <FileText className="w-3 h-3 text-primary" />
              2ª Via da Fatura
            </a>
            <a href="https://wa.me/558005945678" target="_blank" rel="noopener noreferrer" className="hidden md:flex items-center gap-1.5 text-[hsl(var(--navbar-fg))] hover:text-primary transition-colors">
              <PhoneCall className="w-3 h-3 text-primary" />
              Ligamos para você
            </a>
          </div>
          <a
            href="https://wa.me/558005945678"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 bg-primary text-primary-foreground px-4 py-1.5 rounded-md text-xs font-bold hover:bg-primary/90 transition-colors"
          >
            <MessageCircle className="w-3.5 h-3.5" />
            Fale via Whatsapp
          </a>
        </div>
      </div>

      {/* Main nav */}
      <div className="bg-background border-b border-border">
        <div className="container mx-auto px-4 flex items-center justify-between h-16 md:h-[68px]">
          <a href="#inicio" className="shrink-0">
            <img src={logo} alt="JD Telecom" className="h-10 md:h-12 w-auto" />
          </a>

          <div className="hidden md:flex items-center gap-7">
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
            <Button variant="outline" size="sm" className="border-primary text-primary hover:bg-primary hover:text-primary-foreground rounded-full px-5 text-xs font-bold" asChild>
              <a href="#planos">Assine já</a>
            </Button>
            <Button size="sm" className="bg-[hsl(var(--navbar-bg))] text-[hsl(var(--navbar-fg))] hover:bg-[hsl(var(--navbar-bg))]/90 rounded-full px-5 text-xs font-bold" asChild>
              <a href="/assinante">
                <User className="w-3.5 h-3.5 mr-1" />
                Área do Cliente
              </a>
            </Button>
          </div>

          <button className="md:hidden text-foreground" onClick={() => setIsOpen(!isOpen)}>
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Sub nav - categories */}
      <div className="hidden md:block bg-[hsl(var(--navbar-bg))] border-b border-[hsl(var(--dark-section-border))]">
        <div className="container mx-auto px-4 flex items-center justify-between h-10">
          <div className="flex items-center gap-8">
            {subNavLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                className="flex items-center gap-1.5 text-xs font-medium text-primary hover:text-primary/80 transition-colors"
              >
                <link.icon className="w-3.5 h-3.5" />
                {link.label}
              </a>
            ))}
          </div>
        </div>
      </div>

      {/* Mobile menu */}
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
          <div className="grid grid-cols-2 gap-2 mt-3 mb-3">
            {subNavLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                className="flex items-center gap-2 text-xs text-primary py-2"
                onClick={() => setIsOpen(false)}
              >
                <link.icon className="w-3.5 h-3.5" />
                {link.label}
              </a>
            ))}
          </div>
          <div className="flex flex-col gap-2">
            <Button variant="outline" size="sm" className="border-primary text-primary rounded-full">Assine já</Button>
            <Button size="sm" className="bg-primary text-primary-foreground rounded-full" asChild>
              <a href="/assinante">
                <User className="w-4 h-4 mr-1" /> Área do Cliente
              </a>
            </Button>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
