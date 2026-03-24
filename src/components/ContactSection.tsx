import { Phone, Mail, MessageCircle, Clock } from "lucide-react";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";

const ContactSection = () => {
  const { ref, isVisible } = useScrollAnimation();

  return (
    <section id="contato" className="py-20 md:py-28 bg-secondary" ref={ref}>
      <div className="container mx-auto px-4">
        <div
          className={`mb-12 transition-all duration-700 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
        >
          <h2 className="font-display text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-4">
            Fale <span className="text-primary">conosco</span>
          </h2>
          <p className="text-muted-foreground text-lg">
            Estamos prontos para atender você. Escolha o canal de sua preferência.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            { href: "tel:08005945678", icon: Phone, title: "0800 594 5678", sub: "Ligação gratuita", isLink: true },
            { href: "https://wa.me/558005945678", icon: MessageCircle, title: "WhatsApp", sub: "Atendimento rápido", isLink: true, external: true },
            { href: "mailto:corporativo@grupojdtelecom.com.br", icon: Mail, title: "corporativo@grupojdtelecom.com.br", sub: "E-mail corporativo", isLink: true, titleSmall: true },
            { href: "#", icon: Clock, title: "Horário", sub: "Seg a sáb, 8h–22h", isLink: false },
          ].map((item, i) => {
            const Wrapper = item.isLink ? "a" : "div";
            return (
              <Wrapper
                key={item.title}
                {...(item.isLink ? { href: item.href, ...(item.external ? { target: "_blank", rel: "noopener noreferrer" } : {}) } : {})}
                className={`flex items-center gap-4 p-6 rounded-xl bg-background border border-border hover:border-primary/40 transition-all duration-500 shadow-card group ${
                  isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
                }`}
                style={{ transitionDelay: isVisible ? `${i * 100 + 200}ms` : "0ms" }}
              >
                <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                  <item.icon className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <p className={`font-display font-semibold text-foreground ${item.titleSmall ? "text-sm" : ""}`}>{item.title}</p>
                  <p className="text-sm text-muted-foreground">{item.sub}</p>
                </div>
              </Wrapper>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default ContactSection;
