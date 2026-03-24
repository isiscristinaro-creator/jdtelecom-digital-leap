import { useState, useEffect, useCallback } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import heroBanner from "@/assets/hero-banner.png";
import bannerGames from "@/assets/banner-games.png";
import bannerSocial from "@/assets/banner-social.png";

const banners = [heroBanner, bannerGames, bannerSocial];

const HeroSection = () => {
  const [current, setCurrent] = useState(0);
  const [direction, setDirection] = useState(0);

  const goTo = useCallback((index: number, dir: number) => {
    setDirection(dir);
    setCurrent(index);
  }, []);

  const next = useCallback(() => {
    goTo((current + 1) % banners.length, 1);
  }, [current, goTo]);

  const prev = useCallback(() => {
    goTo((current - 1 + banners.length) % banners.length, -1);
  }, [current, goTo]);

  useEffect(() => {
    const timer = setInterval(next, 5000);
    return () => clearInterval(timer);
  }, [next]);

  return (
    <section id="inicio" className="pt-[104px] md:pt-[120px]">
      <div className="relative w-full overflow-hidden group">
        {banners.map((src, i) => (
          <div
            key={i}
            className={`w-full transition-all duration-700 ease-in-out ${
              i === current
                ? "relative opacity-100 translate-x-0 scale-100"
                : "absolute inset-0 opacity-0 pointer-events-none scale-105"
            }`}
            style={{
              transform: i === current ? "translateX(0) scale(1)" : `translateX(${i < current ? "-8%" : "8%"}) scale(1.05)`,
            }}
          >
            <img
              src={src}
              alt={`JD Telecom Banner ${i + 1}`}
              className="w-full h-auto object-cover"
              width={1920}
              height={500}
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
              className={`h-2 rounded-full transition-all duration-500 ${
                i === current ? "w-8 bg-primary" : "w-2 bg-background/60 hover:bg-background"
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
