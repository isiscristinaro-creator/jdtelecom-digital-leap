import { Button } from "@/components/ui/button";
import { Check, Wifi } from "lucide-react";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import { motion } from "framer-motion";
const plans = [
  {
    speed: "400",
    price: "139",
    cents: "90",
    oldPrice: "159,90",
    popular: false,
    tag: null,
    category: "internet",
    extras: ["Internet 100% Fibra Óptica", "TV PLUS Premium"],
    features: ["Suporte Técnico", "Internet Ilimitada", "Consulte Condições", "Consulte Viabilidade"],
  },
  {
    speed: "600",
    price: "179",
    cents: "90",
    oldPrice: "199,90",
    popular: false,
    tag: null,
    category: "internet",
    extras: ["Internet 100% Fibra Óptica", "TV PLUS Premium"],
    features: ["Suporte Técnico", "Internet Ilimitada", "Consulte Condições", "Consulte Viabilidade"],
  },
  {
    speed: "800",
    price: "229",
    cents: "90",
    oldPrice: "269,90",
    popular: true,
    tag: "MELHOR OFERTA",
    category: "destaques",
    extras: ["Internet 100% Fibra Óptica", "TV PLUS Premium"],
    features: ["Suporte Técnico", "Internet Ilimitada", "Consulte Condições", "Consulte Viabilidade"],
  },
  {
    speed: "1000",
    price: "349",
    cents: "90",
    oldPrice: "399,90",
    popular: false,
    tag: null,
    category: "destaques",
    extras: ["Internet 100% Fibra Óptica", "TV PLUS Premium"],
    features: ["Suporte Técnico", "Internet Ilimitada", "Consulte Condições", "Consulte Viabilidade"],
  },
];

const PlansSection = () => {
  const { ref, isVisible } = useScrollAnimation();


  return (
    <section id="planos" className="bg-dark-section py-20 md:py-28 relative overflow-hidden">
      <div className="container mx-auto px-4 relative z-10" ref={ref}>
        {/* Header */}
        <motion.div
          className="flex flex-col md:flex-row md:items-end md:justify-between mb-10"
          initial={{ opacity: 0, y: 20 }}
          animate={isVisible ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
        >
          <h2 className="font-display text-3xl md:text-4xl lg:text-5xl font-bold text-[hsl(var(--dark-section-fg))] mb-6 md:mb-0">
            Aproveite nossas ofertas
          </h2>
        </motion.div>


        {/* Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5 max-w-6xl mx-auto">
          {plans.map((plan, i) => (
            <motion.div
              key={plan.speed}
              initial={{ opacity: 0, y: 30 }}
              animate={isVisible ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              whileHover={{ y: -6 }}
              className="relative"
            >
              <div
                className={`rounded-2xl overflow-hidden h-full flex flex-col border transition-shadow duration-300 ${
                  plan.popular
                    ? "border-primary shadow-glow"
                    : "border-[hsl(var(--dark-section-border))] hover:border-[hsl(var(--dark-section-muted))]"
                }`}
              >
                {/* Tag */}
                {plan.tag && (
                  <div className="bg-[hsl(var(--dark-section-card))] border-b border-[hsl(var(--dark-section-border))] px-4 py-2 text-center">
                    <span className="text-[10px] font-bold text-[hsl(var(--dark-section-fg))] tracking-widest uppercase">
                      {plan.tag}
                    </span>
                  </div>
                )}

                {/* Card Body */}
                <div className="bg-[hsl(var(--dark-section-card))] flex-1 flex flex-col px-6 py-6">
                  {/* Speed */}
                  <div className="mb-4">
                    <div className="flex items-baseline gap-2">
                      <span className="font-display text-3xl md:text-4xl font-extrabold text-[hsl(var(--dark-section-fg))]">
                        {plan.speed}MEGA
                      </span>
                    </div>
                    <p className="text-xs text-[hsl(var(--dark-section-muted))] mt-1">100% fibra óptica</p>
                  </div>

                  {/* Extras */}
                  <div className="space-y-2 mb-5">
                    {plan.extras.map((extra) => (
                      <div key={extra} className="flex items-center gap-2">
                        <Wifi className="w-3.5 h-3.5 text-primary shrink-0" />
                        <span className="text-xs text-[hsl(var(--dark-section-fg))]">{extra}</span>
                      </div>
                    ))}
                  </div>

                  {/* Divider */}
                  <div className="h-px bg-[hsl(var(--dark-section-border))] mb-4" />

                  {/* Features */}
                  <ul className="space-y-2 mb-6 flex-1">
                    {plan.features.map((f) => (
                      <li key={f} className="flex items-center gap-2 text-xs text-[hsl(var(--dark-section-muted))]">
                        <Check className="w-3.5 h-3.5 text-primary shrink-0" />
                        {f}
                      </li>
                    ))}
                  </ul>

                  {/* Price */}
                  <div className="mb-5">
                    <p className="text-xs text-[hsl(var(--dark-section-muted))] mb-1">
                      de{" "}
                      <span className="line-through">R$ {plan.oldPrice}</span>
                    </p>
                    <div className="flex items-baseline">
                      <span className="text-sm text-primary font-bold mr-1">R$</span>
                      <span className="font-display text-4xl font-extrabold text-[hsl(var(--dark-section-fg))]">
                        {plan.price}
                      </span>
                      <span className="text-sm font-bold text-[hsl(var(--dark-section-fg))]">,{plan.cents}</span>
                      <span className="text-xs text-[hsl(var(--dark-section-muted))] ml-1">/mês</span>
                    </div>
                  </div>

              {/* CTA */}
                  <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.96 }}>
                    <Button
                      className="w-full bg-primary text-primary-foreground hover:bg-primary/90 font-bold text-sm py-5 rounded-xl relative overflow-hidden group/btn"
                      asChild
                    >
                      <a href="#contato">
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
