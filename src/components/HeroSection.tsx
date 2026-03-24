import { useState, useEffect, useCallback, useRef } from "react";
import heroBanner from "@/assets/hero-banner.png";
import bannerGames from "@/assets/banner-games.png";
import bannerSocial from "@/assets/banner-social.png";

const banners = [heroBanner, bannerGames, bannerSocial];
const SWIPE_THRESHOLD = 50;

const HeroSection = () => {
  const [current, setCurrent] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const dragStartX = useRef<number | null>(null);
  const didSwipe = useRef(false);

  const goTo = useCallback((index: number) => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    setCurrent(index);
    setTimeout(() => setIsTransitioning(false), 600);
  }, [isTransitioning]);

  const next = useCallback(() => {
    goTo((current + 1) % banners.length);
  }, [current, goTo]);

  const prev = useCallback(() => {
    goTo((current - 1 + banners.length) % banners.length);
  }, [current, goTo]);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % banners.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

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

  return (
    <section id="inicio" className="pt-[100px] md:pt-[140px]">
      <div className="relative w-full group">
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
            {banners.map((src, i) => (
              <div key={i} className="min-w-full">
                <img
                  src={src}
                  alt={`JD Telecom Banner ${i + 1}`}
                  className="w-full h-auto block"
                  loading={i === 0 ? "eager" : "lazy"}
                  draggable={false}
                />
              </div>
            ))}
          </div>
        </div>


        {/* Dots */}
        <div className="absolute z-20 bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
          {banners.map((_, i) => (
            <button
              key={i}
              onClick={() => goTo(i)}
              className={`h-2.5 rounded-full transition-all duration-400 ${
                i === current ? "w-8 bg-white" : "w-2.5 bg-white/40 hover:bg-white/70"
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
