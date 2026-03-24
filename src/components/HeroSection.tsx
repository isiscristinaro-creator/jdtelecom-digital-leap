import { useState, useEffect, useCallback, useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import heroBanner from "@/assets/hero-banner.png";
import bannerGames from "@/assets/banner-games.png";
import bannerSocial from "@/assets/banner-social.png";

const banners = [heroBanner, bannerGames, bannerSocial];
const SWIPE_THRESHOLD = 50;

const HeroSection = () => {
  const [current, setCurrent] = useState(0);
  const dragStartX = useRef<number | null>(null);
  const didSwipe = useRef(false);

  const goTo = useCallback((index: number) => {
    setCurrent(index);
  }, []);

  const next = useCallback(() => {
    setCurrent((prev) => (prev + 1) % banners.length);
  }, []);

  const prev = useCallback(() => {
    setCurrent((prev) => (prev - 1 + banners.length) % banners.length);
  }, []);

  useEffect(() => {
    const timer = setInterval(next, 5000);
    return () => clearInterval(timer);
  }, [next]);

  const finishDrag = (clientX: number) => {
    if (dragStartX.current === null) return;

    const delta = clientX - dragStartX.current;
    if (Math.abs(delta) > SWIPE_THRESHOLD) {
      didSwipe.current = true;
      if (delta < 0) next();
      else prev();
    }

    dragStartX.current = null;
    requestAnimationFrame(() => {
      didSwipe.current = false;
    });
  };

  const handleBannerClick = (direction: "prev" | "next") => {
    if (didSwipe.current) return;
    if (direction === "prev") prev();
    else next();
  };

  return (
    <section id="inicio" className="pt-[136px] md:pt-[172px]">
      <div className="relative w-full group bg-primary">
        <div
          className="relative w-full select-none touch-pan-y"
          onPointerDown={(e) => {
            dragStartX.current = e.clientX;
          }}
          onPointerUp={(e) => finishDrag(e.clientX)}
          onPointerLeave={(e) => finishDrag(e.clientX)}
          onPointerCancel={() => {
            dragStartX.current = null;
          }}
        >
          {banners.map((src, i) => (
            <div key={i} className={i === current ? "block" : "hidden"}>
              <img
                src={src}
                alt={`JD Telecom Banner ${i + 1}`}
                className="w-full h-auto block"
                loading={i === 0 ? "eager" : "lazy"}
                draggable={false}
              />
            </div>
          ))}

          {/* Click zones */}
          <button
            onClick={() => handleBannerClick("prev")}
            className="absolute left-0 top-0 h-full w-1/2 z-10"
            aria-label="Ir para o banner anterior"
          />
          <button
            onClick={() => handleBannerClick("next")}
            className="absolute right-0 top-0 h-full w-1/2 z-10"
            aria-label="Ir para o próximo banner"
          />
        </div>

        {/* Arrows */}
        <button
          onClick={prev}
          className="absolute z-20 left-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-foreground/20 backdrop-blur-sm text-background flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 hover:bg-primary hover:text-primary-foreground"
          aria-label="Banner anterior"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>
        <button
          onClick={next}
          className="absolute z-20 right-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-foreground/20 backdrop-blur-sm text-background flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 hover:bg-primary hover:text-primary-foreground"
          aria-label="Próximo banner"
        >
          <ChevronRight className="w-6 h-6" />
        </button>

        {/* Dots */}
        <div className="absolute z-20 bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
          {banners.map((_, i) => (
            <button
              key={i}
              onClick={() => goTo(i)}
              className={`h-2.5 rounded-full transition-all duration-500 ${
                i === current ? "w-8 bg-primary-foreground" : "w-2.5 bg-primary-foreground/40 hover:bg-primary-foreground/60"
              }`}
              aria-label={`Banner ${i + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
