import { Button } from "@/components/ui/button";
import { Check, Wifi, Zap } from "lucide-react";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import { motion } from "framer-motion";
import personaArms from "@/assets/persona-female-arms.png";
import personaWave from "@/assets/persona-female-wave.png";
import personaPresent from "@/assets/persona-female-present.png";
import personaWalk from "@/assets/persona-female-walk.png";

const plans = [
  {
    name: "400 Mega",
    speed: "400",
    unit: "Mega",
    price: "139",
    cents: "90",
    persona: personaPresent,
    popular: false,
    features: [
      "Suporte Técnico",
      "Internet Ilimitada",
      "Consulte Condições",
      "Consulte Viabilidade",
    ],
  },
  {
    name: "600 Mega",
    speed: "600",
    unit: "Mega",
    price: "179",
    cents: "90",
    persona: personaWalk,
    popular: false,
    features: [
      "Suporte Técnico",
      "Internet Ilimitada",
      "Consulte Condições",
      "Consulte Viabilidade",
    ],
  },
  {
    name: "800 Mega",
    speed: "800",
    unit: "Mega",
    price: "229",
    cents: "90",
    persona: personaArms,
    popular: true,
    features: [
      "Suporte Técnico",
      "Internet Ilimitada",
      "Consulte Condições",
      "Consulte Viabilidade",
    ],
  },
  {
    name: "1000 Mega",
    speed: "1000",
    unit: "Mega",
    price: "349",
    cents: "90",
    persona: personaWave,
    popular: false,
    features: [
      "Suporte Técnico",
      "Internet Ilimitada",
      "Consulte Condições",
      "Consulte Viabilidade",
    ],
  },
];

const FloatingParticle = ({ delay, x, y, size }: { delay: number; x: string; y: string; size: number }) => (
  <motion.div
    className="absolute rounded-full bg-primary/20"
    style={{ left: x, top: y, width: size, height: size }}
    animate={{
      y: [0, -20, 0],
      opacity: [0.2, 0.6, 0.2],
      scale: [1, 1.2, 1],
    }}
    transition={{
      duration: 4,
      delay,
      repeat: Infinity,
      ease: "easeInOut",
    }}
  />
);

const WaveBackground = () => (
  <div className="absolute inset-0 overflow-hidden pointer-events-none">
    {/* Animated gradient orbs */}
    <motion.div
      className="absolute -top-32 -left-32 w-96 h-96 rounded-full bg-primary/5 blur-3xl"
      animate={{ x: [0, 50, 0], y: [0, 30, 0] }}
      transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
    />
    <motion.div
      className="absolute -bottom-32 -right-32 w-80 h-80 rounded-full bg-primary/8 blur-3xl"
      animate={{ x: [0, -40, 0], y: [0, -20, 0] }}
      transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 2 }}
    />
    <motion.div
      className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-primary/3 blur-3xl"
      animate={{ scale: [1, 1.15, 1], opacity: [0.3, 0.5, 0.3] }}
      transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
    />

    {/* Floating particles */}
    <FloatingParticle delay={0} x="10%" y="20%" size={6} />
    <FloatingParticle delay={1} x="85%" y="15%" size={4} />
    <FloatingParticle delay={2} x="70%" y="70%" size={8} />
    <FloatingParticle delay={0.5} x="25%" y="80%" size={5} />
    <FloatingParticle delay={1.5} x="50%" y="10%" size={6} />
    <FloatingParticle delay={3} x="90%" y="50%" size={4} />
    <FloatingParticle delay={2.5} x="15%" y="55%" size={7} />

    {/* Grid pattern */}
    <div className="absolute inset-0 opacity-[0.03]" style={{
      backgroundImage: `
        linear-gradient(hsl(var(--primary)) 1px, transparent 1px),
        linear-gradient(90deg, hsl(var(--primary)) 1px, transparent 1px)
      `,
      backgroundSize: "60px 60px",
    }} />

    {/* Animated connection lines */}
    <svg className="absolute inset-0 w-full h-full opacity-[0.06]" xmlns="http://www.w3.org/2000/svg">
      <motion.line
        x1="10%" y1="20%" x2="30%" y2="80%"
        stroke="hsl(var(--primary))" strokeWidth="1"
        animate={{ opacity: [0, 0.5, 0] }}
        transition={{ duration: 5, repeat: Infinity, delay: 0 }}
      />
      <motion.line
        x1="70%" y1="10%" x2="90%" y2="60%"
        stroke="hsl(var(--primary))" strokeWidth="1"
        animate={{ opacity: [0, 0.5, 0] }}
        transition={{ duration: 5, repeat: Infinity, delay: 1.5 }}
      />
      <motion.line
        x1="50%" y1="5%" x2="20%" y2="50%"
        stroke="hsl(var(--primary))" strokeWidth="1"
        animate={{ opacity: [0, 0.4, 0] }}
        transition={{ duration: 6, repeat: Infinity, delay: 3 }}
      />
    </svg>
  </div>
);

