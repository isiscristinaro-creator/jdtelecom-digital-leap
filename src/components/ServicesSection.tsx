import { Wifi, Tv, Smartphone } from "lucide-react";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

const services = [
  {
    icon: Wifi,
    title: "Internet",
    description: "Serviços de internet 100% fibra óptica.",
    color: "from-primary to-[hsl(15,90%,42%)]",
  },
  {
    icon: Tv,
    title: "Entretenimento",
    description: "Serviços de streaming de filmes, canais ao vivo, músicas e mais.",
    color: "from-[hsl(350,80%,55%)] to-primary",
  },
  {
    icon: Smartphone,
    title: "Telefonia",
    description: "Serviço de telefonia móvel 5G e fixo, para você falar à vontade.",
    color: "from-primary to-[hsl(40,90%,50%)]",
  },
];

const ServicesSection = () => {
  const { ref, isVisible } = useScrollAnimation();

  return (
    <section className="bg-dark-section py-24 md:py-32 relative overflow-hidden" ref={ref}>
      {/* Ambient glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[600px] rounded-full bg-primary/[0.04] blur-[120px] pointer-events-none" />

      <div className="container mx-auto px-4 relative z-10">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left text */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={isVisible ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.7 }}
          >
            <h2 className="font-display text-2xl sm:text-4xl md:text-5xl lg:text-[3.5rem] font-bold text-[hsl(var(--dark-section-fg))] mb-5 leading-[1.1]">
              Aproveite nossas ofertas{" "}
              <span className="text-gradient">exclusivas</span>{" "}
              em forma de combo
            </h2>
            <p className="text-[hsl(var(--dark-section-muted))] text-lg md:text-xl mb-10 leading-relaxed">
              A JD Telecom tem diversos serviços para você e sua família aproveitarem
            </p>
            <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
              <Button
                className="bg-primary text-primary-foreground hover:bg-primary/90 font-bold text-base px-10 py-7 rounded-2xl shadow-glow hover:shadow-glow-lg transition-shadow duration-500"
                asChild
              >
                <a href="#planos">Conhecer as ofertas</a>
              </Button>
            </motion.div>
          </motion.div>

          {/* Right cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {services.map((s, i) => (
              <motion.div
                key={s.title}
                className="rounded-3xl overflow-hidden group cursor-default w-full max-w-[320px] sm:max-w-none mx-auto"
                initial={{ opacity: 0, y: 40 }}
                animate={isVisible ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, delay: i * 0.15 + 0.3 }}
                whileHover={{ y: -10, scale: 1.02 }}
              >
                {/* Gradient top */}
                <div className={`bg-gradient-to-br ${s.color} h-32 sm:h-44 flex items-center justify-center relative overflow-hidden`}>
                  <div className="absolute inset-0 bg-black/10 group-hover:bg-black/5 transition-colors duration-500" />
                  {/* Floating glow */}
                  <div className="absolute inset-0 bg-gradient-to-t from-transparent to-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  <motion.div
                    animate={{ y: [0, -5, 0] }}
                    transition={{ duration: 3, repeat: Infinity, ease: "easeInOut", delay: i * 0.5 }}
                  >
                    <s.icon className="w-10 h-10 sm:w-16 sm:h-16 text-white/90 relative z-10 drop-shadow-lg" />
                  </motion.div>
                </div>
                {/* Dark bottom */}
                <div className="bg-[hsl(var(--dark-section-card))] p-5 border-t border-[hsl(var(--dark-section-border))]">
                  <h3 className="font-display font-bold text-[hsl(var(--dark-section-fg))] text-base mb-2">{s.title}</h3>
                  <div className="w-8 h-1 bg-primary rounded-full mb-3 group-hover:w-12 transition-all duration-500" />
                  <p className="text-xs text-[hsl(var(--dark-section-muted))] leading-relaxed">{s.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default ServicesSection;
