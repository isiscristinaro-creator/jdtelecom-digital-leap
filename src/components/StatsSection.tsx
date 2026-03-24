import { useScrollAnimation } from "@/hooks/useScrollAnimation";

const stats = [
  { value: "11+", label: "Cidades atendidas no AM e PA" },
  { value: "99.5%", label: "Uptime garantido para sua conexão" },
  { value: "24/7", label: "Suporte técnico disponível sempre" },
];

const StatsSection = () => {
  const { ref, isVisible } = useScrollAnimation();

  return (
    <section className="bg-dark-section py-16" ref={ref}>
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-3 gap-8">
          {stats.map((stat, i) => (
            <div
              key={stat.label}
              className={`text-center md:text-left transition-all duration-600 ${
                isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
              }`}
              style={{ transitionDelay: isVisible ? `${i * 150}ms` : "0ms" }}
            >
              <p className="font-display text-4xl md:text-5xl font-bold text-primary mb-2">
                {stat.value}
              </p>
              <p className="text-[hsl(var(--dark-section-muted))] text-sm">
                {stat.label}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default StatsSection;
