import { Button } from "@/components/ui/button";
import { Check, Wifi } from "lucide-react";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import { motion } from "framer-motion";

const plans = [
  {
    speed: "400", price: "139", cents: "90", oldPrice: "159,90",
    popular: false, tag: null, category: "internet",
    extras: ["Internet 100% Fibra Óptica", "TV PLUS Premium"],
    features: ["Suporte Técnico", "Internet Ilimitada", "Consulte Condições", "Consulte Viabilidade"],
  },
  {
    speed: "600", price: "179", cents: "90", oldPrice: "199,90",
    popular: false, tag: null, category: "internet",
    extras: ["Internet 100% Fibra Óptica", "TV PLUS Premium"],
    features: ["Suporte Técnico", "Internet Ilimitada", "Consulte Condições", "Consulte Viabilidade"],
  },
  {
    speed: "800", price: "229", cents: "90", oldPrice: "269,90",
    popular: true, tag: "MELHOR OFERTA", category: "destaques",
    extras: ["Internet 100% Fibra Óptica", "TV PLUS Premium"],
    features: ["Suporte Técnico", "Internet Ilimitada", "Consulte Condições", "Consulte Viabilidade"],
  },
  {
    speed: "1000", price: "349", cents: "90", oldPrice: "399,90",
    popular: false, tag: null, category: "destaques",
    extras: ["Internet 100% Fibra Óptica", "TV PLUS Premium"],
    features: ["Suporte Técnico", "Internet Ilimitada", "Consulte Condições", "Consulte Viabilidade"],
  },
];

const PlansSection = () => {
  const { ref, isVisible } = useScrollAnimation();

  return (
    <section id="planos" className="bg-dark-section py-24 md:py-32 relative overflow-hidden">
      {/* Ambient glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-primary/[0.04] blur-[120px] pointer-events-none" />

      <div className="container mx-auto px-4 relative z-10" ref={ref}>
        <motion.div
          className="flex flex-col md:flex-row md:items-end md:justify-between mb-14"
          initial={{ opacity: 0, y: 20 }}
          animate={isVisible ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
        >
          <div>
            <h2 className="font-display text-2xl sm:text-4xl md:text-5xl lg:text-[3.5rem] font-bold text-[hsl(var(--dark-section-fg))] mb-3 leading-[1.1]">
              Aproveite nossas ofertas
            </h2>
            <p className="text-[hsl(var(--dark-section-muted))] text-lg">
              Planos com a melhor relação custo-benefício da região
            </p>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6 max-w-6xl mx-auto">
          {plans.map((plan, i) => (
            <motion.div
              key={plan.speed}
              initial={{ opacity: 0, y: 40 }}
              animate={isVisible ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: i * 0.12 }}
              whileHover={{ y: -8 }}
              className="relative"
            >
              <div
                className={`rounded-3xl overflow-hidden h-full flex flex-col border transition-all duration-500 ${
                  plan.popular
                    ? "border-primary shadow-glow-lg"
                    : "border-[hsl(var(--dark-section-border))] hover:border-[hsl(var(--dark-section-muted))] hover:shadow-elevated"
                }`}
              >
                {plan.tag && (
                  <div className="bg-gradient-to-r from-primary to-[hsl(15,90%,42%)] px-4 py-2.5 text-center">
                    <span className="text-[10px] font-bold text-primary-foreground tracking-[0.2em] uppercase">
                      {plan.tag}
                    </span>
                  </div>
                )}

                <div className="bg-[hsl(var(--dark-section-card))] flex-1 flex flex-col px-6 py-7 relative overflow-hidden">
                  {/* Subtle card glow for popular */}
                  {plan.popular && (
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-40 h-40 bg-primary/5 blur-[60px] pointer-events-none" />
                  )}

                  <div className="mb-5 relative z-10">
                    <div className="flex items-baseline gap-2">
                      <span className="font-display text-3xl sm:text-4xl md:text-[2.75rem] font-extrabold text-[hsl(var(--dark-section-fg))]">
                        {plan.speed}<span className="text-2xl">MEGA</span>
                      </span>
                    </div>
                    <p className="text-xs text-[hsl(var(--dark-section-muted))] mt-1.5">100% fibra óptica</p>
                  </div>

                  <div className="space-y-2.5 mb-6 relative z-10">
                    {plan.extras.map((extra) => (
                      <div key={extra} className="flex items-center gap-2.5">
                        <Wifi className="w-3.5 h-3.5 text-primary shrink-0" />
                        <span className="text-xs text-[hsl(var(--dark-section-fg))]">{extra}</span>
                      </div>
                    ))}
                  </div>

                  <div className="h-px bg-[hsl(var(--dark-section-border))] mb-5 relative z-10" />

                  <ul className="space-y-2.5 mb-7 flex-1 relative z-10">
                    {plan.features.map((f) => (
                      <li key={f} className="flex items-center gap-2.5 text-xs text-[hsl(var(--dark-section-muted))]">
                        <Check className="w-3.5 h-3.5 text-primary shrink-0" />
                        {f}
                      </li>
                    ))}
                  </ul>

                  <div className="mb-6 relative z-10">
                    <p className="text-xs text-[hsl(var(--dark-section-muted))] mb-1.5">
                      de <span className="line-through">R$ {plan.oldPrice}</span>
                    </p>
                    <div className="flex items-baseline">
                      <span className="text-sm text-primary font-bold mr-1">R$</span>
                      <span className="font-display text-4xl sm:text-5xl font-extrabold text-[hsl(var(--dark-section-fg))]">
                        {plan.price}
                      </span>
                      <span className="text-base font-bold text-[hsl(var(--dark-section-fg))]">,{plan.cents}</span>
                      <span className="text-xs text-[hsl(var(--dark-section-muted))] ml-1.5">/mês</span>
                    </div>
                  </div>

                  <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.96 }} className="relative z-10">
                    <Button
                      className={`w-full font-bold text-sm py-6 rounded-2xl relative overflow-hidden group/btn min-h-[48px] ${
                        plan.popular
                          ? "bg-primary text-primary-foreground hover:bg-primary/90 shadow-glow"
                          : "bg-primary text-primary-foreground hover:bg-primary/90"
                      }`}
                      asChild
                    >
                      <a href="/cadastro" aria-label={`Assinar plano ${plan.speed} MEGA por R$ ${plan.price},${plan.cents}/mês`}>
                        <span className="relative z-10">Aproveitar oferta</span>
                        <span className="absolute inset-0 bg-gradient-to-r from-transparent via-primary-foreground/10 to-transparent translate-x-[-200%] group-hover/btn:translate-x-[200%] transition-transform duration-700" />
                      </a>
                    </Button>
                  </motion.div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default PlansSection;
