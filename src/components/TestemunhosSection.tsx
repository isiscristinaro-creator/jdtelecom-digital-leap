import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Quote, ChevronLeft, ChevronRight, Star } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

interface Testemunho {
  id: string;
  nome: string;
  mensagem: string;
}

const TestemunhosSection = () => {
  const [testemunhos, setTestemunhos] = useState<Testemunho[]>([]);
  const [current, setCurrent] = useState(0);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    (async () => {
      const { data } = await supabase
        .from("testemunhos")
        .select("id, nome, mensagem")
        .eq("ativo", true)
        .order("created_at", { ascending: false });
      if (data?.length) {
        setTestemunhos(data);
        setLoaded(true);
      }
    })();
  }, []);

  if (!testemunhos.length) return null;

  const next = () => setCurrent((c) => (c + 1) % testemunhos.length);
  const prev = () => setCurrent((c) => (c - 1 + testemunhos.length) % testemunhos.length);

  return (
    <section className="py-16 sm:py-20 md:py-28 bg-[hsl(var(--dark-section))] relative overflow-hidden">
      <div className="absolute top-0 left-0 w-[500px] h-[500px] rounded-full bg-primary/[0.04] blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-[400px] h-[400px] rounded-full bg-primary/[0.03] blur-[100px] pointer-events-none" />

      <div className="container mx-auto px-4 relative z-10" ref={ref}>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isVisible ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <span className="inline-block px-4 py-1.5 bg-primary/10 text-primary text-xs font-bold uppercase tracking-widest rounded-full mb-4">
            Depoimentos
          </span>
          <h2 className="font-display text-3xl md:text-4xl lg:text-5xl font-bold text-[hsl(var(--dark-section-fg))]">
            O que nossos clientes dizem
          </h2>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={isVisible ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="max-w-3xl mx-auto"
        >
          <div className="bg-[hsl(var(--dark-section-card))] border border-[hsl(var(--dark-section-border))] rounded-3xl p-8 md:p-12 relative">
            <Quote className="w-10 h-10 text-primary/30 absolute top-6 left-6" />
            
            <div className="text-center pt-6">
              <div className="flex justify-center gap-1 mb-6">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 fill-primary text-primary" />
                ))}
              </div>
              
              <p className="text-lg md:text-xl text-[hsl(var(--dark-section-muted))] italic leading-relaxed mb-8">
                "{testemunhos[current]?.mensagem}"
              </p>
              
              <div className="flex items-center justify-center gap-3">
                <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold text-lg">
                  {testemunhos[current]?.nome.charAt(0)}
                </div>
                <div className="text-left">
                  <p className="font-display font-bold text-[hsl(var(--dark-section-fg))]">
                    {testemunhos[current]?.nome}
                  </p>
                  <p className="text-xs text-[hsl(var(--dark-section-muted))]">Cliente JD Telecom</p>
                </div>
              </div>
            </div>

            {testemunhos.length > 1 && (
              <div className="flex justify-center gap-3 mt-8">
                <button
                  onClick={prev}
                  className="w-10 h-10 rounded-full border border-[hsl(var(--dark-section-border))] flex items-center justify-center text-[hsl(var(--dark-section-muted))] hover:text-primary hover:border-primary transition-colors"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <div className="flex items-center gap-2">
                  {testemunhos.map((_, i) => (
                    <button
                      key={i}
                      onClick={() => setCurrent(i)}
                      className={`w-2.5 h-2.5 rounded-full transition-all ${
                        i === current ? "bg-primary w-6" : "bg-[hsl(var(--dark-section-border))]"
                      }`}
                    />
                  ))}
                </div>
                <button
                  onClick={next}
                  className="w-10 h-10 rounded-full border border-[hsl(var(--dark-section-border))] flex items-center justify-center text-[hsl(var(--dark-section-muted))] hover:text-primary hover:border-primary transition-colors"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default TestemunhosSection;
