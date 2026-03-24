import { Wifi, Tv, Phone, Radio } from "lucide-react";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";

const services = [
  { icon: Wifi, title: "Internet Fibra", description: "Serviços de internet 100% fibra óptica com altíssima velocidade e estabilidade." },
  { icon: Radio, title: "Móvel 4G/5G", description: "Planos móveis com cobertura ampla e internet de qualidade para o seu dia a dia." },
  { icon: Tv, title: "TV por Assinatura", description: "Canais de TV ao vivo, filmes e séries com qualidade digital para toda a família." },
  { icon: Phone, title: "Telefonia Fixa", description: "Ligações locais e interurbanas com tarifas acessíveis e qualidade de áudio." },
];

const ServicesSection = () => {
  const { ref, isVisible } = useScrollAnimation();

  return (
    <section className="bg-dark-section py-20 md:py-28" ref={ref}>
      <div className="container mx-auto px-4">
        <h2
          className={`font-display text-3xl md:text-4xl lg:text-5xl font-bold text-[hsl(var(--dark-section-fg))] mb-4 transition-all duration-700 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
        >
          Conheça nossos serviços
        </h2>
        <p
          className={`text-[hsl(var(--dark-section-muted))] text-lg mb-12 max-w-xl transition-all duration-700 delay-100 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
        >
          A JD Telecom tem diversos serviços para você e sua família aproveitarem
        </p>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {services.map((s, i) => (
            <div
              key={s.title}
              className={`group p-6 rounded-xl border border-[hsl(var(--dark-section-border))] hover:border-primary/40 bg-[hsl(var(--dark-section-card))] hover:shadow-glow transition-all duration-500 ${
                isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
              }`}
              style={{ transitionDelay: isVisible ? `${i * 100 + 200}ms` : "0ms" }}
            >
              <div className="w-16 h-16 rounded-xl bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                <s.icon className="w-8 h-8 text-primary" />
              </div>
              <div className="w-8 h-0.5 bg-primary mb-3" />
              <h3 className="font-display font-semibold text-[hsl(var(--dark-section-fg))] mb-2">{s.title}</h3>
              <p className="text-sm text-[hsl(var(--dark-section-muted))]">{s.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ServicesSection;
