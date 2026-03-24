import { FileText, Phone, Headphones, Monitor, MapPin, MessageSquare, ArrowRight } from "lucide-react";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";

const items = [
  { icon: FileText, title: "2ª via da fatura", desc: "Baixe sua fatura de forma rápida e prática" },
  { icon: Phone, title: "Ligamos para você", desc: "Informe seus dados que entraremos em contato" },
  { icon: Headphones, title: "Central de ajuda", desc: "Tudo que você precisa saber para tirar suas dúvidas" },
  { icon: Monitor, title: "Suporte remoto", desc: "Realizamos o seu atendimento por acesso remoto" },
  { icon: MapPin, title: "Nossas cidades", desc: "Verifique se há cobertura JD Telecom na sua cidade" },
  { icon: MessageSquare, title: "Ouvidoria", desc: "Nossa central está pronta para te receber" },
];

const SelfServiceSection = () => {
  const { ref, isVisible } = useScrollAnimation();

  return (
    <section className="bg-dark-section py-20 md:py-28" ref={ref}>
      <div className="container mx-auto px-4">
        <h2
          className={`font-display text-3xl md:text-4xl lg:text-5xl font-bold text-[hsl(var(--dark-section-fg))] mb-12 transition-all duration-700 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
        >
          Autoatendimento para clientes
        </h2>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6">
          {items.map((item, i) => (
            <a
              key={item.title}
              href="https://wa.me/558005945678"
              target="_blank"
              rel="noopener noreferrer"
              className={`group block p-5 rounded-xl border border-[hsl(var(--dark-section-border))] bg-[hsl(var(--dark-section-card))] hover:border-primary/40 hover:shadow-glow transition-all duration-500 ${
                isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
              }`}
              style={{ transitionDelay: isVisible ? `${i * 80 + 200}ms` : "0ms" }}
            >
              <item.icon className="w-6 h-6 text-[hsl(var(--dark-section-fg))] mb-4" />
              <h3 className="font-display font-semibold text-[hsl(var(--dark-section-fg))] mb-2 text-sm">{item.title}</h3>
              <div className="w-6 h-0.5 bg-primary mb-3" />
              <p className="text-xs text-[hsl(var(--dark-section-muted))] mb-4">{item.desc}</p>
              <ArrowRight className="w-4 h-4 text-primary group-hover:translate-x-1 transition-transform" />
            </a>
          ))}
        </div>
      </div>
    </section>
  );
};

export default SelfServiceSection;
