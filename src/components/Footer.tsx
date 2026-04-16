import { Phone, Mail, MapPin, Instagram, Facebook } from "lucide-react";
import { motion } from "framer-motion";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import { useNavigate, useLocation } from "react-router-dom";
import { useCallback } from "react";
import logo from "@/assets/logo.png";

const Footer = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { ref, isVisible } = useScrollAnimation(0.1);

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
    <footer className="bg-dark-section py-20 relative overflow-hidden" ref={ref} role="contentinfo" aria-label="Rodapé">
      {/* Subtle top glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[2px] bg-gradient-to-r from-transparent via-primary/30 to-transparent" />

      <div className="container mx-auto px-4 relative z-10">
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-12">
          <motion.div
            className="space-y-5"
            initial={{ opacity: 0, y: 20 }}
            animate={isVisible ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5 }}
          >
            <img src={logo} alt="JD Telecom" className="h-12 w-auto brightness-0 invert" />
            <p className="text-sm text-[hsl(var(--dark-section-muted))] leading-relaxed">
              Internet fibra óptica de alta velocidade para a região Norte do Brasil. Conectando famílias e empresas com excelência.
            </p>
          </motion.div>

          <motion.div
            className="space-y-5"
            initial={{ opacity: 0, y: 20 }}
            animate={isVisible ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
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
          </motion.div>

          <motion.div
            className="space-y-5"
            initial={{ opacity: 0, y: 20 }}
            animate={isVisible ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <h4 className="font-display font-bold text-[hsl(var(--dark-section-fg))] text-base">Contato</h4>
            <ul className="space-y-4">
              <li>
                <a href="tel:08005945678" className="flex items-start gap-3 text-sm text-[hsl(var(--dark-section-muted))] hover:text-primary transition-colors duration-300 min-w-0">
                  <div className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                    <Phone className="w-4 h-4 text-primary" />
                  </div>
                  <span>0800 594 5678</span>
                </a>
              </li>
              <li>
                <a href="mailto:corporativo@grupojdtelecom.com.br" className="flex items-start gap-3 text-sm text-[hsl(var(--dark-section-muted))] hover:text-primary transition-colors duration-300 min-w-0">
                  <div className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                    <Mail className="w-4 h-4 text-primary" />
                  </div>
                  <span className="break-all">corporativo@grupojdtelecom.com.br</span>
                </a>
              </li>
              <li className="flex items-start gap-3 text-sm text-[hsl(var(--dark-section-muted))] min-w-0">
                <div className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                  <MapPin className="w-4 h-4 text-primary" />
                </div>
                <span>Manaus - AM</span>
              </li>
            </ul>
          </motion.div>

          <motion.div
            className="space-y-5"
            initial={{ opacity: 0, y: 20 }}
            animate={isVisible ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
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
          </motion.div>
        </div>

        <motion.div
          className="border-t border-[hsl(var(--dark-section-border))] mt-14 pt-8 text-center"
          initial={{ opacity: 0 }}
          animate={isVisible ? { opacity: 1 } : {}}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <p className="text-sm text-[hsl(var(--dark-section-muted))]">
            © {new Date().getFullYear()} JD Telecom. Todos os direitos reservados. Grupo JD Telecom
          </p>
          <p className="text-xs text-[hsl(var(--dark-section-muted))]/60 mt-2">
            Desenvolvido por <span className="font-semibold text-[hsl(var(--dark-section-muted))]">SANNINS MARKETING LTDA</span>
          </p>
        </motion.div>
      </div>
    </footer>
  );
};

export default Footer;