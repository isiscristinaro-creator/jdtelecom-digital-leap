import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import { motion } from "framer-motion";
import instrucoes from "@/assets/instrucoes-chip.jpeg";

const ChipInstructionsSection = () => {
  const { ref, isVisible } = useScrollAnimation();

  return (
    <section id="chip" className="py-24 md:py-32 bg-gradient-to-br from-primary via-[hsl(20,92%,48%)] to-[hsl(15,85%,42%)] relative overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-[500px] h-[500px] rounded-full bg-white/5 blur-[100px]" />
        <div className="absolute bottom-0 right-1/4 w-[400px] h-[400px] rounded-full bg-black/10 blur-[80px]" />
        {/* Geometric shapes */}
        <motion.div
          className="absolute top-20 right-20 w-20 h-20 border border-white/10 rounded-2xl"
          animate={{ rotate: [0, 90, 0] }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
        />
        <motion.div
          className="absolute bottom-32 left-16 w-12 h-12 border border-white/10 rounded-full"
          animate={{ scale: [1, 1.3, 1], opacity: [0.1, 0.2, 0.1] }}
          transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
        />
      </div>

      <div className="container mx-auto px-4 relative z-10" ref={ref}>
        <motion.div
          className="text-center mb-14"
          initial={{ opacity: 0, y: 20 }}
          animate={isVisible ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
        >
          <span className="inline-block bg-white/15 backdrop-blur-md text-primary-foreground text-xs font-bold px-5 py-2 rounded-full mb-5 border border-white/20">
            REDE MÓVEL 4G • 5G
          </span>
          <h2 className="font-display text-4xl md:text-5xl lg:text-[3.5rem] font-bold text-primary-foreground mb-5 leading-[1.1]">
            Ative seu chip seguindo{" "}
            <br className="hidden md:block" />
            nossas instruções
          </h2>
          <p className="text-primary-foreground/80 text-lg md:text-xl max-w-2xl mx-auto">
            Com a <strong className="text-primary-foreground">JD MÓVEL</strong> você não tem fronteiras!
          </p>
        </motion.div>

        <motion.div
          className="max-w-4xl mx-auto"
          initial={{ opacity: 0, y: 40 }}
          animate={isVisible ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <div className="rounded-3xl overflow-hidden shadow-2xl bg-white relative group">
            {/* Glow effect */}
            <div className="absolute -inset-1 bg-gradient-to-r from-white/20 via-white/40 to-white/20 rounded-3xl blur-sm opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />
            <div className="relative">
              <img
                src={instrucoes}
                alt="Instruções de ativação do chip JD Móvel - Frente e verso do cartão SIM com passo a passo"
                className="w-full h-auto block"
              />
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default ChipInstructionsSection;
