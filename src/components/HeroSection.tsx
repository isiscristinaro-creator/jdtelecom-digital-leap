import { useState, useEffect, useCallback } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import heroBanner from "@/assets/hero-banner.png";
import bannerGames from "@/assets/banner-games.png";
import bannerSocial from "@/assets/banner-social.png";

const banners = [heroBanner, bannerGames, bannerSocial];

const HeroSection = () => {
  const [current, setCurrent] = useState(0);

  const goTo = useCallback((index: number, _dir: number) => {
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

  return (
    <section id="inicio" className="pt-[136px] md:pt-[172px]">
      <div className="relative w-full overflow-hidden group bg-primary">
        {banners.map((src, i) => (
          <div
            key={i}
            className={`w-full transition-opacity duration-700 ease-in-out ${
              i === current ? "relative opacity-100 z-10" : "absolute inset-0 opacity-0 z-0"
            }`}
          >
            <img
              src={src}
              alt={`JD Telecom Banner ${i + 1}`}
              className="w-full h-auto block"
              loading={i === 0 ? "eager" : "lazy"}
            />
          </div>
        ))}

        {/* Arrows */}
        <button
          onClick={prev}
          className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-foreground/20 backdrop-blur-sm text-background flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 hover:bg-primary hover:text-primary-foreground"
          aria-label="Banner anterior"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>
        <button
          onClick={next}
          className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-foreground/20 backdrop-blur-sm text-background flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 hover:bg-primary hover:text-primary-foreground"
          aria-label="Próximo banner"
        >
          <ChevronRight className="w-6 h-6" />
        </button>

        {/* Dots */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
          {banners.map((_, i) => (
            <button
              key={i}
              onClick={() => goTo(i, i > current ? 1 : -1)}
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
