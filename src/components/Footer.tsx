import { Phone, Mail, MapPin } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import { useCallback } from "react";
import logo from "@/assets/logo.png";

const Footer = () => {
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
  }, [location.pathname, navigate]);

  const links = [
    { label: "Início", href: "#inicio" },
    { label: "Planos", href: "#planos" },
    { label: "Benefícios", href: "#beneficios" },
    { label: "Cobertura", href: "#cobertura" },
    { label: "Autoatendimento", href: "#autoatendimento" },
    { label: "Contato", href: "#contato" },
  ];

  const serviceLinks = [
    { label: "Internet Fibra Óptica", href: "#planos" },
    { label: "Móvel 4G/5G", href: "#chip" },
    { label: "Telefonia Fixa", href: "#planos" },
    { label: "TV por Assinatura", href: "#planos" },
  ];

  return (
    <footer className="bg-dark-section py-20 relative overflow-hidden">
      {/* Subtle top glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[2px] bg-gradient-to-r from-transparent via-primary/30 to-transparent" />

      <div className="container mx-auto px-4 relative z-10">
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-12">
          <div className="space-y-5">
            <img src={logo} alt="JD Telecom" className="h-12 w-auto brightness-0 invert" />
            <p className="text-sm text-[hsl(var(--dark-section-muted))] leading-relaxed">
              Internet fibra óptica de alta velocidade para a região Norte do Brasil. Conectando famílias e empresas com excelência.
            </p>
          </div>

          <div className="space-y-5">
            <h4 className="font-display font-bold text-[hsl(var(--dark-section-fg))] text-base">Links Rápidos</h4>
            <ul className="space-y-3">
              {links.map((l) => (
                <li key={l.label}>
                  <a href={l.href} onClick={(e) => handleAnchorClick(e, l.href)} className="text-sm text-[hsl(var(--dark-section-muted))] hover:text-primary transition-colors duration-300">
                    {l.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div className="space-y-5">
            <h4 className="font-display font-bold text-[hsl(var(--dark-section-fg))] text-base">Contato</h4>
            <ul className="space-y-4">
              <li>
                <a href="tel:08005945678" className="flex items-center gap-3 text-sm text-[hsl(var(--dark-section-muted))] hover:text-primary transition-colors duration-300">
                  <div className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                    <Phone className="w-4 h-4 text-primary" />
                  </div>
                  0800 594 5678
                </a>
              </li>
              <li>
                <a href="mailto:corporativo@grupojdtelecom.com.br" className="flex items-center gap-3 text-sm text-[hsl(var(--dark-section-muted))] hover:text-primary transition-colors duration-300">
                  <div className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                    <Mail className="w-4 h-4 text-primary" />
                  </div>
                  corporativo@grupojdtelecom.com.br
                </a>
              </li>
              <li className="flex items-center gap-3 text-sm text-[hsl(var(--dark-section-muted))]">
                <div className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                  <MapPin className="w-4 h-4 text-primary" />
                </div>
                Manaus - AM
              </li>
            </ul>
          </div>

          <div className="space-y-5">
            <h4 className="font-display font-bold text-[hsl(var(--dark-section-fg))] text-base">Serviços</h4>
            <ul className="space-y-3 text-sm text-[hsl(var(--dark-section-muted))]">
              {serviceLinks.map((l) => (
                <li key={l.label}>
                  <a href={l.href} onClick={(e) => handleAnchorClick(e, l.href)} className="hover:text-primary transition-colors duration-300">
                    {l.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="border-t border-[hsl(var(--dark-section-border))] mt-14 pt-8 text-center">
          <p className="text-sm text-[hsl(var(--dark-section-muted))]">
            © {new Date().getFullYear()} JD Telecom. Todos os direitos reservados. Grupo JD Telecom
          </p>
          <p className="text-xs text-[hsl(var(--dark-section-muted))]/60 mt-2">
            Desenvolvido por <span className="font-semibold text-[hsl(var(--dark-section-muted))]">SANNINS MARKETING LTDA</span>
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;