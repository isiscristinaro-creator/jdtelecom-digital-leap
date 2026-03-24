import { Wifi, Tv, Phone, Smartphone } from "lucide-react";
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
    <section className="bg-dark-section py-20 md:py-28" ref={ref}>
      <div className="container mx-auto px-4">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left text */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={isVisible ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.7 }}
          >
            <h2 className="font-display text-3xl md:text-4xl lg:text-5xl font-bold text-[hsl(var(--dark-section-fg))] mb-4 leading-tight">
              Aproveite nossas ofertas{" "}
              <span className="text-primary underline decoration-primary decoration-4 underline-offset-8">exclusivas</span>{" "}
              em forma de combo
            </h2>
            <p className="text-[hsl(var(--dark-section-muted))] text-lg mb-8">
              A JD Telecom tem diversos serviços para você e sua família aproveitarem
            </p>
            <Button
              className="bg-primary text-primary-foreground hover:bg-primary/90 font-bold text-base px-8 py-6 rounded-xl"
              asChild
            >
              <a href="#planos">Conhecer as ofertas</a>
            </Button>
          </motion.div>

          {/* Right cards */}
          <div className="flex gap-4 justify-center">
            {services.map((s, i) => (
              <motion.div
                key={s.title}
                className="flex-1 max-w-[200px] rounded-2xl overflow-hidden group"
                initial={{ opacity: 0, y: 30 }}
                animate={isVisible ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, delay: i * 0.15 + 0.3 }}
                whileHover={{ y: -6 }}
              >
                {/* Gradient top */}
                <div className={`bg-gradient-to-br ${s.color} h-40 flex items-center justify-center relative overflow-hidden`}>
                  <div className="absolute inset-0 bg-black/10" />
                  <s.icon className="w-16 h-16 text-white/90 relative z-10" />
                </div>
                {/* Dark bottom */}
                <div className="bg-[hsl(var(--dark-section-card))] p-4">
                  <h3 className="font-display font-bold text-[hsl(var(--dark-section-fg))] text-sm mb-2">{s.title}</h3>
                  <div className="w-6 h-0.5 bg-primary mb-2" />
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
