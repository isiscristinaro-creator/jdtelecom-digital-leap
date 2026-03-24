import { Button } from "@/components/ui/button";
import { Check, Wifi, Zap, Crown } from "lucide-react";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import { motion } from "framer-motion";

const plans = [
  {
    name: "400 Mega",
    speed: "400",
    price: "139",
    cents: "90",
    popular: false,
    features: ["Suporte Técnico", "Internet Ilimitada", "Consulte Condições", "Consulte Viabilidade"],
  },
  {
    name: "600 Mega",
    speed: "600",
    price: "179",
    cents: "90",
    popular: false,
    features: ["Suporte Técnico", "Internet Ilimitada", "Consulte Condições", "Consulte Viabilidade"],
  },
  {
    name: "800 Mega",
    speed: "800",
    price: "229",
    cents: "90",
    popular: true,
    features: ["Suporte Técnico", "Internet Ilimitada", "Consulte Condições", "Consulte Viabilidade"],
  },
  {
    name: "1000 Mega",
    speed: "1000",
    price: "349",
    cents: "90",
    popular: false,
    icon: Crown,
    features: ["Suporte Técnico", "Internet Ilimitada", "Consulte Condições", "Consulte Viabilidade"],
  },
];

const FloatingParticle = ({ delay, x, y, size }: { delay: number; x: string; y: string; size: number }) => (
  <motion.div
    className="absolute rounded-full bg-primary/15"
    style={{ left: x, top: y, width: size, height: size }}
    animate={{ y: [0, -15, 0], opacity: [0.15, 0.4, 0.15] }}
    transition={{ duration: 5, delay, repeat: Infinity, ease: "easeInOut" }}
  />
);

const PlansSection = () => {
  const { ref, isVisible } = useScrollAnimation();

  return (
    <section id="planos" className="py-20 md:py-28 bg-background relative overflow-hidden">
      {/* Background effects */}
      <motion.div
        className="absolute -top-40 -right-40 w-[500px] h-[500px] rounded-full bg-primary/5 blur-3xl"
        animate={{ x: [0, 40, 0], y: [0, 20, 0] }}
        transition={{ duration: 14, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute -bottom-40 -left-40 w-[400px] h-[400px] rounded-full bg-primary/4 blur-3xl"
        animate={{ x: [0, -30, 0] }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 3 }}
      />
      <FloatingParticle delay={0} x="8%" y="15%" size={5} />
      <FloatingParticle delay={1.2} x="88%" y="20%" size={4} />
      <FloatingParticle delay={2.4} x="75%" y="75%" size={6} />
      <FloatingParticle delay={0.8} x="20%" y="80%" size={4} />

      <div className="container mx-auto px-4 relative z-10" ref={ref}>
        <motion.div
          className="text-center mb-14"
          initial={{ opacity: 0, y: 20 }}
          animate={isVisible ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
        >
          <span className="inline-flex items-center gap-2 bg-primary/10 text-primary text-xs font-bold px-4 py-1.5 rounded-full mb-4">
            <Wifi className="w-3.5 h-3.5" /> 100% FIBRA ÓPTICA
          </span>
          <h2 className="font-display text-3xl md:text-4xl lg:text-5xl font-bold text-foreground">
            Conheça nossos planos
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5 max-w-6xl mx-auto">
          {plans.map((plan, i) => (
            <motion.div
              key={plan.name}
              initial={{ opacity: 0, y: 30 }}
              animate={isVisible ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              whileHover={{ y: -6 }}
              className={`relative rounded-2xl overflow-hidden transition-shadow duration-300 ${
                plan.popular
                  ? "ring-2 ring-primary shadow-glow"
                  : "shadow-lg hover:shadow-xl"
              }`}
            >
              {plan.popular && (
                <div className="absolute top-0 left-0 right-0 z-20 bg-primary text-primary-foreground text-[10px] font-bold py-1.5 text-center tracking-widest flex items-center justify-center gap-1">
                  <Zap className="w-3 h-3" /> MAIS POPULAR
                </div>
              )}

              <div className={`bg-[hsl(var(--dark-section))] flex flex-col h-full ${plan.popular ? "pt-8" : "pt-5"} pb-5 px-5`}>
                {/* Speed header */}
                <div className="text-center mb-5">
                  <div className="inline-flex items-center gap-2 bg-primary/10 rounded-full px-4 py-2 mb-3">
                    <Wifi className="w-4 h-4 text-primary" />
                    <span className="font-display text-lg font-bold text-primary">{plan.speed} Mega</span>
                  </div>
                </div>

                {/* Price */}
                <div className="text-center mb-5">
                  <div className="flex items-start justify-center">
                    <span className="text-xs text-[hsl(var(--dark-section-muted))] mt-2 mr-1">R$</span>
                    <span className="font-display text-5xl font-extrabold text-[hsl(var(--dark-section-fg))] leading-none">
                      {plan.price}
                    </span>
                    <div className="flex flex-col items-start ml-0.5 mt-1">
                      <span className="text-sm font-bold text-[hsl(var(--dark-section-fg))]">,{plan.cents}</span>
                      <span className="text-[9px] text-[hsl(var(--dark-section-muted))]">/mês</span>
                    </div>
                  </div>
                </div>

                {/* Divider */}
                <div className="h-px bg-[hsl(var(--dark-section-border))] mb-4" />

                {/* TV Plus */}
                <div className="text-center mb-4">
                  <div className="inline-flex items-center gap-1.5 bg-primary/10 rounded-lg px-3 py-1.5">
                    <span className="bg-primary text-primary-foreground px-1.5 py-0.5 rounded text-[9px] font-bold">TV</span>
                    <span className="font-display text-sm font-bold text-[hsl(var(--dark-section-fg))]">PLUS</span>
                    <span className="text-[9px] text-[hsl(var(--dark-section-muted))]">PREMIUM</span>
                  </div>
                </div>

                {/* Features */}
                <ul className="space-y-2.5 mb-6 flex-1">
                  {plan.features.map((f) => (
                    <li key={f} className="flex items-center gap-2.5 text-sm text-[hsl(var(--dark-section-muted))]">
                      <div className="w-5 h-5 rounded-full bg-primary/15 flex items-center justify-center shrink-0">
                        <Check className="w-3 h-3 text-primary" />
                      </div>
                      {f}
                    </li>
                  ))}
                </ul>

                {/* CTA */}
                <Button
                  className={`w-full font-bold text-sm py-5 rounded-xl ${
                    plan.popular
                      ? "bg-primary text-primary-foreground hover:bg-primary/90 shadow-glow"
                      : "bg-primary/15 text-primary hover:bg-primary hover:text-primary-foreground"
                  } transition-all duration-300`}
                  asChild
                >
                  <a href="https://wa.me/558005945678" target="_blank" rel="noopener noreferrer">
                    EU QUERO
                  </a>
                </Button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default PlansSection;
