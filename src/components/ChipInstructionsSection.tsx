import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import { motion } from "framer-motion";
import instrucoes from "@/assets/instrucoes-chip.jpeg";
import { Smartphone, Wifi, Signal } from "lucide-react";

const ChipInstructionsSection = () => {
  const { ref, isVisible } = useScrollAnimation();

  return (
    <section id="chip" className="py-16 sm:py-20 md:py-32 lg:py-40 relative overflow-hidden">
      {/* Rich gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary via-[hsl(20,92%,45%)] to-[hsl(10,80%,35%)]" />
      
      {/* Mesh overlay for depth */}
      <div className="absolute inset-0 opacity-30" style={{
        backgroundImage: `radial-gradient(circle at 20% 50%, hsl(24 95% 60% / 0.4) 0%, transparent 50%),
                          radial-gradient(circle at 80% 20%, hsl(0 0% 100% / 0.1) 0%, transparent 40%),
                          radial-gradient(circle at 60% 80%, hsl(15 90% 40% / 0.5) 0%, transparent 50%)`
      }} />

      {/* Animated floating orbs */}
      <motion.div
        className="absolute top-10 left-[10%] w-48 h-48 sm:w-72 sm:h-72 rounded-full bg-white/[0.06] blur-[80px]"
        animate={{ y: [0, -30, 0], x: [0, 20, 0] }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute bottom-10 right-[10%] w-56 h-56 sm:w-96 sm:h-96 rounded-full bg-black/[0.08] blur-[100px]"
        animate={{ y: [0, 20, 0], x: [0, -15, 0] }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
      />

      {/* Geometric decorations */}
      <motion.div
        className="absolute top-20 right-[15%] hidden sm:block w-24 h-24 border-2 border-white/[0.08] rounded-3xl"
        animate={{ rotate: [0, 90, 180, 270, 360] }}
        transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
      />
      <motion.div
        className="absolute bottom-28 left-[8%] hidden sm:block w-16 h-16 border-2 border-white/[0.06] rounded-full"
        animate={{ scale: [1, 1.4, 1], opacity: [0.06, 0.15, 0.06] }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute top-1/2 right-[5%] hidden sm:block w-3 h-3 bg-white/20 rounded-full"
        animate={{ y: [0, -40, 0] }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
      />

      <div className="container mx-auto px-4 relative z-10" ref={ref}>
        {/* Header */}
        <motion.div
          className="text-center mb-12 sm:mb-16 md:mb-20"
          initial={{ opacity: 0, y: 30 }}
          animate={isVisible ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
        >
          <motion.span
            className="inline-flex items-center gap-2 bg-white/[0.12] backdrop-blur-xl text-primary-foreground text-xs sm:text-sm font-bold px-5 sm:px-6 py-2.5 rounded-full mb-6 border border-white/20 shadow-lg"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={isVisible ? { opacity: 1, scale: 1 } : {}}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <Signal className="w-3.5 h-3.5" />
            REDE MÓVEL 4G • 5G
          </motion.span>
          <h2 className="font-display text-2xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-primary-foreground mb-5 sm:mb-6 leading-[1.05]">
            Ative seu chip seguindo
            <br className="hidden md:block" />
            <span className="relative inline-block mt-1">
              nossas instruções
              <motion.div
                className="absolute -bottom-2 left-0 right-0 h-1 bg-white/30 rounded-full"
                initial={{ scaleX: 0 }}
                animate={isVisible ? { scaleX: 1 } : {}}
                transition={{ duration: 0.8, delay: 0.5 }}
              />
            </span>
          </h2>
          <p className="text-primary-foreground/85 text-base sm:text-lg md:text-xl max-w-2xl mx-auto leading-relaxed px-2 sm:px-0">
            Com a <strong className="text-primary-foreground font-bold">JD MÓVEL</strong> você não tem fronteiras!
          </p>
        </motion.div>

        {/* Main card with 3D perspective */}
        <motion.div
          className="max-w-4xl mx-auto px-1 sm:px-0"
          initial={{ opacity: 0, y: 60, rotateX: 8 }}
          animate={isVisible ? { opacity: 1, y: 0, rotateX: 0 } : {}}
          transition={{ duration: 1, delay: 0.25, ease: [0.16, 1, 0.3, 1] }}
          style={{ perspective: "1200px" }}
        >
          <div className="relative group">
            {/* Outer glow */}
            <div className="absolute -inset-4 bg-gradient-to-r from-white/10 via-white/20 to-white/10 rounded-[2rem] blur-xl opacity-0 group-hover:opacity-100 transition-all duration-700" />
            
            {/* Card shadow */}
            <div className="absolute -inset-1 bg-black/20 rounded-[2rem] blur-2xl translate-y-4" />
            
            {/* Card */}
            <motion.div
              className="relative rounded-[1.25rem] sm:rounded-[1.75rem] overflow-hidden bg-white shadow-2xl border border-white/30"
              whileHover={{ scale: 1.01, rotateY: 1, rotateX: -1 }}
              transition={{ duration: 0.5, ease: "easeOut" }}
              style={{ transformStyle: "preserve-3d" }}
            >
              {/* Shine effect on hover */}
              <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none z-10" />
              
              <img
                src={instrucoes}
                alt="Instruções de ativação do chip JD Móvel - Frente e verso do cartão SIM com passo a passo"
                className="w-full h-auto block"
              />
            </motion.div>
          </div>
        </motion.div>

        {/* Feature pills below card */}
        <motion.div
          className="flex flex-wrap justify-center gap-3 sm:gap-4 mt-10 sm:mt-12"
          initial={{ opacity: 0, y: 20 }}
          animate={isVisible ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.6 }}
        >
          {[
            { icon: Smartphone, label: "Chip Universal" },
            { icon: Wifi, label: "4G & 5G" },
            { icon: Signal, label: "Cobertura Nacional" },
          ].map((item, i) => (
            <motion.div
              key={item.label}
              className="w-full sm:w-auto justify-center flex items-center gap-2 bg-white/[0.1] backdrop-blur-lg text-primary-foreground/90 text-xs sm:text-sm font-medium px-4 sm:px-5 py-2.5 rounded-full border border-white/15"
              whileHover={{ scale: 1.05, backgroundColor: "rgba(255,255,255,0.18)" }}
              initial={{ opacity: 0, y: 10 }}
              animate={isVisible ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.4, delay: 0.7 + i * 0.1 }}
            >
              <item.icon className="w-4 h-4" />
              {item.label}
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default ChipInstructionsSection;
