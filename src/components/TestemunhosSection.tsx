import { useState, useCallback } from "react";
import { motion } from "framer-motion";
import { Quote, ChevronLeft, ChevronRight, Star, AlertTriangle, MessageSquareOff, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getTestimonialAvatar } from "@/data/testimonialAvatars";
import { useHomeTestemunhos } from "@/hooks/supabase/useHomeTestemunhos";

const TestemunhosSection = () => {
  const { testemunhos, loading, error, refetch } = useHomeTestemunhos();
  const [current, setCurrent] = useState(0);

  const next = useCallback(
    () => setCurrent((c) => (testemunhos.length ? (c + 1) % testemunhos.length : 0)),
    [testemunhos.length]
  );
  const prev = useCallback(
    () =>
      setCurrent((c) =>
        testemunhos.length ? (c - 1 + testemunhos.length) % testemunhos.length : 0
      ),
    [testemunhos.length]
  );

  if (error) {
    return (
      <section className="py-16 sm:py-20 md:py-28 bg-[hsl(var(--dark-section))] relative overflow-hidden">
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-md mx-auto text-center bg-[hsl(var(--dark-section-card))] border border-destructive/30 rounded-3xl p-8 md:p-10">
            <div className="w-14 h-14 rounded-2xl bg-destructive/10 border border-destructive/20 flex items-center justify-center mx-auto mb-5">
              <AlertTriangle className="w-7 h-7 text-destructive" aria-hidden="true" />
            </div>
            <h2 className="font-display text-xl md:text-2xl font-bold text-[hsl(var(--dark-section-fg))] mb-2">
              Não foi possível carregar os depoimentos
            </h2>
            <p className="text-sm text-[hsl(var(--dark-section-muted))] mb-6">
              Houve um problema ao buscar avaliações de clientes. Tente novamente.
            </p>
            <Button
              onClick={() => refetch()}
              className="bg-primary text-primary-foreground hover:bg-primary/90 font-bold rounded-2xl px-6"
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              Tentar novamente
            </Button>
          </div>
        </div>
      </section>
    );
  }

  if (!loading && !testemunhos.length) {
    return (
      <section className="py-16 sm:py-20 md:py-28 bg-[hsl(var(--dark-section))] relative overflow-hidden">
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-md mx-auto text-center bg-[hsl(var(--dark-section-card))] border border-[hsl(var(--dark-section-border))] rounded-3xl p-8 md:p-10">
            <div className="w-14 h-14 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center mx-auto mb-5">
              <MessageSquareOff className="w-7 h-7 text-primary" aria-hidden="true" />
            </div>
            <h2 className="font-display text-xl md:text-2xl font-bold text-[hsl(var(--dark-section-fg))] mb-2">
              Seja o primeiro a avaliar
            </h2>
            <p className="text-sm text-[hsl(var(--dark-section-muted))]">
              Ainda não temos depoimentos publicados. Em breve, novos comentários de clientes.
            </p>
          </div>
        </div>
      </section>
    );
  }

  // Skeleton loader durante carregamento inicial
  if (loading && !testemunhos.length) {
    return (
      <section
        className="py-16 sm:py-20 md:py-28 bg-[hsl(var(--dark-section))] relative overflow-hidden"
        aria-busy="true"
        aria-label="Carregando depoimentos"
      >
        <div className="absolute top-0 left-0 w-[500px] h-[500px] rounded-full bg-primary/[0.04] blur-[120px] pointer-events-none" />
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center mb-12">
            <div className="h-6 w-32 rounded-full bg-[hsl(var(--dark-section-card))] animate-pulse mx-auto mb-4" />
            <div className="h-10 md:h-12 w-80 max-w-full rounded-xl bg-[hsl(var(--dark-section-card))] animate-pulse mx-auto" />
          </div>
          <div className="max-w-3xl mx-auto">
            <div className="bg-[hsl(var(--dark-section-card))] border border-[hsl(var(--dark-section-border))] rounded-3xl p-8 md:p-12">
              <div className="flex justify-center gap-1 mb-6">
                {[0, 1, 2, 3, 4].map((i) => (
                  <div
                    key={i}
                    className="w-5 h-5 rounded bg-[hsl(var(--dark-section-border))] animate-pulse"
                    style={{ animationDelay: `${i * 80}ms` }}
                  />
                ))}
              </div>
              <div className="space-y-3 mb-8">
                <div className="h-5 w-full rounded-lg bg-[hsl(var(--dark-section-border))] animate-pulse" />
                <div className="h-5 w-11/12 mx-auto rounded-lg bg-[hsl(var(--dark-section-border))] animate-pulse" />
                <div className="h-5 w-3/4 mx-auto rounded-lg bg-[hsl(var(--dark-section-border))] animate-pulse" />
              </div>
              <div className="flex items-center justify-center gap-3">
                <div className="w-12 h-12 rounded-full bg-[hsl(var(--dark-section-border))] animate-pulse" />
                <div className="space-y-2">
                  <div className="h-4 w-32 rounded bg-[hsl(var(--dark-section-border))] animate-pulse" />
                  <div className="h-3 w-24 rounded bg-[hsl(var(--dark-section-border))] animate-pulse" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  }

  if (!testemunhos.length) return null;

  return (
    <section className="py-16 sm:py-20 md:py-28 bg-[hsl(var(--dark-section))] relative overflow-hidden">
      <div className="absolute top-0 left-0 w-[500px] h-[500px] rounded-full bg-primary/[0.04] blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-[400px] h-[400px] rounded-full bg-primary/[0.03] blur-[100px] pointer-events-none" />

      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
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
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
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
                <img
                  src={getTestimonialAvatar(testemunhos[current]?.nome || "")}
                  alt={testemunhos[current]?.nome}
                  className="w-12 h-12 rounded-full object-cover border-2 border-primary/30"
                  loading="lazy"
                  width={48}
                  height={48}
                />
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
