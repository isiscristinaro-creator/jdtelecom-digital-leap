import { useState, useEffect, useCallback, useRef } from "react";
import { motion } from "framer-motion";
import { supabase } from "@/integrations/supabase/client";
import { isHeroTitulo, parseBannerTitulo, safeBannerHref } from "@/lib/bannerMeta";
import heroBanner from "@/assets/hero-banner.png";
import bannerGames from "@/assets/banner-games.png";
import bannerSocial from "@/assets/banner-social.png";

const FALLBACK_BANNERS = [
  { id: "static-1", imagem_url: heroBanner, titulo: "JD Telecom Banner 1", link: "" },
  { id: "static-2", imagem_url: bannerGames, titulo: "JD Telecom Banner 2", link: "" },
  { id: "static-3", imagem_url: bannerSocial, titulo: "JD Telecom Banner 3", link: "" },
];

const SWIPE_THRESHOLD = 50;

interface HeroBanner {
  id: string;
  imagem_url: string;
  titulo: string;
  link: string;
}

const HeroSection = () => {
  const [banners, setBanners] = useState<HeroBanner[]>(FALLBACK_BANNERS);
  const [current, setCurrent] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const dragStartX = useRef<number | null>(null);
  const didSwipe = useRef(false);

  useEffect(() => {
    (async () => {
      const { data } = await supabase
        .from("banners")
        .select("id, titulo, imagem_url")
        .eq("ativo", true)
        .order("ordem", { ascending: true, nullsFirst: false })
        .order("created_at", { ascending: false });
      const heroOnly = (data || [])
        .filter((b) => isHeroTitulo(b.titulo) && b.imagem_url)
        .map((b) => {
          const meta = parseBannerTitulo(b.titulo);
          return {
            id: b.id,
            imagem_url: b.imagem_url,
            titulo: meta.titulo || "JD Telecom",
            link: meta.link,
          };
        });
      if (heroOnly.length > 0) setBanners(heroOnly);
    })();
  }, []);

  const goTo = useCallback((index: number) => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    setCurrent(index);
    setTimeout(() => setIsTransitioning(false), 600);
  }, [isTransitioning]);

  const next = useCallback(() => {
    goTo((current + 1) % banners.length);
  }, [current, goTo, banners.length]);

  const prev = useCallback(() => {
    goTo((current - 1 + banners.length) % banners.length);
  }, [current, goTo, banners.length]);

  useEffect(() => {
    if (banners.length <= 1) return;
    const timer = setInterval(() => {
      setCurrent((p) => (p + 1) % banners.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [banners.length]);

  // Mantém o índice válido se a quantidade de banners mudar
  useEffect(() => {
    if (current >= banners.length) setCurrent(0);
  }, [banners.length, current]);

  const finishDrag = (clientX: number) => {
    if (dragStartX.current === null) return;
    const delta = clientX - dragStartX.current;
    if (Math.abs(delta) > SWIPE_THRESHOLD) {
      didSwipe.current = true;
      if (delta < 0) next();
      else prev();
    }
    dragStartX.current = null;
    requestAnimationFrame(() => { didSwipe.current = false; });
  };

  const handleSlideClick = (link: string) => {
    if (didSwipe.current) return;
    const href = safeBannerHref(link, "");
    if (!href) return;
    if (/^https?:\/\//i.test(href)) {
      window.open(href, "_blank", "noopener,noreferrer");
    } else {
      window.location.href = href;
    }
  };

  return (
    <section id="inicio" className="pt-[128px] sm:pt-[132px] md:pt-[140px]">
      <motion.div
        className="relative w-full group"
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
      >
        <div
          className="relative w-full select-none touch-pan-y overflow-hidden"
          onPointerDown={(e) => { dragStartX.current = e.clientX; }}
          onPointerUp={(e) => finishDrag(e.clientX)}
          onPointerLeave={(e) => finishDrag(e.clientX)}
          onPointerCancel={() => { dragStartX.current = null; }}
        >
          {/* Slide track */}
          <div
            className="flex"
            style={{
              transform: `translateX(-${current * 100}%)`,
              transition: "transform 600ms cubic-bezier(0.4, 0, 0.2, 1)",
            }}
          >
            {banners.map((b, i) => {
              const hasLink = !!safeBannerHref(b.link, "");
              return (
                <div
                  key={b.id}
                  className={`min-w-full ${hasLink ? "cursor-pointer" : ""}`}
                  onClick={() => handleSlideClick(b.link)}
                  role={hasLink ? "link" : undefined}
                  aria-label={hasLink ? b.titulo : undefined}
                >
                  <img
                    src={b.imagem_url}
                    alt={b.titulo || `JD Telecom Banner ${i + 1}`}
                    className="w-full h-auto block 2xl:h-[min(60vh,720px)] 2xl:object-cover 2xl:object-center"
                    loading={i === 0 ? "eager" : "lazy"}
                    draggable={false}
                  />
                </div>
              );
            })}
          </div>
        </div>

        {/* Dots */}
        {banners.length > 1 && (
          <motion.div
            className="absolute z-20 bottom-4 left-1/2 -translate-x-1/2 flex gap-2"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            {banners.map((_, i) => (
              <button
                key={i}
                onClick={() => goTo(i)}
                className={`h-2.5 rounded-full transition-all duration-400 focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-black ${
                  i === current ? "w-8 bg-white" : "w-2.5 bg-white/40 hover:bg-white/70"
                }`}
                aria-label={`Ir para banner ${i + 1}`}
                aria-current={i === current ? "true" : undefined}
              />
            ))}
          </motion.div>
        )}
      </motion.div>
    </section>
  );
};

export default HeroSection;
