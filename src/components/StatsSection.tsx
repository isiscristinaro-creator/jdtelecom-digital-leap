import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import { motion } from "framer-motion";
import { MapPin, Activity, Headphones, Trophy } from "lucide-react";
import { useEffect, useState } from "react";

const stats = [
  { value: 11, suffix: "+", label: "Cidades atendidas no AM e PA", icon: MapPin, achievement: "Conquistador" },
  { value: 99.5, suffix: "%", label: "Uptime garantido para sua conexão", icon: Activity, decimal: true, achievement: "Imbatível" },
  { value: 24, suffix: "/7", label: "Suporte técnico disponível sempre", icon: Headphones, achievement: "Sempre On" },
];

const AnimatedCounter = ({ value, suffix, decimal, isVisible }: { value: number; suffix: string; decimal?: boolean; isVisible: boolean }) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!isVisible) return;
    const end = value;
    const duration = 2000;
    const startTime = Date.now();

    const tick = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(decimal ? parseFloat((eased * end).toFixed(1)) : Math.floor(eased * end));
      if (progress < 1) requestAnimationFrame(tick);
    };
    tick();
  }, [isVisible, value, decimal]);

  return (
    <span>
      {decimal ? count.toFixed(1) : count}{suffix}
    </span>
  );
};

const StatsSection = () => {
  const { ref, isVisible } = useScrollAnimation();
  const [hoveredStat, setHoveredStat] = useState<number | null>(null);

  return (
    <section className="bg-dark-section py-0 relative overflow-hidden" ref={ref}>
      {/* Top gradient line - thicker and more vibrant */}
      <div className="h-1.5 bg-gradient-to-r from-primary via-[hsl(15,90%,45%)] to-primary relative">
        <div className="absolute inset-0 bg-gradient-to-r from-primary via-[hsl(15,90%,45%)] to-primary blur-md opacity-60" />
      </div>

      <div className="container mx-auto px-4 py-7 sm:py-12 md:py-20">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 sm:gap-6 md:gap-0 md:divide-x divide-[hsl(var(--dark-section-border))]">
          {stats.map((stat, i) => (
            <motion.div
              key={stat.label}
              className="w-full mx-auto flex flex-col items-center text-center py-4 sm:py-8 md:py-0 px-4 sm:px-6 md:px-8 rounded-2xl md:rounded-none bg-[hsl(var(--dark-section-card))]/40 md:bg-transparent border border-[hsl(var(--dark-section-border))]/60 md:border-0 relative cursor-default min-h-[180px] sm:min-h-0"
              initial={{ opacity: 0, y: 30 }}
              animate={isVisible ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: i * 0.2 }}
              onHoverStart={() => setHoveredStat(i)}
              onHoverEnd={() => setHoveredStat(null)}
            >
              {/* Icon with level-up glow */}
              <motion.div
                className="w-12 h-12 sm:w-[72px] sm:h-[72px] rounded-2xl bg-primary/10 flex items-center justify-center mb-3 sm:mb-5 relative"
                animate={hoveredStat === i ? {
                  boxShadow: [
                    "0 0 0px hsl(24 95% 50% / 0)",
                    "0 0 30px hsl(24 95% 50% / 0.4)",
                    "0 0 0px hsl(24 95% 50% / 0)",
                  ],
                } : {}}
                transition={{ duration: 1.5, repeat: hoveredStat === i ? Infinity : 0 }}
              >
                <stat.icon className="w-6 h-6 sm:w-8 sm:h-8 text-primary" />

                {hoveredStat === i && (
                  <motion.div
                    className="absolute inset-0 rounded-2xl border-2 border-primary/50"
                    initial={{ scale: 1, opacity: 0.5 }}
                    animate={{ scale: 1.5, opacity: 0 }}
                    transition={{ duration: 0.8, repeat: Infinity }}
                  />
                )}
              </motion.div>

              <p className="font-display text-3xl sm:text-5xl md:text-6xl font-extrabold text-primary mb-2 sm:mb-3 leading-none">
                <AnimatedCounter value={stat.value} suffix={stat.suffix} decimal={stat.decimal} isVisible={isVisible} />
              </p>
              <p className="text-[hsl(var(--dark-section-muted))] text-xs sm:text-sm max-w-[210px] sm:max-w-[260px] leading-snug sm:leading-relaxed mx-auto">
                {stat.label}
              </p>

              {hoveredStat === i && (
                <motion.div
                  className="flex items-center gap-1.5 mt-4 bg-primary/15 px-4 py-1.5 rounded-full"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3 }}
                >
                  <Trophy className="w-3.5 h-3.5 text-primary" />
                  <span className="text-[11px] font-bold text-primary uppercase tracking-wider">
                    {stat.achievement}
                  </span>
                </motion.div>
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default StatsSection;
