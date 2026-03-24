import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import { motion } from "framer-motion";
import instrucoes from "@/assets/instrucoes-chip.jpeg";

const ChipInstructionsSection = () => {
  const { ref, isVisible } = useScrollAnimation();

  return (
    <section id="chip" className="py-20 md:py-28 bg-gradient-to-br from-primary to-[hsl(15,85%,42%)] relative overflow-hidden">
      {/* Background pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0" style={{
          backgroundImage: "radial-gradient(circle at 20% 50%, rgba(255,255,255,0.3) 0%, transparent 50%)"
        }} />
      </div>

      <div className="container mx-auto px-4 relative z-10" ref={ref}>
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          animate={isVisible ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
        >
          <span className="inline-block bg-primary-foreground/20 backdrop-blur-sm text-primary-foreground text-xs font-bold px-4 py-1.5 rounded-full mb-4">
            REDE MÓVEL 4G • 5G
          </span>
          <h2 className="font-display text-3xl md:text-4xl lg:text-5xl font-bold text-primary-foreground mb-4">
            Ative seu chip seguindo nossas instruções
          </h2>
          <p className="text-primary-foreground/80 text-lg max-w-2xl mx-auto">
            Com a <strong>JD MÓVEL</strong> você não tem fronteiras!
          </p>
        </motion.div>

        <motion.div
          className="max-w-4xl mx-auto"
          initial={{ opacity: 0, y: 30 }}
          animate={isVisible ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, delay: 0.2 }}
        >
          <div className="rounded-2xl overflow-hidden shadow-2xl bg-white">
            <img
              src={instrucoes}
              alt="Instruções de ativação do chip JD Móvel - Frente e verso do cartão SIM com passo a passo"
              className="w-full h-auto block"
            />
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default ChipInstructionsSection;
