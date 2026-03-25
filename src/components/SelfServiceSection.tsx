import { FileText, PhoneCall, Headphones, Monitor, MapPin, MessageSquare, ArrowRight } from "lucide-react";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import { motion } from "framer-motion";

const items = [
  { icon: FileText, title: "2ª via da fatura", desc: "Baixe sua fatura de forma rápida e prática", href: "/assinante" },
  { icon: PhoneCall, title: "Ligamos para você", desc: "Informe seus dados que entraremos em contato", href: "#contato" },
  { icon: Headphones, title: "Central de ajuda", desc: "Tudo que você precisa saber para tirar suas dúvidas", href: "#contato" },
  { icon: Monitor, title: "Suporte remoto", desc: "Realizamos o seu atendimento por acesso remoto", href: "#contato" },
  { icon: MapPin, title: "Nossas cidades", desc: "Verifique se há cobertura JD Telecom na sua cidade", href: "#cobertura" },
  { icon: MessageSquare, title: "Ouvidoria", desc: "Nossa central está pronta para te receber", href: "#contato" },
];

const SelfServiceSection = () => {
  const { ref, isVisible } = useScrollAnimation();

  return (
    <section id="autoatendimento" className="bg-dark-section py-24 md:py-32 relative overflow-hidden" ref={ref}>
      {/* Ambient light */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-primary/[0.04] blur-[100px] pointer-events-none" />

      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          animate={isVisible ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
        >
          <h2 className="font-display text-2xl sm:text-4xl md:text-5xl lg:text-[3.5rem] font-bold text-[hsl(var(--dark-section-fg))] mb-4">
            Autoatendimento para clientes
          </h2>
          <p className="text-[hsl(var(--dark-section-muted))] text-lg">
            Resolva tudo de forma rápida e prática
          </p>
        </motion.div>

        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 md:gap-6">
          {items.map((item, i) => (
            <motion.a
              key={item.title}
              href={item.href}
              className="group flex flex-col items-start text-left p-3 sm:p-5 rounded-2xl border border-[hsl(var(--dark-section-border))] bg-[hsl(var(--dark-section-card))]/50 hover:border-primary/30 hover:bg-[hsl(var(--dark-section-card))] transition-all duration-500 relative overflow-hidden"
              initial={{ opacity: 0, y: 20 }}
              animate={isVisible ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.4, delay: i * 0.08 + 0.2 }}
              whileHover={{ y: -6 }}
            >
              {/* Hover glow */}
              <div className="absolute inset-0 bg-gradient-to-b from-primary/[0.05] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-2xl bg-primary/10 flex items-center justify-center mb-3 sm:mb-4 group-hover:bg-primary/20 transition-colors duration-500 relative z-10">
                <item.icon className="w-4 h-4 sm:w-5 sm:h-5 text-[hsl(var(--dark-section-fg))] group-hover:text-primary transition-colors duration-300" />
              </div>
              <h3 className="font-display font-semibold text-[hsl(var(--dark-section-fg))] text-xs sm:text-sm mb-1 sm:mb-2 leading-snug relative z-10">{item.title}</h3>
              <p className="text-[10px] sm:text-xs text-[hsl(var(--dark-section-muted))] mb-3 sm:mb-4 leading-relaxed flex-1 relative z-10 hidden sm:block">{item.desc}</p>
              <div className="flex items-center gap-1 text-primary text-xs font-medium relative z-10">
                <span className="opacity-0 group-hover:opacity-100 transition-opacity duration-300">Acessar</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </div>
            </motion.a>
          ))}
        </div>
      </div>
    </section>
  );
};

export default SelfServiceSection;
