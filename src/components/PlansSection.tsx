import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import personaArms from "@/assets/persona-female-arms.png";
import personaWave from "@/assets/persona-female-wave.png";
import personaPresent from "@/assets/persona-female-present.png";

const plans = [
  {
    name: "400 Mega",
    speed: "400",
    unit: "Mega",
    price: "139",
    cents: "90",
    persona: personaPresent,
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
    features: [
      "Suporte Técnico",
      "Internet Ilimitada",
      "Consulte Condições",
      "Consulte Viabilidade",
    ],
  },
];

const PlansSection = () => {
  const { ref, isVisible } = useScrollAnimation();

  return (
    <section id="planos" className="py-20 md:py-28 bg-background">
      <div className="container mx-auto px-4" ref={ref}>
        <h2
          className={`font-display text-3xl md:text-4xl lg:text-5xl font-bold text-foreground text-center mb-16 transition-all duration-700 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
        >
          Conheça nossos planos
        </h2>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {plans.map((plan, i) => (
            <div
              key={plan.name}
              className={`relative rounded-2xl overflow-hidden shadow-xl hover:shadow-2xl hover:scale-[1.03] transition-all duration-500 ${
                isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-12"
              }`}
              style={{ transitionDelay: isVisible ? `${i * 150}ms` : "0ms" }}
            >
              {/* Top orange section */}
              <div className="relative bg-gradient-to-br from-primary to-[hsl(15,90%,45%)] pt-6 pb-28 px-6 text-center overflow-hidden">
                {/* Diagonal stripes decoration */}
                <div className="absolute inset-0 opacity-10">
                  <div className="absolute top-0 right-0 w-full h-full" style={{
                    background: "repeating-linear-gradient(135deg, transparent, transparent 20px, rgba(255,255,255,0.1) 20px, rgba(255,255,255,0.1) 22px)"
                  }} />
                </div>
                <h3 className="font-display text-2xl md:text-3xl font-bold text-primary-foreground relative z-10">
                  {plan.speed} {plan.unit}
                </h3>
                {/* Persona */}
                <img
                  src={plan.persona}
                  alt={`Mascote JD Telecom - Plano ${plan.name}`}
                  className="absolute bottom-0 left-1/2 -translate-x-1/2 h-44 object-contain drop-shadow-lg z-10"
                />
              </div>

              {/* Bottom dark section */}
              <div className="bg-[hsl(var(--dark-section))] px-6 pt-6 pb-6">
                {/* Price */}
                <div className="text-center mb-4">
                  <div className="flex items-baseline justify-center gap-1">
                    <span className="text-sm text-[hsl(var(--dark-section-muted))]">R$</span>
                    <span className="font-display text-5xl font-bold text-[hsl(var(--dark-section-fg))]">
                      {plan.price}
                    </span>
                    <span className="text-sm text-[hsl(var(--dark-section-muted))]">,{plan.cents}</span>
                  </div>
                  <p className="text-xs text-[hsl(var(--dark-section-muted))] mt-1">Plano Mensal</p>
                </div>

                {/* Internet badge */}
                <div className="text-center mb-4">
                  <span className="inline-block px-4 py-1.5 rounded-full border border-[hsl(var(--dark-section-border))] text-xs font-semibold text-[hsl(var(--dark-section-fg))] tracking-wide">
                    INTERNET 100% FIBRA ÓPTICA
                  </span>
                </div>

                {/* TV Plus */}
                <div className="text-center mb-4">
                  <p className="text-[hsl(var(--dark-section-fg))] font-bold text-sm">
                    + <span className="bg-primary text-primary-foreground px-2 py-0.5 rounded text-xs font-bold">TV</span>{" "}
                    <span className="font-display text-lg">PLUS</span>{" "}
                    <span className="text-xs text-[hsl(var(--dark-section-muted))]">CANAIS PREMIUM</span>
                  </p>
                </div>

                {/* Features */}
                <ul className="space-y-2 mb-6">
                  {plan.features.map((f) => (
                    <li key={f} className="flex items-center gap-2 text-sm text-[hsl(var(--dark-section-muted))]">
                      <Check className="w-4 h-4 text-primary shrink-0" />
                      {f}
                    </li>
                  ))}
                </ul>

                {/* CTA */}
                <Button
                  className="w-full bg-primary text-primary-foreground hover:bg-primary/90 font-bold text-base py-6 rounded-xl"
                  asChild
                >
                  <a href="https://wa.me/558005945678" target="_blank" rel="noopener noreferrer">
                    EU QUERO
                  </a>
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default PlansSection;
