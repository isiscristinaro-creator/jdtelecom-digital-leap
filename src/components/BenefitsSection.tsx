import { Wifi, Tv, Phone, Radio, Zap, Shield, Headphones, MapPin, Clock } from "lucide-react";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
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
    <section id="beneficios" className="py-20 md:py-28 bg-background overflow-hidden">
      <div className="container mx-auto px-4" ref={ref}>
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left content */}
          <div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={isVisible ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6 }}
              className="mb-10"
            >
              <h2 className="font-display text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-4">
                Por que escolher a <span className="text-primary">JD Telecom</span>?
              </h2>
              <p className="text-muted-foreground text-lg">
                Compromisso com qualidade, velocidade e atendimento de excelência.
              </p>
            </motion.div>

            <div className="space-y-4">
              {benefits.map((b, i) => (
                <motion.div
                  key={b.title}
                  className="flex gap-4 p-4 rounded-xl border border-border hover:border-primary/30 hover:shadow-card transition-all duration-300 group"
                  initial={{ opacity: 0, x: -20 }}
                  animate={isVisible ? { opacity: 1, x: 0 } : {}}
                  transition={{ duration: 0.4, delay: i * 0.1 + 0.2 }}
                >
                  <div className="w-11 h-11 rounded-xl bg-primary/10 flex items-center justify-center shrink-0 group-hover:bg-primary/20 transition-colors">
                    <b.icon className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-display font-semibold text-foreground text-sm mb-0.5">{b.title}</h3>
                    <p className="text-xs text-muted-foreground">{b.description}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Right - Sofa image */}
          <motion.div
            className="flex justify-center"
            initial={{ opacity: 0, x: 30 }}
            animate={isVisible ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.3 }}
          >
            <img
              src={sofaImg}
              alt="Mascote JD Telecom assistindo no sofá"
              className="w-full max-w-lg object-contain drop-shadow-2xl"
            />
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default BenefitsSection;
