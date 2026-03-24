import { FileText, Gauge, Wrench, ScrollText, Zap } from "lucide-react";
import { motion } from "framer-motion";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import { useState } from "react";

const actions = [
  { icon: FileText, label: "Acesse agora a sua 2ª via de fatura.", href: "https://wa.me/558005945678", xp: "+10 XP" },
  { icon: Gauge, label: "Teste a velocidade de sua Internet.", href: "https://wa.me/558005945678", xp: "+15 XP" },
  { icon: Wrench, label: "Contate nosso suporte para reparos.", href: "https://wa.me/558005945678", xp: "+20 XP" },
  { icon: ScrollText, label: "Acesse nosso contrato.", href: "https://wa.me/558005945678", xp: "+5 XP" },
];

const QuickActionsBar = () => {
  const { ref, isVisible } = useScrollAnimation(0.3);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [clickedIndex, setClickedIndex] = useState<number | null>(null);

  const handleClick = (i: number) => {
    setClickedIndex(i);
    setTimeout(() => setClickedIndex(null), 800);
  };

  return (
    <motion.section
      ref={ref}
      className="bg-gradient-to-r from-primary to-[hsl(15,90%,42%)] py-4 md:py-5 relative overflow-hidden"
      initial={{ opacity: 0 }}
      animate={isVisible ? { opacity: 1 } : {}}
      transition={{ duration: 0.5 }}
    >
      {/* Animated particle lines */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(6)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute h-px bg-primary-foreground/10"
            style={{
              top: `${15 + i * 15}%`,
              left: 0,
              right: 0,
            }}
            animate={{
              opacity: [0.05, 0.15, 0.05],
              scaleX: [0.8, 1, 0.8],
            }}
            transition={{
              duration: 3 + i * 0.5,
              repeat: Infinity,
              ease: "easeInOut",
              delay: i * 0.4,
            }}
          />
        ))}
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
          {actions.map((action, i) => (
            <motion.a
              key={action.label}
              href={action.href}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 group relative"
              initial={{ opacity: 0, y: 10 }}
              animate={isVisible ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.4, delay: i * 0.1 }}
              onHoverStart={() => setHoveredIndex(i)}
              onHoverEnd={() => setHoveredIndex(null)}
              onClick={() => handleClick(i)}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
            >
              {/* Icon with glow pulse on hover */}
              <motion.div
                className="w-10 h-10 rounded-lg bg-primary-foreground/15 flex items-center justify-center shrink-0 relative"
                animate={hoveredIndex === i ? {
                  boxShadow: [
                    "0 0 0px hsl(0 0% 100% / 0)",
                    "0 0 15px hsl(0 0% 100% / 0.3)",
                    "0 0 0px hsl(0 0% 100% / 0)",
                  ],
                } : {}}
                transition={{ duration: 1, repeat: hoveredIndex === i ? Infinity : 0 }}
              >
                <action.icon className="w-5 h-5 text-primary-foreground" />

                {/* Ring burst on hover */}
                {hoveredIndex === i && (
                  <motion.div
                    className="absolute inset-0 rounded-lg border-2 border-primary-foreground/40"
                    initial={{ scale: 1, opacity: 0.6 }}
                    animate={{ scale: 1.5, opacity: 0 }}
                    transition={{ duration: 0.6, repeat: Infinity }}
                  />
                )}
              </motion.div>

              <p className="text-xs md:text-sm font-medium text-primary-foreground leading-tight">
                {action.label}
              </p>

              {/* XP badge on click */}
              {clickedIndex === i && (
                <motion.span
                  className="absolute -top-3 right-2 text-[10px] font-bold text-primary-foreground flex items-center gap-0.5"
                  initial={{ opacity: 1, y: 0 }}
                  animate={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.7 }}
                >
                  <Zap className="w-3 h-3" />
                  {action.xp}
                </motion.span>
              )}
            </motion.a>
          ))}
        </div>
      </div>
    </motion.section>
  );
};

export default QuickActionsBar;
