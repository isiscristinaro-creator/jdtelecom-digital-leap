import { Phone, Mail, MapPin } from "lucide-react";
import logo from "@/assets/logo.png";

const Footer = () => {
  return (
    <footer className="bg-dark-section py-16">
      <div className="container mx-auto px-4">
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-10">
          <div className="space-y-4">
            <img src={logo} alt="JD Telecom" className="h-10 w-auto brightness-0 invert" />
            <p className="text-sm text-[hsl(var(--dark-section-muted))]">
              Internet fibra óptica de alta velocidade para a região Norte do Brasil. Conectando famílias e empresas com excelência.
            </p>
          </div>

          <div className="space-y-4">
            <h4 className="font-display font-semibold text-[hsl(var(--dark-section-fg))]">Links Rápidos</h4>
            <ul className="space-y-2">
              {[
                { label: "Início", href: "#inicio" },
                { label: "Planos", href: "#planos" },
                { label: "Benefícios", href: "#beneficios" },
                { label: "Cobertura", href: "#cobertura" },
                { label: "Autoatendimento", href: "#autoatendimento" },
                { label: "Contato", href: "#contato" },
              ].map((l) => (
                <li key={l.label}>
                  <a href={l.href} className="text-sm text-[hsl(var(--dark-section-muted))] hover:text-primary transition-colors">
                    {l.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div className="space-y-4">
            <h4 className="font-display font-semibold text-[hsl(var(--dark-section-fg))]">Contato</h4>
            <ul className="space-y-3">
              <li className="flex items-center gap-2 text-sm text-[hsl(var(--dark-section-muted))]">
                <Phone className="w-4 h-4 text-primary" />
                0800 594 5678
              </li>
              <li className="flex items-center gap-2 text-sm text-[hsl(var(--dark-section-muted))]">
                <Mail className="w-4 h-4 text-primary" />
                corporativo@grupojdtelecom.com.br
              </li>
              <li className="flex items-start gap-2 text-sm text-[hsl(var(--dark-section-muted))]">
                <MapPin className="w-4 h-4 text-primary mt-0.5" />
                Manaus - AM
              </li>
            </ul>
          </div>

          <div className="space-y-4">
            <h4 className="font-display font-semibold text-[hsl(var(--dark-section-fg))]">Serviços</h4>
            <ul className="space-y-2 text-sm text-[hsl(var(--dark-section-muted))]">
              <li>Internet Fibra Óptica</li>
              <li>Móvel 4G/5G</li>
              <li>Telefonia Fixa</li>
              <li>TV por Assinatura</li>
            </ul>
          </div>
        </div>

        <div className="border-t border-[hsl(var(--dark-section-border))] mt-12 pt-8 text-center">
          <p className="text-sm text-[hsl(var(--dark-section-muted))]">
            © {new Date().getFullYear()} JD Telecom. Todos os direitos reservados. Grupo JD Telecom
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
