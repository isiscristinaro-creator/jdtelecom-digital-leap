import { Button } from "@/components/ui/button";
import { Check, Wifi, Zap } from "lucide-react";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import { motion } from "framer-motion";

const plans = [
  { speed: "400", price: "139", cents: "90", popular: false },
  { speed: "600", price: "179", cents: "90", popular: false },
  { speed: "800", price: "229", cents: "90", popular: true },
  { speed: "1000", price: "349", cents: "90", popular: false },
];

const features = ["Suporte Técnico", "Internet Ilimitada", "Consulte Condições", "Consulte Viabilidade"];

const PlansSection = () => {
  const { ref, isVisible } = useScrollAnimation();

  return (
    <section id="planos" className="py-20 md:py-28 bg-secondary relative overflow-hidden">
      <div className="container mx-auto px-4 relative z-10" ref={ref}>
        <motion.div
          className="text-center mb-14"
          initial={{ opacity: 0, y: 20 }}
          animate={isVisible ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
        >
          <h2 className="font-display text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-4">
            Conheça nossos planos
          </h2>
          <p className="text-muted-foreground text-lg">Planos de internet 100% fibra óptica para sua casa</p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6 max-w-6xl mx-auto">
          {plans.map((plan, i) => (
            <motion.div
              key={plan.speed}
              initial={{ opacity: 0, y: 30 }}
              animate={isVisible ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              whileHover={{ y: -8 }}
              className="relative"
            >
              {plan.popular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 z-20 bg-primary text-primary-foreground text-[10px] font-bold px-4 py-1 rounded-full flex items-center gap-1 shadow-lg whitespace-nowrap">
                  <Zap className="w-3 h-3" /> MAIS POPULAR
                </div>
              )}

              <div className={`rounded-2xl overflow-hidden h-full flex flex-col transition-shadow duration-300 ${
                plan.popular ? "ring-2 ring-primary shadow-glow" : "shadow-lg hover:shadow-xl"
              }`}>
                {/* Orange header */}
                <div className="bg-gradient-to-br from-primary to-[hsl(15,90%,42%)] px-6 py-6 text-center relative overflow-hidden">
                  <div className="absolute inset-0 opacity-10" style={{
                    background: "repeating-linear-gradient(135deg, transparent, transparent 20px, rgba(255,255,255,0.1) 20px, rgba(255,255,255,0.1) 22px)"
                  }} />
                  <div className="relative z-10">
                    <p className="font-display text-4xl md:text-5xl font-extrabold text-primary-foreground leading-none">
                      {plan.speed}
                    </p>
                    <p className="text-primary-foreground/80 text-sm font-semibold mt-1">Mega</p>
                  </div>
                </div>

                {/* Content */}
                <div className="bg-background flex-1 flex flex-col px-6 py-6">
                  {/* Price */}
                  <div className="text-center mb-4">
                    <div className="flex items-start justify-center">
                      <span className="text-sm text-muted-foreground mt-2 mr-1">R$</span>
                      <span className="font-display text-5xl font-extrabold text-foreground leading-none">
                        {plan.price}
                      </span>
                      <div className="flex flex-col items-start ml-0.5 mt-1">
                        <span className="text-base font-bold text-foreground">,{plan.cents}</span>
                      </div>
                    </div>
                    <p className="text-xs text-muted-foreground mt-2">Plano Mensal</p>
                  </div>

                  {/* Divider */}
                  <div className="h-px bg-border mb-4" />

                  {/* Fiber badge */}
                  <div className="text-center mb-3">
                    <span className="inline-block px-3 py-1.5 rounded-full border border-border text-[10px] font-bold text-foreground tracking-wider uppercase">
                      Internet 100% Fibra Óptica
                    </span>
                  </div>

                  {/* TV Plus */}
                  <div className="text-center mb-4">
                    <div className="inline-flex items-center gap-1.5">
                      <span className="text-foreground font-bold text-sm">+</span>
                      <span className="bg-primary text-primary-foreground px-2 py-0.5 rounded text-[10px] font-bold">TV</span>
                      <span className="font-display text-sm font-bold text-foreground">PLUS</span>
                      <span className="text-[10px] text-muted-foreground font-medium">PREMIUM</span>
                    </div>
                  </div>

                  {/* Features */}
                  <ul className="space-y-2.5 mb-6 flex-1">
                    {features.map((f) => (
                      <li key={f} className="flex items-center gap-2.5 text-sm text-muted-foreground">
                        <Check className="w-4 h-4 text-primary shrink-0" />
                        {f}
                      </li>
                    ))}
                  </ul>

                  {/* CTA */}
                  <Button
                    className="w-full bg-primary text-primary-foreground hover:bg-primary/90 font-bold text-sm py-5 rounded-xl shadow-md"
                    asChild
                  >
                    <a href="https://wa.me/558005945678" target="_blank" rel="noopener noreferrer">
                      EU QUERO
                    </a>
                  </Button>
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
