import { useState, useEffect, useRef, useMemo } from "react";
import { motion } from "framer-motion";
import { Sparkles, ArrowRight, Tag } from "lucide-react";
import Autoplay from "embla-carousel-autoplay";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { parseBannerTitulo, safeBannerHref, isHeroTitulo } from "@/lib/bannerMeta";

interface Banner {
  id: string;
  titulo: string;
  imagem_url: string;
}

const CAROUSEL_THRESHOLD = 5;

const BannersSection = () => {
  const [banners, setBanners] = useState<Banner[]>([]);
  const { ref, isVisible } = useScrollAnimation();
  const autoplayRef = useRef(
    Autoplay({ delay: 4500, stopOnInteraction: false, stopOnMouseEnter: true })
  );

  useEffect(() => {
    (async () => {
      const { data, error } = await supabase
        .from("banners")
        .select("id, titulo, imagem_url")
        .eq("ativo", true)
        .order("created_at", { ascending: false });
      // BUGFIX: erros do Supabase eram silenciados (sem feedback ao dev).
      if (error) {
        console.error("[BannersSection] erro ao carregar banners:", error.message);
        return;
      }
      // Exclui banners destinados ao Hero
      const ofertas = (data || []).filter((b) => !isHeroTitulo(b.titulo));
      setBanners(ofertas);
    })();
  }, []);

  // Memoiza derivações pesadas: parse de títulos só re-executa se banners mudar
  const derived = useMemo(() => {
    if (!banners.length) return null;
    const useCarousel = banners.length > CAROUSEL_THRESHOLD;
    const destaqueIdx = banners.findIndex((b) => parseBannerTitulo(b.titulo).destaque);
    const featured = destaqueIdx >= 0 ? banners[destaqueIdx] : banners[0];
    const featuredMeta = parseBannerTitulo(featured.titulo);
    const rest = banners.filter((b) => b.id !== featured.id);
    return { useCarousel, featured, featuredMeta, rest };
  }, [banners]);

  if (!derived) return null;
  const { useCarousel, featured, featuredMeta, rest } = derived;

  return (
    <section
      id="ofertas-especiais"
      className="relative py-24 md:py-32 bg-dark-section overflow-hidden"
      ref={ref}
    >
      {/* Ambient glows */}
      <div className="absolute top-0 left-1/4 w-[600px] h-[400px] bg-primary/[0.05] blur-[140px] pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-[500px] h-[350px] bg-primary/[0.04] blur-[120px] pointer-events-none" />

      <div
        className="absolute inset-0 opacity-[0.015] pointer-events-none"
        style={{
          backgroundImage:
            "linear-gradient(hsl(var(--dark-section-fg)) 1px, transparent 1px), linear-gradient(90deg, hsl(var(--dark-section-fg)) 1px, transparent 1px)",
          backgroundSize: "60px 60px",
        }}
      />

      <div className="container mx-auto px-4 relative z-10">
        {/* Header */}
        <motion.div
          className="flex flex-col md:flex-row md:items-end md:justify-between mb-14 gap-6"
          initial={{ opacity: 0, y: 20 }}
          animate={isVisible ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
        >
          <div>
            <span className="inline-flex items-center gap-2 px-4 py-1.5 bg-primary/10 border border-primary/20 text-primary text-[11px] font-bold uppercase tracking-[0.2em] rounded-full mb-4">
              <Sparkles className="w-3 h-3" />
              Promoções
            </span>
            <h2 className="font-display text-2xl sm:text-4xl md:text-5xl lg:text-[3.5rem] font-bold text-[hsl(var(--dark-section-fg))] mb-3 leading-[1.1]">
              Ofertas Especiais
            </h2>
            <p className="text-[hsl(var(--dark-section-muted))] text-lg max-w-xl">
              Condições exclusivas selecionadas para você economizar mais.
            </p>
          </div>
        </motion.div>

        {useCarousel ? (
          /* CARROSSEL — quando houver mais de 5 banners */
          <Carousel
            opts={{ align: "start", loop: true }}
            plugins={[autoplayRef.current]}
            className="relative"
            onMouseLeave={() => autoplayRef.current.play()}
          >
            <CarouselContent className="-ml-4">
              {banners.map((banner, i) => {
                const meta = parseBannerTitulo(banner.titulo);
                const href = safeBannerHref(meta.link);
                return (
                  <CarouselItem
                    key={banner.id}
                    className="pl-4 basis-full sm:basis-1/2 lg:basis-1/3"
                  >
                    <motion.a
                      href={href}
                      initial={{ opacity: 0, y: 30 }}
                      animate={isVisible ? { opacity: 1, y: 0 } : {}}
                      transition={{ duration: 0.5, delay: i * 0.05 }}
                      whileHover={{ y: -6 }}
                      className="group relative h-full block"
                      aria-label={`Ver oferta: ${meta.titulo}`}
                    >
                      <div className="relative h-full min-h-[280px] md:min-h-[340px] rounded-3xl overflow-hidden border border-[hsl(var(--dark-section-border))] hover:border-primary/40 transition-all duration-500 hover:shadow-elevated">
                        <img
                          src={banner.imagem_url}
                          alt={meta.titulo}
                          loading="lazy"
                          className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-[1.2s] ease-out"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-[hsl(var(--dark-section))] via-[hsl(var(--dark-section))]/40 to-transparent" />
                        <div className="relative h-full flex flex-col justify-end p-6">
                          <h3 className="font-display text-lg md:text-xl font-bold text-[hsl(var(--dark-section-fg))] leading-snug mb-2">
                            {meta.titulo}
                          </h3>
                          <span className="inline-flex items-center gap-1 text-xs font-semibold text-primary opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                            Ver detalhes
                            <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
                          </span>
                        </div>
                      </div>
                    </motion.a>
                  </CarouselItem>
                );
              })}
            </CarouselContent>
            <CarouselPrevious
              className="hidden md:flex -left-4 lg:-left-12 bg-[hsl(var(--dark-section-card))] border-[hsl(var(--dark-section-border))] text-[hsl(var(--dark-section-fg))] hover:bg-primary hover:text-primary-foreground hover:border-primary"
              aria-label="Banner anterior"
            />
            <CarouselNext
              className="hidden md:flex -right-4 lg:-right-12 bg-[hsl(var(--dark-section-card))] border-[hsl(var(--dark-section-border))] text-[hsl(var(--dark-section-fg))] hover:bg-primary hover:text-primary-foreground hover:border-primary"
              aria-label="Próximo banner"
            />
          </Carousel>
        ) : (
          /* BENTO GRID — até 5 banners */
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 md:gap-6">
            {/* Featured */}
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={isVisible ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.1 }}
              whileHover={{ y: -6 }}
              className="lg:col-span-2 lg:row-span-2 group relative"
            >
              <div className="relative h-full min-h-[320px] md:min-h-[480px] rounded-3xl overflow-hidden border border-[hsl(var(--dark-section-border))] hover:border-primary/40 transition-all duration-500 shadow-elevated">
                <img
                  src={featured.imagem_url}
                  alt={featuredMeta.titulo}
                  loading="lazy"
                  className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-[1.2s] ease-out"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[hsl(var(--dark-section))] via-[hsl(var(--dark-section))]/40 to-transparent" />
                <div className="absolute inset-0 bg-gradient-to-r from-[hsl(var(--dark-section))]/60 to-transparent" />
                <div className="absolute -top-20 -right-20 w-60 h-60 bg-primary/20 blur-[80px] pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-700" />

                <div className="relative h-full flex flex-col justify-end p-6 md:p-10">
                  <div className="inline-flex w-fit items-center gap-1.5 px-3 py-1 bg-primary text-primary-foreground text-[10px] font-bold uppercase tracking-[0.2em] rounded-full mb-4 shadow-glow">
                    <Tag className="w-3 h-3" />
                    Destaque
                  </div>
                  <h3 className="font-display text-2xl md:text-4xl lg:text-5xl font-bold text-[hsl(var(--dark-section-fg))] mb-4 leading-tight">
                    {featuredMeta.titulo}
                  </h3>
                  <Button
                    asChild
                    className="w-fit bg-primary text-primary-foreground hover:bg-primary/90 font-bold rounded-2xl px-6 py-6 shadow-glow group/btn"
                  >
                    <a
                      href={safeBannerHref(featuredMeta.link)}
                      aria-label={`Ver oferta: ${featuredMeta.titulo}`}
                      className="inline-flex items-center gap-2"
                    >
                      Aproveitar agora
                      <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
                    </a>
                  </Button>
                </div>
              </div>
            </motion.div>

            {/* Cards menores */}
            {rest.slice(0, 4).map((banner, i) => {
              const meta = parseBannerTitulo(banner.titulo);
              const href = safeBannerHref(meta.link);
              return (
                <motion.a
                  key={banner.id}
                  href={href}
                  initial={{ opacity: 0, y: 40 }}
                  animate={isVisible ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.6, delay: 0.2 + i * 0.1 }}
                  whileHover={{ y: -6 }}
                  className="group relative block"
                  aria-label={`Ver oferta: ${meta.titulo}`}
                >
                  <div className="relative h-full min-h-[200px] md:min-h-[230px] rounded-3xl overflow-hidden border border-[hsl(var(--dark-section-border))] hover:border-primary/40 transition-all duration-500 hover:shadow-elevated">
                    <img
                      src={banner.imagem_url}
                      alt={meta.titulo}
                      loading="lazy"
                      className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-[1.2s] ease-out"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[hsl(var(--dark-section))] via-[hsl(var(--dark-section))]/30 to-transparent" />

                    <div className="relative h-full flex flex-col justify-end p-5 md:p-6">
                      <h3 className="font-display text-base md:text-lg font-bold text-[hsl(var(--dark-section-fg))] leading-snug mb-2">
                        {meta.titulo}
                      </h3>
                      <span className="inline-flex items-center gap-1 text-xs font-semibold text-primary opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        Ver detalhes
                        <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
                      </span>
                    </div>
                  </div>
                </motion.a>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
};

export default BannersSection;
