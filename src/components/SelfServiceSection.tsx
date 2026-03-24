import { FileText, PhoneCall, Headphones, Monitor, MapPin, MessageSquare, ArrowRight } from "lucide-react";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import { motion } from "framer-motion";

const items = [
  { icon: FileText, title: "2ª via da fatura", desc: "Baixe sua fatura de forma rápida e prática" },
  { icon: PhoneCall, title: "Ligamos para você", desc: "Informe seus dados que entraremos em contato" },
  { icon: Headphones, title: "Central de ajuda", desc: "Tudo que você precisa saber para tirar suas dúvidas" },
  { icon: Monitor, title: "Suporte remoto", desc: "Realizamos o seu atendimento por acesso remoto" },
  { icon: MapPin, title: "Nossas cidades", desc: "Verifique se há cobertura JD Telecom na sua cidade" },
  { icon: MessageSquare, title: "Ouvidoria", desc: "Nossa central está pronta para te receber" },
];

const SelfServiceSection = () => {
  const { ref, isVisible } = useScrollAnimation();

  return (
    <section className="bg-dark-section py-20 md:py-28" ref={ref}>
      <div className="container mx-auto px-4">
        <motion.h2
          className="font-display text-3xl md:text-4xl lg:text-5xl font-bold text-[hsl(var(--dark-section-fg))] text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          animate={isVisible ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
        >
          Autoatendimento para clientes
        </motion.h2>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6 md:gap-8">
          {items.map((item, i) => (
            <motion.a
              key={item.title}
              href="https://wa.me/558005945678"
              target="_blank"
              rel="noopener noreferrer"
              className="group flex flex-col items-start text-left"
              initial={{ opacity: 0, y: 20 }}
              animate={isVisible ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.4, delay: i * 0.08 + 0.2 }}
            >
              <item.icon className="w-6 h-6 text-[hsl(var(--dark-section-fg))] mb-4" />
              <h3 className="font-display font-semibold text-[hsl(var(--dark-section-fg))] text-sm mb-2 leading-snug">{item.title}</h3>
              <p className="text-xs text-[hsl(var(--dark-section-muted))] mb-4 leading-relaxed flex-1">{item.desc}</p>
              <ArrowRight className="w-4 h-4 text-primary group-hover:translate-x-1 transition-transform" />
            </motion.a>
          ))}
        </div>
      </div>
    </section>
  );
};

export default SelfServiceSection;
