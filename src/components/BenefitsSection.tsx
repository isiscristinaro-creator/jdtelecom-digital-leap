import { Zap, Shield, Headphones, MapPin, Clock } from "lucide-react";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import { motion } from "framer-motion";
import sofaImg from "@/assets/sofa.png";

const benefits = [
  { icon: Zap, title: "Alta Velocidade", description: "Conexão ultra rápida com fibra óptica de última geração." },
  { icon: Shield, title: "Conexão Estável", description: "99.5% de uptime garantido para você não ficar desconectado." },
  { icon: Headphones, title: "Suporte 24/7", description: "Equipe técnica disponível 24h por dia, 7 dias por semana." },
  { icon: MapPin, title: "Cobertura Regional", description: "Presente em 11+ cidades do AM e PA." },
  { icon: Clock, title: "Instalação Rápida", description: "Seu plano funcionando em até 48 horas." },
];

const BenefitsSection = () => {
  const { ref, isVisible } = useScrollAnimation();

  return (
    <section id="beneficios" className="py-24 md:py-32 bg-background overflow-hidden relative">
      {/* Subtle background decoration */}
      <div className="absolute top-0 right-0 w-[600px] h-[600px] rounded-full bg-primary/[0.02] blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] rounded-full bg-primary/[0.03] blur-3xl pointer-events-none" />

      <div className="container mx-auto px-4 relative z-10" ref={ref}>
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left content */}
          <div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={isVisible ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6 }}
              className="mb-12"
            >
              <h2 className="font-display text-4xl md:text-5xl lg:text-[3.5rem] font-bold text-foreground mb-5 leading-[1.1]">
                Por que escolher a{" "}
                <span className="text-gradient">JD Telecom</span>?
              </h2>
              <p className="text-muted-foreground text-lg md:text-xl leading-relaxed">
                Compromisso com qualidade, velocidade e atendimento de excelência.
              </p>
            </motion.div>

            <div className="space-y-3">
              {benefits.map((b, i) => (
                <motion.div
                  key={b.title}
                  className="flex gap-5 p-5 rounded-2xl border border-border/60 bg-background hover:border-primary/40 hover:shadow-elevated transition-all duration-500 group cursor-default relative overflow-hidden"
                  initial={{ opacity: 0, x: -30 }}
                  animate={isVisible ? { opacity: 1, x: 0 } : {}}
                  transition={{ duration: 0.5, delay: i * 0.1 + 0.2 }}
                  whileHover={{ x: 6 }}
                >
                  {/* Hover glow */}
                  <div className="absolute inset-0 bg-gradient-to-r from-primary/[0.03] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                  <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-primary/15 to-primary/5 flex items-center justify-center shrink-0 group-hover:from-primary/25 group-hover:to-primary/10 transition-all duration-500 relative z-10">
                    <b.icon className="w-5 h-5 text-primary" />
                  </div>
                  <div className="relative z-10">
                    <h3 className="font-display font-bold text-foreground text-base mb-1">{b.title}</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">{b.description}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Right - Sofa image with glow */}
          <motion.div
            className="flex justify-center relative"
            initial={{ opacity: 0, x: 40 }}
            animate={isVisible ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.3 }}
          >
            {/* Glow behind image */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="w-[80%] h-[80%] rounded-full bg-primary/10 blur-[80px]" />
            </div>
            <motion.img
              src={sofaImg}
              alt="Mascote JD Telecom assistindo no sofá"
              className="w-full max-w-lg object-contain drop-shadow-2xl relative z-10"
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            />
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default BenefitsSection;
