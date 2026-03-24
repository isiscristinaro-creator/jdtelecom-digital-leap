import { FileText, Gauge, Wrench, ScrollText } from "lucide-react";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import { motion } from "framer-motion";
import sofaImg from "@/assets/sofa.png";

const items = [
  { icon: FileText, title: "2ª Via de Fatura", desc: "Acesse agora a sua 2ª via de fatura." },
  { icon: Gauge, title: "Teste de Velocidade", desc: "Teste a velocidade de sua internet." },
  { icon: Wrench, title: "Suporte para Reparos", desc: "Contate nosso suporte para reparos." },
  { icon: ScrollText, title: "Acesse seu Contrato", desc: "Acesse nosso contrato." },
];

const SelfServiceSection = () => {
  const { ref, isVisible } = useScrollAnimation();

  return (
    <section className="bg-dark-section py-20 md:py-28 relative overflow-hidden" ref={ref}>
      {/* Animated background */}
      <motion.div
        className="absolute -top-40 -right-40 w-[500px] h-[500px] rounded-full bg-primary/5 blur-3xl"
        animate={{ x: [0, 30, 0], y: [0, -20, 0] }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute -bottom-40 -left-40 w-[400px] h-[400px] rounded-full bg-primary/3 blur-3xl"
        animate={{ x: [0, -20, 0], y: [0, 30, 0] }}
        transition={{ duration: 12, repeat: Infinity, ease: "easeInOut", delay: 2 }}
      />

      <div className="container mx-auto px-4 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left - Sofa image */}
          <motion.div
            className="flex justify-center"
            initial={{ opacity: 0, x: -40 }}
            animate={isVisible ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8 }}
          >
            <img
              src={sofaImg}
              alt="Mascote JD Telecom no sofá com pipoca e controle remoto"
              className="w-full max-w-lg object-contain drop-shadow-2xl"
            />
          </motion.div>

          {/* Right - Services */}
          <div>
            <motion.h2
              className="font-display text-3xl md:text-4xl lg:text-5xl font-bold text-[hsl(var(--dark-section-fg))] mb-4"
              initial={{ opacity: 0, y: 20 }}
              animate={isVisible ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              Autoatendimento
            </motion.h2>
            <motion.p
              className="text-[hsl(var(--dark-section-muted))] mb-8 text-lg"
              initial={{ opacity: 0, y: 20 }}
              animate={isVisible ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              Resolva tudo de forma rápida e prática, sem sair do sofá.
            </motion.p>

            <div className="grid sm:grid-cols-2 gap-4">
              {items.map((item, i) => (
                <motion.a
                  key={item.title}
                  href="https://wa.me/558005945678"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex items-start gap-4 p-5 rounded-2xl border border-[hsl(var(--dark-section-border))] bg-[hsl(var(--dark-section-card))] hover:border-primary/40 hover:shadow-glow transition-all duration-300"
                  initial={{ opacity: 0, y: 20 }}
                  animate={isVisible ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.5, delay: i * 0.1 + 0.4 }}
                  whileHover={{ y: -4, scale: 1.02 }}
                >
                  <div className="w-12 h-12 rounded-xl bg-primary/15 flex items-center justify-center shrink-0 group-hover:bg-primary/25 transition-colors">
                    <item.icon className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-display font-semibold text-[hsl(var(--dark-section-fg))] text-sm mb-1">{item.title}</h3>
                    <p className="text-xs text-[hsl(var(--dark-section-muted))]">{item.desc}</p>
                  </div>
                </motion.a>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SelfServiceSection;
