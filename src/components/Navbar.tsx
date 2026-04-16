import { useState, useCallback } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Menu, X, User, ChevronDown, Wifi, Tv, Smartphone, Headphones } from "lucide-react";
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
      {/* Single main bar - Brisanet style */}
      <div className="bg-[hsl(var(--navbar-bg))]">
        <div className="container mx-auto px-4 flex items-center h-16 md:h-[72px]">
          {/* Logo */}
          <a href="/" className="shrink-0 mr-8 lg:mr-12" onClick={handleLogoClick}>
            <img src={logo} alt="JD Telecom" className="h-9 md:h-11 w-auto" />
          </a>

          {/* Center nav links */}
          <div className="hidden md:flex items-center gap-6 lg:gap-8 flex-1 justify-center">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={(e) => handleAnchorClick(e, link.href)}
                className="text-sm font-medium text-[hsl(var(--navbar-fg))] hover:text-primary transition-colors whitespace-nowrap"
              >
                {link.label}
              </a>
            ))}
          </div>

          {/* Right side - Separator + Actions */}
          <div className="hidden md:flex items-center gap-1 shrink-0">
            <div className="w-px h-8 bg-[hsl(var(--navbar-fg))]/20 mr-4" />

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
              className="flex items-center gap-1.5 text-sm font-semibold text-primary hover:text-primary/80 transition-colors px-3 py-2 whitespace-nowrap"
            >
              Área do cliente
              <ChevronDown className="w-3.5 h-3.5" />
            </a>
          </div>

          {/* Mobile toggle */}
          <button className="md:hidden text-[hsl(var(--navbar-fg))] ml-auto" onClick={() => setIsOpen(!isOpen)}>
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Sub nav - categories (desktop) */}
      <div className="hidden md:block bg-[hsl(var(--navbar-bg))]/90 backdrop-blur-sm border-t border-[hsl(var(--dark-section-border))]">
        <div className="container mx-auto px-4 flex items-center justify-center h-9 gap-8">
          {/* City selector */}
          <button
            onClick={() => setShowCityModal(true)}
            className="flex items-center gap-1.5 text-xs font-medium text-primary hover:text-primary/80 transition-colors"
          >
            📍
            <span>{selectedCity ? `${selectedCity.name} ${selectedCity.state}` : "Selecione sua cidade"}</span>
          </button>
          <div className="w-px h-4 bg-[hsl(var(--navbar-fg))]/15" />
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
              className="flex items-center gap-1.5 text-xs font-medium text-[hsl(var(--navbar-fg))]/80 hover:text-primary transition-colors"
            >
              <link.icon className="w-3.5 h-3.5" />
              {link.label}
            </a>
          ))}
        </div>
      </div>

      {/* Mobile menu */}
      {isOpen && (
        <div className="md:hidden bg-[hsl(var(--navbar-bg))] border-t border-[hsl(var(--dark-section-border))] px-4 pb-4 shadow-lg max-h-[calc(100dvh-64px)] overflow-y-auto">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="block py-3 text-base font-medium text-[hsl(var(--navbar-fg))] hover:text-primary transition-colors border-b border-[hsl(var(--dark-section-border))]/50"
              onClick={(e) => handleAnchorClick(e, link.href)}
            >
              {link.label}
            </a>
          ))}
          <div className="grid grid-cols-2 gap-2 mt-3 mb-3">
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
          <div className="flex flex-col gap-2 mt-2">
            <a
              href="#planos"
              onClick={(e) => handleAnchorClick(e, "#planos")}
              className="flex items-center justify-center gap-1 text-sm font-bold text-[hsl(var(--navbar-bg))] bg-primary rounded-lg h-11 hover:bg-primary/90 transition-colors"
            >
              Assine já
            </a>
            <a
              href="/assinante"
              className="flex items-center justify-center gap-1.5 text-sm font-bold text-primary border border-primary rounded-lg h-11 hover:bg-primary/10 transition-colors"
            >
              <User className="w-4 h-4" />
              Área do Cliente
            </a>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