const PlansSection = () => {
  const { ref, isVisible } = useScrollAnimation();

  return (
    <section id="planos" className="py-20 md:py-28 bg-background relative overflow-hidden">
      <WaveBackground />

      <div className="container mx-auto px-4 relative z-10" ref={ref}>
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          animate={isVisible ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
        >
          <span className="inline-flex items-center gap-2 bg-primary/10 text-primary text-xs font-bold px-4 py-1.5 rounded-full mb-4">
            <Wifi className="w-3.5 h-3.5" /> INTERNET 100% FIBRA ÓPTICA
          </span>
          <h2 className="font-display text-3xl md:text-4xl lg:text-5xl font-bold text-foreground">
            Conheça nossos planos
          </h2>
        </motion.div>

        <div className="grid sm:grid-cols-2 xl:grid-cols-4 gap-6 max-w-7xl mx-auto">
          {plans.map((plan, i) => (
            <motion.div
              key={plan.name}
              initial={{ opacity: 0, y: 40 }}
              animate={isVisible ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: i * 0.12 }}
              whileHover={{ y: -8, scale: 1.02 }}
              className={`relative group rounded-3xl overflow-hidden shadow-xl ${
                plan.popular ? "ring-2 ring-primary shadow-glow" : ""
              }`}
            >
              {plan.popular && (
                <div className="absolute top-4 right-4 z-20 bg-primary text-primary-foreground text-[10px] font-bold px-3 py-1 rounded-full flex items-center gap-1">
                  <Zap className="w-3 h-3" /> MAIS POPULAR
                </div>
              )}

              {/* Top gradient section */}
              <div className="relative bg-gradient-to-br from-primary via-primary to-[hsl(15,90%,42%)] pt-6 pb-32 px-6 text-center overflow-hidden">
                {/* Animated diagonal stripes */}
                <motion.div
                  className="absolute inset-0"
                  style={{
                    background: "repeating-linear-gradient(135deg, transparent, transparent 20px, rgba(255,255,255,0.05) 20px, rgba(255,255,255,0.05) 22px)",
                  }}
                  animate={{ backgroundPositionX: ["0px", "44px"] }}
                  transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                />
                {/* Glow effect */}
                <motion.div
                  className="absolute top-0 left-1/2 -translate-x-1/2 w-40 h-40 bg-white/10 rounded-full blur-3xl"
                  animate={{ opacity: [0.3, 0.6, 0.3], scale: [0.8, 1.1, 0.8] }}
                  transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: i * 0.5 }}
                />

                <h3 className="font-display text-2xl md:text-3xl font-bold text-primary-foreground relative z-10">
                  {plan.speed} {plan.unit}
                </h3>

                {/* Persona */}
                <motion.img
                  src={plan.persona}
                  alt={`Mascote JD Telecom - Plano ${plan.name}`}
                  className="absolute bottom-0 left-1/2 -translate-x-1/2 h-44 object-contain drop-shadow-lg z-10"
                  whileHover={{ scale: 1.08 }}
                  transition={{ type: "spring", stiffness: 300 }}
                />
              </div>

              {/* Bottom section */}
              <div className="bg-[hsl(var(--dark-section))] px-5 pt-6 pb-6 relative">
                {/* Subtle top border glow */}
                <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/40 to-transparent" />

                {/* Price */}
                <div className="text-center mb-4">
                  <div className="flex items-baseline justify-center gap-1">
                    <span className="text-xs text-[hsl(var(--dark-section-muted))]">R$</span>
                    <span className="font-display text-4xl font-bold text-[hsl(var(--dark-section-fg))]">
                      {plan.price}
                    </span>
                    <span className="text-xs text-[hsl(var(--dark-section-muted))]">,{plan.cents}</span>
                  </div>
                  <p className="text-[10px] text-[hsl(var(--dark-section-muted))] mt-1 uppercase tracking-wider">Plano Mensal</p>
                </div>

                {/* Fiber badge */}
                <div className="text-center mb-3">
                  <span className="inline-block px-3 py-1 rounded-full border border-[hsl(var(--dark-section-border))] text-[10px] font-semibold text-[hsl(var(--dark-section-fg))] tracking-wider">
                    INTERNET 100% FIBRA ÓPTICA
                  </span>
                </div>

                {/* TV Plus */}
                <div className="text-center mb-4">
                  <p className="text-[hsl(var(--dark-section-fg))] font-bold text-sm flex items-center justify-center gap-1">
                    + <span className="bg-primary text-primary-foreground px-2 py-0.5 rounded text-[10px] font-bold">TV</span>
                    <span className="font-display text-base">PLUS</span>
                    <span className="text-[10px] text-[hsl(var(--dark-section-muted))]">CANAIS PREMIUM</span>
                  </p>
                </div>

                {/* Features */}
                <ul className="space-y-2 mb-5">
                  {plan.features.map((f) => (
                    <li key={f} className="flex items-center gap-2 text-xs text-[hsl(var(--dark-section-muted))]">
                      <Check className="w-3.5 h-3.5 text-primary shrink-0" />
                      {f}
                    </li>
                  ))}
                </ul>

                {/* CTA */}
                <Button
                  className={`w-full font-bold text-sm py-5 rounded-xl transition-all duration-300 ${
                    plan.popular
                      ? "bg-primary text-primary-foreground hover:bg-primary/90 shadow-glow"
                      : "bg-primary text-primary-foreground hover:bg-primary/90"
                  }`}
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
