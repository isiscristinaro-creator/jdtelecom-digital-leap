import { useState, useCallback, useRef, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Menu, X, Phone, User, Gauge, FileText, PhoneCall, MessageCircle, Wifi, Tv, Smartphone, Headphones, MapPin, ChevronDown, ChevronUp, Globe, Signal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCity } from "@/contexts/CityContext";
import logo from "@/assets/logo.png";
import badgeGooglePlay from "@/assets/badge-google-play.png";
import badgeAppStore from "@/assets/badge-app-store.png";

const ClientDropdown = ({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) => {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) onClose();
    };
    if (isOpen) document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div ref={ref} className="absolute right-0 top-full mt-1 w-[720px] bg-[hsl(var(--navbar-bg))] border border-[hsl(var(--dark-section-border))] rounded-xl shadow-2xl z-50 overflow-hidden animate-fade-in">
      {/* Top section - two app cards */}
      <div className="grid grid-cols-2 divide-x divide-[hsl(var(--dark-section-border))]">
        {/* JD Fibra */}
        <div className="p-7">
          <div className="flex items-center gap-2.5 mb-3">
            <div className="w-9 h-9 rounded-lg bg-primary/15 flex items-center justify-center">
              <Wifi className="w-5 h-5 text-primary" />
            </div>
            <h3 className="font-bold text-[hsl(var(--navbar-fg))] text-base">JD Fibra</h3>
          </div>
          <p className="text-sm text-[hsl(var(--navbar-fg))]/70 mb-5 leading-relaxed">
            Pelo app você tem acesso às suas faturas, informações do seu plano e muito mais.
          </p>
          <p className="text-xs font-bold text-[hsl(var(--navbar-fg))] mb-3 tracking-wide">Baixe o App JD Fibra</p>
          <div className="flex gap-3 mb-5">
            <a href="#" className="block hover:opacity-80 transition-opacity rounded-lg border-2 border-primary overflow-hidden">
              <img src={badgeGooglePlay} alt="Disponível no Google Play" className="h-10 w-auto" />
            </a>
            <a href="#" className="block hover:opacity-80 transition-opacity rounded-lg border-2 border-primary overflow-hidden">
              <img src={badgeAppStore} alt="Baixar na App Store" className="h-10 w-auto" />
            </a>
          </div>
          <p className="text-xs text-[hsl(var(--navbar-fg))]/60 mb-2.5">Ou acesse nosso portal Web</p>
          <a href="/assinante" className="flex items-center justify-center gap-2 border border-primary/40 text-primary rounded-lg py-2.5 text-sm font-semibold hover:bg-primary/10 transition-colors">
            <Globe className="w-4 h-4" />
            JD Fibra
          </a>
        </div>

        {/* JD Móvel */}
        <div className="p-7">
          <div className="flex items-center gap-2.5 mb-3">
            <div className="w-9 h-9 rounded-lg bg-primary/15 flex items-center justify-center">
              <Smartphone className="w-5 h-5 text-primary" />
            </div>
            <h3 className="font-bold text-[hsl(var(--navbar-fg))] text-base">JD Móvel</h3>
          </div>
          <p className="text-sm text-[hsl(var(--navbar-fg))]/70 mb-5 leading-relaxed">
            Pelo app você tem acesso ao consumo da sua franquia, faturas e muito mais.
          </p>
          <p className="text-xs font-bold text-[hsl(var(--navbar-fg))] mb-3 tracking-wide">Baixe o App JD Móvel</p>
          <div className="flex gap-3 mb-5">
            <a href="#" className="block hover:opacity-80 transition-opacity rounded-lg border-2 border-primary overflow-hidden">
              <img src={badgeGooglePlay} alt="Disponível no Google Play" className="h-10 w-auto" />
            </a>
            <a href="#" className="block hover:opacity-80 transition-opacity rounded-lg border-2 border-primary overflow-hidden">
              <img src={badgeAppStore} alt="Baixar na App Store" className="h-10 w-auto" />
            </a>
          </div>
          <p className="text-xs text-[hsl(var(--navbar-fg))]/60 mb-2.5">Ou acesse nosso portal Web</p>
          <a href="/assinante" className="flex items-center justify-center gap-2 border border-primary/40 text-primary rounded-lg py-2.5 text-sm font-semibold hover:bg-primary/10 transition-colors">
            <Globe className="w-4 h-4" />
            JD Móvel
          </a>
        </div>
      </div>

      {/* Bottom section - quick links */}
      <div className="border-t border-[hsl(var(--dark-section-border))] bg-[hsl(var(--navbar-bg))]/80 px-7 py-5">
        <div className="grid grid-cols-3 gap-6 text-xs">
          <div>
            <p className="font-bold text-[hsl(var(--navbar-fg))] uppercase tracking-wider mb-2.5">Fibra</p>
            <a href="/assinante" className="block text-[hsl(var(--navbar-fg))]/60 hover:text-primary transition-colors py-1">JD Fibra</a>
            <a href="#autoatendimento" className="block text-[hsl(var(--navbar-fg))]/60 hover:text-primary transition-colors py-1">2ª via da fatura</a>
          </div>
          <div>
            <p className="font-bold text-[hsl(var(--navbar-fg))] uppercase tracking-wider mb-2.5">JD Móvel 4G|5G</p>
            <a href="/assinante" className="block text-[hsl(var(--navbar-fg))]/60 hover:text-primary transition-colors py-1">JD Móvel</a>
            <a href="#autoatendimento" className="block text-[hsl(var(--navbar-fg))]/60 hover:text-primary transition-colors py-1">2ª via da fatura</a>
          </div>
          <div>
            <p className="font-bold text-[hsl(var(--navbar-fg))] uppercase tracking-wider mb-2.5">Guias e Suporte</p>
            <a href="#autoatendimento" className="block text-[hsl(var(--navbar-fg))]/60 hover:text-primary transition-colors py-1">Guia do cliente</a>
            <a href="#contato" className="block text-[hsl(var(--navbar-fg))]/60 hover:text-primary transition-colors py-1">Central de atendimento</a>
          </div>
        </div>
      </div>
    </div>
  );
};
const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [clientDropdownOpen, setClientDropdownOpen] = useState(false);
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
    setClientDropdownOpen(false);
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
    { label: "Internet", href: "/fibra", icon: Wifi, isRoute: true },
    { label: "FWA 5G", href: "/fwa-5g", icon: Signal, isRoute: true },
    { label: "Móvel 5G", href: "/movel", icon: Smartphone, isRoute: true },
    { label: "Combos", href: "/combos", icon: Tv, isRoute: true },
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

      {/* Main nav */}
      <div className="bg-background border-b border-border">
        <div className="container mx-auto px-4 flex items-center h-16 md:h-[68px]">
          <a href="/" className="shrink-0" onClick={handleLogoClick}>
            <img src={logo} alt="JD Telecom" className="h-10 md:h-12 w-auto" />
          </a>

          <div className="hidden md:flex items-center gap-6 lg:gap-8 flex-1 justify-center">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={(e) => handleAnchorClick(e, link.href)}
                className="relative text-sm font-medium text-foreground hover:text-primary transition-colors whitespace-nowrap after:content-[''] after:absolute after:w-full after:scale-x-0 after:h-0.5 after:bottom-[-4px] after:left-0 after:bg-primary after:origin-bottom-right after:transition-transform after:duration-300 hover:after:scale-x-100 hover:after:origin-bottom-left"
              >
                {link.label}
              </a>
            ))}
          </div>

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

            {/* Área do cliente with dropdown */}
            <div className="relative">
              <button
                onClick={() => setClientDropdownOpen(!clientDropdownOpen)}
                className="flex items-center gap-1.5 text-sm font-semibold text-foreground hover:text-primary transition-colors px-3 py-2 whitespace-nowrap"
              >
                Área do cliente
                {clientDropdownOpen ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
              </button>
              <ClientDropdown isOpen={clientDropdownOpen} onClose={() => setClientDropdownOpen(false)} />
            </div>
          </div>

          <button className="md:hidden text-foreground ml-auto" onClick={() => setIsOpen(!isOpen)}>
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Sub nav */}
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
