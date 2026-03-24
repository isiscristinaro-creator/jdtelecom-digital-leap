import { Zap, Shield, Headphones, MapPin, Wifi, Clock } from "lucide-react";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import personaWalk from "@/assets/persona-female-walk.png";

const benefits = [
  { icon: Zap, title: "Alta Velocidade", description: "Conexão ultra rápida com fibra óptica de última geração para streaming, jogos e trabalho remoto." },
  { icon: Shield, title: "Conexão Estável", description: "Infraestrutura robusta garantindo 99.5% de uptime para você não ficar desconectado." },
  { icon: Headphones, title: "Suporte Rápido", description: "Equipe técnica disponível 24 horas por dia, 7 dias por semana. Atendimento humanizado." },
  { icon: MapPin, title: "Cobertura Regional", description: "Presente em 11+ cidades do Amazonas e Pará, levando internet de qualidade ao Norte do Brasil." },
  { icon: Wifi, title: "Wi-Fi de Qualidade", description: "Roteadores modernos que cobrem toda a sua casa com sinal forte e estável." },
  { icon: Clock, title: "Instalação Rápida", description: "Equipe própria para instalação ágil. Seu plano funcionando em até 48 horas." },
];

const BenefitsSection = () => {
  const { ref, isVisible } = useScrollAnimation();

  return (
    <section id="beneficios" className="py-20 md:py-28 bg-background overflow-hidden">
      <div className="container mx-auto px-4" ref={ref}>
        <div className="grid lg:grid-cols-3 gap-12 items-center">
          {/* Left column */}
          <div className="lg:col-span-2">
            <div
              className={`mb-12 transition-all duration-700 ${
                isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
              }`}
            >
              <h2 className="font-display text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-4">
                Por que escolher a <span className="text-primary">JD Telecom</span>?
              </h2>
              <p className="text-muted-foreground text-lg max-w-2xl">
                Compromisso com qualidade, velocidade e atendimento de excelência para a região Norte.
              </p>
            </div>

            <div className="grid sm:grid-cols-2 gap-6">
              {benefits.map((b, i) => (
                <div
                  key={b.title}
                  className={`flex gap-4 p-5 rounded-xl border border-border hover:border-primary/30 hover:shadow-card transition-all duration-500 group ${
                    isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
                  }`}
                  style={{ transitionDelay: isVisible ? `${i * 100 + 200}ms` : "0ms" }}
                >
                  <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center shrink-0 group-hover:bg-primary/20 transition-colors">
                    <b.icon className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-display font-semibold text-foreground mb-1">{b.title}</h3>
                    <p className="text-sm text-muted-foreground">{b.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right - persona */}
          <div
            className={`hidden lg:flex justify-center transition-all duration-700 delay-500 ${
              isVisible ? "opacity-100 translate-x-0 scale-100" : "opacity-0 translate-x-12 scale-95"
            }`}
          >
            <img
              src={personaWalk}
              alt="Mascote JD Telecom"
              className="h-[450px] object-contain drop-shadow-2xl"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default BenefitsSection;
