import { Phone, Mail, MessageCircle, Clock } from "lucide-react";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import { motion } from "framer-motion";

const items = [
  { href: "tel:08005945678", icon: Phone, title: "0800 594 5678", sub: "Ligação gratuita", isLink: true },
  { href: "https://wa.me/558005945678", icon: MessageCircle, title: "WhatsApp", sub: "Atendimento rápido", isLink: true, external: true },
  { href: "mailto:corporativo@grupojdtelecom.com.br", icon: Mail, title: "E-mail corporativo", sub: "corporativo@grupo\njdtelecom.com.br", isLink: true },
  { href: "#", icon: Clock, title: "Horário", sub: "Seg a sáb, 8h–22h", isLink: false },
];

const ContactSection = () => {
  const { ref, isVisible } = useScrollAnimation();

  return (
    <section id="contato" className="py-20 md:py-28 bg-secondary" ref={ref}>
      <div className="container mx-auto px-4">
        <motion.div
          className="mb-12"
          initial={{ opacity: 0, y: 20 }}
          animate={isVisible ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
        >
          <h2 className="font-display text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-4">
            Fale <span className="text-primary">conosco</span>
          </h2>
          <p className="text-muted-foreground text-lg">
            Estamos prontos para atender você.
          </p>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {items.map((item, i) => {
            const Wrapper = item.isLink ? "a" : "div";
            return (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 20 }}
                animate={isVisible ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.4, delay: i * 0.1 + 0.2 }}
                whileHover={{ y: -4 }}
              >
                <Wrapper
                  {...(item.isLink ? { href: item.href, ...(item.external ? { target: "_blank", rel: "noopener noreferrer" } : {}) } : {})}
                  className="flex items-center gap-4 p-5 rounded-2xl bg-background border border-border hover:border-primary/40 transition-all duration-300 shadow-card group h-full"
                >
                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center shrink-0 group-hover:bg-primary/20 transition-colors">
                    <item.icon className="w-5 h-5 text-primary" />
                  </div>
                  <div className="min-w-0">
                    <p className="font-display font-semibold text-foreground text-sm">{item.title}</p>
                    <p className="text-xs text-muted-foreground break-words whitespace-pre-line">{item.sub}</p>
                  </div>
                </Wrapper>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default ContactSection;
