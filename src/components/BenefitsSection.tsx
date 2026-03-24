import { Zap, Shield, Headphones, MapPin, Clock } from "lucide-react";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import { motion } from "framer-motion";
import sofaImg from "@/assets/sofa.png";

const benefits = [
  { icon: Zap, title: "Alta Velocidade", description: "Conexão ultra rápida com fibra óptica de última geração para streaming, jogos e trabalho." },
  { icon: Shield, title: "Conexão Estável", description: "99.5% de uptime garantido para você não ficar desconectado em nenhum momento." },
  { icon: Headphones, title: "Suporte 24/7", description: "Equipe técnica disponível 24h por dia, 7 dias por semana, sempre pronta para ajudar." },
  { icon: MapPin, title: "Cobertura Regional", description: "Presente em 11+ cidades do AM e PA com infraestrutura de ponta." },
  { icon: Clock, title: "Instalação Rápida", description: "Seu plano funcionando em até 48 horas após a contratação." },
];

const BenefitsSection = () => {
  const { ref, isVisible } = useScrollAnimation();

  return (
    <section id="beneficios" className="py-16 sm:py-20 md:py-32 lg:py-40 bg-background overflow-hidden relative">
      {/* Decorative background elements */}
      <div className="absolute top-0 right-0 w-[700px] h-[700px] rounded-full bg-primary/[0.03] blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] rounded-full bg-primary/[0.04] blur-[100px] pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] rounded-full bg-primary/[0.02] blur-[80px] pointer-events-none" />

      <div className="container mx-auto px-4 relative z-10" ref={ref}>
        <div className="grid lg:grid-cols-2 gap-10 sm:gap-12 md:gap-20 items-center">
          {/* Left content */}
          <div>
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={isVisible ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.7 }}
              className="mb-10 sm:mb-12 md:mb-14"
            >
              <motion.span
                className="inline-block bg-primary/10 text-primary text-xs font-bold px-4 py-2 rounded-full mb-5 border border-primary/20"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={isVisible ? { opacity: 1, scale: 1 } : {}}
                transition={{ duration: 0.5 }}
              >
                DIFERENCIAIS
              </motion.span>
              <h2 className="font-display text-2xl sm:text-4xl md:text-5xl lg:text-[3.5rem] font-bold text-foreground mb-5 sm:mb-6 leading-[1.05]">
                Por que escolher a{" "}
                <span className="text-gradient">JD Telecom</span>?
              </h2>
              <p className="text-muted-foreground text-base sm:text-lg md:text-xl leading-relaxed max-w-xl">
                Compromisso com qualidade, velocidade e atendimento de excelência para conectar você ao que importa.
              </p>
            </motion.div>

            <div className="space-y-3 sm:space-y-4">
              {benefits.map((b, i) => (
                <motion.div
                  key={b.title}
                  className="flex flex-col sm:flex-row items-center sm:items-start gap-4 sm:gap-5 p-4 sm:p-6 rounded-2xl bg-background border border-border/50 relative overflow-hidden group cursor-default"
                  style={{
                    boxShadow: "0 2px 12px hsl(0 0% 0% / 0.04), 0 1px 3px hsl(0 0% 0% / 0.06)"
                  }}
                  initial={{ opacity: 0, x: -40 }}
                  animate={isVisible ? { opacity: 1, x: 0 } : {}}
                  transition={{ duration: 0.5, delay: i * 0.1 + 0.2 }}
                  whileHover={{
                    y: -4,
                    scale: 1.01,
                    boxShadow: "0 8px 30px hsl(24 95% 50% / 0.12), 0 2px 8px hsl(0 0% 0% / 0.08)",
                    borderColor: "hsl(24 95% 50% / 0.3)",
                  }}
                >
                  {/* Hover gradient overlay */}
                  <div className="absolute inset-0 bg-gradient-to-r from-primary/[0.04] via-primary/[0.02] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  
                  {/* Left accent bar */}
                  <div className="absolute left-0 top-0 bottom-0 w-1 bg-primary/0 group-hover:bg-primary rounded-r-full transition-all duration-500" />

                  {/* Icon circle */}
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary/15 to-primary/5 flex items-center justify-center shrink-0 relative z-10 group-hover:from-primary/25 group-hover:to-primary/10 group-hover:shadow-lg group-hover:shadow-primary/10 transition-all duration-500 mx-auto sm:mx-0">
                    <b.icon className="w-6 h-6 text-primary" />
                  </div>
                  
                  <div className="relative z-10 text-center sm:text-left">
                    <h3 className="font-display font-bold text-foreground text-base mb-1.5">{b.title}</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">{b.description}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Right - Sofa image with premium treatment */}
          <motion.div
            className="flex justify-center relative mt-2 lg:mt-0"
            initial={{ opacity: 0, x: 50, scale: 0.9 }}
            animate={isVisible ? { opacity: 1, x: 0, scale: 1 } : {}}
            transition={{ duration: 0.9, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
          >
            {/* Multi-layer glow behind image */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="w-[85%] h-[85%] rounded-full bg-primary/[0.08] blur-[60px]" />
            </div>
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="w-[60%] h-[60%] rounded-full bg-primary/[0.12] blur-[40px]" />
            </div>
            
            {/* Decorative ring */}
            <motion.div
              className="absolute inset-0 hidden sm:flex items-center justify-center pointer-events-none"
              animate={{ rotate: [0, 360] }}
              transition={{ duration: 60, repeat: Infinity, ease: "linear" }}
            >
              <div className="w-[80%] h-[80%] rounded-full border border-dashed border-primary/10" />
            </motion.div>

            <motion.img
              src={sofaImg}
              alt="Mascote JD Telecom assistindo no sofá"
              className="w-full max-w-sm sm:max-w-md lg:max-w-lg object-contain relative z-10"
              style={{ filter: "drop-shadow(0 20px 40px hsl(24 95% 50% / 0.2)) drop-shadow(0 8px 16px hsl(0 0% 0% / 0.15))" }}
              animate={{ y: [0, -12, 0] }}
              transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
            />
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default BenefitsSection;
