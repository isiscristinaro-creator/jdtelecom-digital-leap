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
    <section id="contato" className="py-24 md:py-32 bg-secondary relative overflow-hidden" ref={ref}>
      {/* Decorative orbs */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] rounded-full bg-primary/[0.04] blur-[100px] pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[300px] h-[300px] rounded-full bg-primary/[0.03] blur-[80px] pointer-events-none" />

      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          className="mb-14"
          initial={{ opacity: 0, y: 20 }}
          animate={isVisible ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
        >
          <h2 className="font-display text-2xl sm:text-4xl md:text-5xl lg:text-[3.5rem] font-bold text-foreground mb-4 leading-[1.1]">
            Fale <span className="text-gradient">conosco</span>
          </h2>
          <p className="text-muted-foreground text-lg md:text-xl">
            Estamos prontos para atender você.
          </p>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {items.map((item, i) => {
            const Wrapper = item.isLink ? "a" : "div";
            return (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 25 }}
                animate={isVisible ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, delay: i * 0.1 + 0.2 }}
                whileHover={{ y: -6 }}
              >
                <Wrapper
                  {...(item.isLink ? { href: item.href, ...(item.external ? { target: "_blank", rel: "noopener noreferrer" } : {}) } : {})}
                  className="flex items-center gap-4 p-6 rounded-2xl bg-background border border-border/60 hover:border-primary/40 transition-all duration-500 shadow-card hover:shadow-elevated group h-full relative overflow-hidden"
                >
                  {/* Hover glow */}
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/[0.03] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary/15 to-primary/5 flex items-center justify-center shrink-0 group-hover:from-primary/25 group-hover:to-primary/10 transition-all duration-500 relative z-10">
                    <item.icon className="w-6 h-6 text-primary" />
                  </div>
                  <div className="min-w-0 relative z-10">
                    <p className="font-display font-bold text-foreground text-base">{item.title}</p>
                    <p className="text-sm text-muted-foreground break-words whitespace-pre-line mt-0.5">{item.sub}</p>
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
