import { FileText, Gauge, Wrench, ScrollText } from "lucide-react";
import { motion } from "framer-motion";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";

const actions = [
  { icon: FileText, label: "Acesse agora a sua 2ª via de fatura.", href: "https://wa.me/558005945678" },
  { icon: Gauge, label: "Teste a velocidade de sua Internet.", href: "https://wa.me/558005945678" },
  { icon: Wrench, label: "Contate nosso suporte para reparos.", href: "https://wa.me/558005945678" },
  { icon: ScrollText, label: "Acesse nosso contrato.", href: "https://wa.me/558005945678" },
];

const QuickActionsBar = () => {
  const { ref, isVisible } = useScrollAnimation(0.3);

  return (
    <motion.section
      ref={ref}
      className="bg-gradient-to-r from-primary to-[hsl(15,90%,42%)] py-4 md:py-5 relative overflow-hidden"
      initial={{ opacity: 0 }}
      animate={isVisible ? { opacity: 1 } : {}}
      transition={{ duration: 0.5 }}
    >
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
          {actions.map((action, i) => (
            <motion.a
              key={action.label}
              href={action.href}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 group"
              initial={{ opacity: 0, y: 10 }}
              animate={isVisible ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.4, delay: i * 0.1 }}
            >
              <div className="w-10 h-10 rounded-lg bg-primary-foreground/15 flex items-center justify-center shrink-0 group-hover:bg-primary-foreground/25 transition-colors">
                <action.icon className="w-5 h-5 text-primary-foreground" />
              </div>
              <p className="text-xs md:text-sm font-medium text-primary-foreground leading-tight">
                {action.label}
              </p>
            </motion.a>
          ))}
        </div>
      </div>
    </motion.section>
  );
};

export default QuickActionsBar;
