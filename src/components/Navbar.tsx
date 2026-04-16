import { useState, useCallback } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Menu, X, Phone, User, Gauge, FileText, PhoneCall, MessageCircle, Wifi, Tv, Smartphone, Headphones, MapPin, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCity } from "@/contexts/CityContext";
import logo from "@/assets/logo.png";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const handleAnchorClick = useCallback((e: React.MouseEvent<HTMLAnchorElement>, hash: string) => {
    e.preventDefault();
    if (location.pathname !== "/") {
      navigate("/" + hash);
    } else {
      const el = document.querySelector(hash);
      if (el) el.scrollIntoView({ behavior: "smooth" });
    }
    setIsOpen(false);
  }, [location.pathname, navigate]);

  const handleLogoClick = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    if (location.pathname === "/") {
      window.scrollTo({ top: 0, behavior: "smooth" });
    } else {
      navigate("/");
    }
  }, [location.pathname, navigate]);

  const navLinks = [
    { label: "Início", href: "#inicio" },
    { label: "Empresa", href: "#beneficios" },
    { label: "Planos", href: "#planos" },
    { label: "Cobertura", href: "#cobertura" },
    { label: "Contato", href: "#contato" },
  ];

  const subNavLinks = [
    { label: "Internet", href: "#planos", icon: Wifi },
    { label: "Móvel 5G", href: "/movel", icon: Smartphone, isRoute: true },
    { label: "Combos", href: "#planos", icon: Tv },
    { label: "Autoatendimento", href: "#autoatendimento", icon: Headphones },
  ];

  const { selectedCity, setShowCityModal } = useCity();

  return (
    <nav className="fixed top-0 left-0 right-0 z-50">
      {/* Top bar */}
      <div className="bg-[hsl(var(--navbar-bg))] border-b border-[hsl(var(--dark-section-border))]">
        <div className="container mx-auto px-4 py-2 md:py-0 md:h-10 text-sm md:text-xs">
          <div className="flex items-center justify-between gap-2 md:gap-0">
            <div className="flex items-center gap-3 md:gap-6 min-w-0 flex-1 flex-wrap sm:flex-nowrap">
              <button
                onClick={() => setShowCityModal(true)}
                className="flex min-w-0 max-w-[58vw] sm:max-w-none items-center gap-1 md:gap-1.5 text-primary hover:text-primary/80 transition-colors font-medium shrink-0"
              >
                <MapPin className="w-3.5 h-3.5" />
                <span className="hidden sm:inline truncate">{selectedCity ? `${selectedCity.name} ${selectedCity.state}` : "Selecione sua cidade"}</span>
                <span className="sm:hidden truncate">{selectedCity ? selectedCity.name : "Cidade"}</span>
              </button>
              <a href="tel:08005945678" className="hidden sm:flex items-center gap-1 text-[hsl(var(--navbar-fg))] hover:text-primary transition-colors shrink-0">
                <Phone className="w-3 h-3 text-primary" />
                <span className="font-medium">0800 594 5678</span>
              </a>
              <a href="https://www.speedtest.net/pt" target="_blank" rel="noopener noreferrer" className="hidden md:flex items-center gap-1.5 text-[hsl(var(--navbar-fg))] hover:text-primary transition-colors">
                <Gauge className="w-3 h-3 text-primary" />
                Teste de Velocidade
              </a>
              <a href="#autoatendimento" onClick={(e) => handleAnchorClick(e, "#autoatendimento")} className="hidden md:flex items-center gap-1.5 text-[hsl(var(--navbar-fg))] hover:text-primary transition-colors">
                <FileText className="w-3 h-3 text-primary" />
                2ª Via da Fatura
              </a>
              <a href="#contato" onClick={(e) => handleAnchorClick(e, "#contato")} className="hidden md:flex items-center gap-1.5 text-[hsl(var(--navbar-fg))] hover:text-primary transition-colors">
                <PhoneCall className="w-3 h-3 text-primary" />
                Ligamos para você
              </a>
            </div>
            <a
              href="https://wa.me/558005945678"
              target="_blank"
              rel="noopener noreferrer"
              className="w-auto flex items-center justify-center gap-1.5 bg-primary text-primary-foreground px-3 sm:px-4 py-2 md:py-1.5 rounded-md text-[11px] sm:text-xs font-bold hover:bg-primary/90 transition-colors shrink-0 whitespace-nowrap"
            >
              <MessageCircle className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Fale via WhatsApp</span>
              <span className="sm:hidden">WhatsApp</span>
            </a>
          </div>
        </div>
      </div>

      {/* Main nav - centered & distributed like Brisanet */}
      <div className="bg-background border-b border-border">
        <div className="container mx-auto px-4 flex items-center h-16 md:h-[68px]">
          {/* Logo */}
          <a href="/" className="shrink-0" onClick={handleLogoClick}>
            <img src={logo} alt="JD Telecom" className="h-10 md:h-12 w-auto" />
          </a>

          {/* Center nav links - distributed */}
          <div className="hidden md:flex items-center gap-6 lg:gap-8 flex-1 justify-center">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={(e) => handleAnchorClick(e, link.href)}
                className="text-sm font-medium text-foreground hover:text-primary transition-colors whitespace-nowrap"
              >
                {link.label}
              </a>
            ))}
          </div>

          {/* Right actions with separator */}
          <div className="hidden md:flex items-center gap-1 shrink-0">
            <div className="w-px h-7 bg-border mr-3" />
            <a
              href="#planos"
              onClick={(e) => handleAnchorClick(e, "#planos")}
              className="flex items-center gap-1 text-sm font-semibold text-primary hover:text-primary/80 transition-colors px-3 py-2 whitespace-nowrap"
            >
              Assine já
              <ChevronDown className="w-3.5 h-3.5" />
            </a>
            <a
              href="/assinante"
              className="flex items-center gap-1.5 text-sm font-semibold text-foreground hover:text-primary transition-colors px-3 py-2 whitespace-nowrap"
            >
              Área do cliente
              <ChevronDown className="w-3.5 h-3.5" />
            </a>
          </div>

          <button className="md:hidden text-foreground ml-auto" onClick={() => setIsOpen(!isOpen)}>
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Sub nav - categories */}
      <div className="hidden md:block bg-[hsl(var(--navbar-bg))] border-b border-[hsl(var(--dark-section-border))]">
        <div className="container mx-auto px-4 flex items-center justify-center h-10 gap-8">
          {subNavLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              onClick={(e) => {
                if ('isRoute' in link && link.isRoute) {
                  e.preventDefault();
                  navigate(link.href);
                } else {
                  handleAnchorClick(e, link.href);
                }
              }}
              className="flex items-center gap-1.5 text-xs font-medium text-primary hover:text-primary/80 transition-colors"
            >
              <link.icon className="w-3.5 h-3.5" />
              {link.label}
            </a>
          ))}
        </div>
      </div>

      {/* Mobile menu */}
      {isOpen && (
        <div className="md:hidden bg-background border-b border-border px-4 pb-4 shadow-lg max-h-[calc(100dvh-116px)] overflow-y-auto">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="block py-3 text-base font-medium text-foreground hover:text-primary transition-colors border-b border-border/50"
              onClick={(e) => handleAnchorClick(e, link.href)}
            >
              {link.label}
            </a>
          ))}
          <div className="grid grid-cols-1 gap-1 mt-3 mb-3">
            {subNavLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                className="flex items-center gap-2 text-sm text-primary py-2"
                onClick={(e) => {
                  if ('isRoute' in link && link.isRoute) {
                    e.preventDefault();
                    navigate(link.href);
                    setIsOpen(false);
                  } else {
                    handleAnchorClick(e, link.href);
                  }
                }}
              >
                <link.icon className="w-3.5 h-3.5" />
                {link.label}
              </a>
            ))}
          </div>
          <div className="flex flex-col gap-2">
            <Button variant="outline" size="sm" className="border-primary text-primary rounded-full h-11" asChild>
              <a href="#planos" onClick={(e) => handleAnchorClick(e, "#planos")}>Assine já</a>
            </Button>
            <Button size="sm" className="bg-primary text-primary-foreground rounded-full h-11" asChild>
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
