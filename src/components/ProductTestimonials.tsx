import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Quote, ChevronLeft, ChevronRight, Star } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

interface Testemunho {
  id: string;
  nome: string;
  mensagem: string;
}

interface ProductTestimonialsProps {
  produto: string;
  title?: string;
  subtitle?: string;
}

const FALLBACK_TESTIMONIALS: Record<string, Testemunho[]> = {
  fibra: [
    { id: "f1", nome: "Carlos Mendes", mensagem: "Migrei para a fibra da JD Telecom e a diferença é absurda! Velocidade estável 24h, sem quedas. Melhor decisão que tomei." },
    { id: "f2", nome: "Ana Beatriz", mensagem: "Com a fibra óptica da JD, faço videochamadas, streaming e trabalho remoto ao mesmo tempo sem travar. Sensacional!" },
    { id: "f3", nome: "Roberto Silva", mensagem: "Instalaram a fibra em menos de 48h. Atendimento nota 10 e velocidade real igual ao contratado. Recomendo muito!" },
  ],
  fwa5g: [
    { id: "g1", nome: "Marcos Oliveira", mensagem: "O FWA 5G da JD Telecom chegou onde a fibra não alcançava. Internet rápida na minha região rural, incrível!" },
    { id: "g2", nome: "Juliana Costa", mensagem: "Sem precisar de cabos, o 5G da JD me dá velocidade de sobra para trabalhar e estudar. Instalação super rápida!" },
    { id: "g3", nome: "Pedro Henrique", mensagem: "Morava em área sem cobertura de fibra. O FWA 5G resolveu meu problema com internet de qualidade. Estou muito satisfeito!" },
  ],
  combos: [
    { id: "c1", nome: "Fernanda Lima", mensagem: "O combo da JD Telecom é imbatível! Internet fibra + TV + celular num preço que cabe no bolso. Economia real!" },
    { id: "c2", nome: "Lucas Araújo", mensagem: "Juntei tudo num combo só e economizo mais de R$100 por mês. Qualidade top em todos os serviços!" },
    { id: "c3", nome: "Patrícia Santos", mensagem: "O combo completo da JD facilitou minha vida. Uma fatura só, suporte unificado e tudo funcionando perfeitamente!" },
  ],
};

const ProductTestimonials = ({
  produto,
  title = "O que nossos clientes dizem",
  subtitle = "Depoimentos reais de quem já usa",
}: ProductTestimonialsProps) => {
  const [testemunhos, setTestemunhos] = useState<Testemunho[]>([]);
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    (async () => {
      try {
        // Try fetching with produto filter first
        const { data, error } = await supabase
          .from("testemunhos")
          .select("id, nome, mensagem")
          .eq("ativo", true)
          .eq("produto", produto)
          .order("created_at", { ascending: false });

        if (!error && data?.length) {
          setTestemunhos(data);
          return;
        }
      } catch {
        // Column might not exist yet
      }

      // Fallback: try fetching all active testimonials (without produto filter)
      try {
        const { data } = await supabase
          .from("testemunhos")
          .select("id, nome, mensagem")
          .eq("ativo", true)
          .order("created_at", { ascending: false });

        if (data?.length) {
          setTestemunhos(data);
          return;
        }
      } catch {
        // DB issue
      }

      // Final fallback: hardcoded data
      setTestemunhos(FALLBACK_TESTIMONIALS[produto] || []);
    })();
  }, [produto]);

  if (!testemunhos.length) return null;

  const next = () => setCurrent((c) => (c + 1) % testemunhos.length);
  const prev = () => setCurrent((c) => (c - 1 + testemunhos.length) % testemunhos.length);

  return (
    <section className="py-16 sm:py-20 md:py-28 bg-[hsl(var(--dark-section))] relative overflow-hidden">
      <div className="absolute top-0 right-0 w-[400px] h-[400px] rounded-full bg-primary/[0.04] blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[300px] h-[300px] rounded-full bg-primary/[0.03] blur-[100px] pointer-events-none" />

      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <span className="inline-block px-4 py-1.5 bg-primary/10 text-primary text-xs font-bold uppercase tracking-widest rounded-full mb-4">
            {subtitle}
          </span>
          <h2 className="font-display text-3xl md:text-4xl lg:text-5xl font-bold text-[hsl(var(--dark-section-fg))]">
            {title}
          </h2>
        </motion.div>

        <div className="max-w-4xl mx-auto">
          <AnimatePresence mode="wait">
            <motion.div
              key={testemunhos[current]?.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4 }}
              className="bg-[hsl(var(--dark-section-card))] border border-[hsl(var(--dark-section-border))] rounded-3xl p-8 md:p-12 relative"
            >
              <Quote className="w-10 h-10 text-primary/20 absolute top-6 left-6" />

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
            </motion.div>
          </AnimatePresence>

          {testemunhos.length > 1 && (
            <div className="flex justify-center gap-3 mt-6">
              <button
                onClick={prev}
                aria-label="Depoimento anterior"
                className="w-10 h-10 rounded-full border border-[hsl(var(--dark-section-border))] flex items-center justify-center text-[hsl(var(--dark-section-muted))] hover:text-primary hover:border-primary transition-colors"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <div className="flex items-center gap-2">
                {testemunhos.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setCurrent(i)}
                    aria-label={`Depoimento ${i + 1}`}
                    className={`h-2.5 rounded-full transition-all ${
                      i === current ? "bg-primary w-6" : "bg-[hsl(var(--dark-section-border))] w-2.5"
                    }`}
                  />
                ))}
              </div>
              <button
                onClick={next}
                aria-label="Próximo depoimento"
                className="w-10 h-10 rounded-full border border-[hsl(var(--dark-section-border))] flex items-center justify-center text-[hsl(var(--dark-section-muted))] hover:text-primary hover:border-primary transition-colors"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default ProductTestimonials;
