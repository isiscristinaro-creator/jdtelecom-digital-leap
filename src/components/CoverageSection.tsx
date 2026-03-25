import { useState } from "react";
import { MapPin, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import { motion } from "framer-motion";

interface City {
  name: string;
  state: string;
  lat: number;
  lng: number;
}

const cities: City[] = [
  { name: "Manaus", state: "AM", lat: -3.119, lng: -60.022 },
  { name: "Nhamundá", state: "AM", lat: -2.188, lng: -56.713 },
  { name: "Terra Santa", state: "PA", lat: -2.104, lng: -56.488 },
  { name: "Faro", state: "PA", lat: -2.168, lng: -56.741 },
  { name: "Santarém", state: "PA", lat: -2.443, lng: -54.708 },
  { name: "Oriximiná", state: "PA", lat: -1.766, lng: -55.866 },
  { name: "Bagre", state: "PA", lat: -1.905, lng: -50.180 },
  { name: "Breves", state: "PA", lat: -1.681, lng: -50.480 },
  { name: "Melgaço", state: "PA", lat: -1.803, lng: -50.714 },
  { name: "Portel", state: "PA", lat: -1.936, lng: -50.820 },
  { name: "Redenção", state: "PA", lat: -8.028, lng: -50.032 },
];

const mapBounds = {
  minLat: -9,
  maxLat: 1,
  minLng: -62,
  maxLng: -48,
};

function toSvg(lat: number, lng: number): { x: number; y: number } {
  const x = ((lng - mapBounds.minLng) / (mapBounds.maxLng - mapBounds.minLng)) * 100;
  const y = ((mapBounds.maxLat - lat) / (mapBounds.maxLat - mapBounds.minLat)) * 100;
  return { x, y };
}

const CoverageSection = () => {
  const [activeCity, setActiveCity] = useState<string | null>(null);
  const { ref, isVisible } = useScrollAnimation();

  return (
    <section id="cobertura" className="py-24 md:py-32 bg-background relative overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute top-1/2 left-0 w-[500px] h-[500px] rounded-full bg-primary/[0.03] blur-[100px] pointer-events-none -translate-y-1/2" />

      <div className="container mx-auto px-4 relative z-10" ref={ref}>
        <motion.div
          className="text-center mb-16 space-y-5"
          initial={{ opacity: 0, y: 20 }}
          animate={isVisible ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
        >
          <h2 className="font-display text-2xl sm:text-4xl md:text-5xl lg:text-[3.5rem] font-bold text-foreground leading-[1.1]">
            Nossa <span className="text-gradient">cobertura</span>
          </h2>
          <p className="text-muted-foreground text-lg md:text-xl max-w-2xl mx-auto">
            Levando internet de qualidade para a região Norte do Brasil
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-5 gap-8 items-start">
          {/* Interactive Map */}
          <motion.div
            className="lg:col-span-3"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={isVisible ? { opacity: 1, scale: 1 } : {}}
            transition={{ duration: 0.7, delay: 0.2 }}
          >
            <div className="relative bg-gradient-to-br from-[hsl(var(--dark-section))] to-[hsl(220,20%,12%)] rounded-3xl p-6 md:p-10 overflow-hidden shadow-elevated">
              {/* Grid pattern */}
              <div className="absolute inset-0 opacity-[0.03]" style={{
                backgroundImage: "linear-gradient(hsl(var(--dark-section-fg)) 1px, transparent 1px), linear-gradient(90deg, hsl(var(--dark-section-fg)) 1px, transparent 1px)",
                backgroundSize: "40px 40px"
              }} />

              {/* Corner glows */}
              <div className="absolute top-0 right-0 w-48 h-48 bg-primary/5 blur-[80px] pointer-events-none" />

              <svg viewBox="0 0 100 100" className="w-full h-auto relative z-10" style={{ minHeight: 300 }}>
                <path
                  d="M5,20 L12,12 L22,10 L30,14 L35,10 L40,15 L38,25 L42,35 L38,45 L30,50 L22,48 L15,42 L8,35 L5,28 Z"
                  fill="hsl(24 95% 50% / 0.06)"
                  stroke="hsl(24 95% 50% / 0.15)"
                  strokeWidth="0.3"
                />
                <path
                  d="M40,15 L50,10 L60,12 L72,15 L80,20 L85,30 L82,42 L78,55 L70,65 L60,70 L50,68 L42,60 L38,50 L42,35 L40,25 Z"
                  fill="hsl(24 95% 50% / 0.06)"
                  stroke="hsl(24 95% 50% / 0.15)"
                  strokeWidth="0.3"
                />
                <path
                  d="M60,70 L65,78 L70,90 L62,92 L55,85 L50,75 L50,68 Z"
                  fill="hsl(24 95% 50% / 0.04)"
                  stroke="hsl(24 95% 50% / 0.12)"
                  strokeWidth="0.3"
                />

                {cities.map((city, i) => {
                  const pos = toSvg(city.lat, city.lng);
                  return cities.slice(i + 1).map((city2) => {
                    const pos2 = toSvg(city2.lat, city2.lng);
                    const dist = Math.sqrt((pos.x - pos2.x) ** 2 + (pos.y - pos2.y) ** 2);
                    if (dist > 25) return null;
                    return (
                      <line
                        key={`${city.name}-${city2.name}`}
                        x1={pos.x} y1={pos.y} x2={pos2.x} y2={pos2.y}
                        stroke="hsl(24 95% 50%)" strokeWidth="0.15" opacity="0.3"
                      />
                    );
                  });
                })}

                {cities.map((city) => {
                  const pos = toSvg(city.lat, city.lng);
                  const isActive = activeCity === city.name;
                  return (
                    <g key={city.name}
                      onMouseEnter={() => setActiveCity(city.name)}
                      onMouseLeave={() => setActiveCity(null)}
                      className="cursor-pointer"
                    >
                      <circle cx={pos.x} cy={pos.y} r={isActive ? 3 : 1.8}
                        fill="none" stroke="hsl(24 95% 50%)" strokeWidth="0.3"
                        opacity={isActive ? 0.6 : 0.3} className="transition-all duration-300"
                      >
                        {isActive && <animate attributeName="r" from="2" to="5" dur="1.5s" repeatCount="indefinite" />}
                        {isActive && <animate attributeName="opacity" from="0.6" to="0" dur="1.5s" repeatCount="indefinite" />}
                      </circle>
                      <circle cx={pos.x} cy={pos.y} r={isActive ? 1.8 : 1.2}
                        fill="hsl(24 95% 50%)" className="transition-all duration-300"
                        filter={isActive ? "url(#glow)" : undefined}
                      />
                      {isActive && (
                        <>
                          <rect x={pos.x - 10} y={pos.y - 7} width="20" height="4.5" rx="1"
                            fill="hsl(24 95% 50%)" opacity="0.95"
                          />
                          <text x={pos.x} y={pos.y - 4} textAnchor="middle" fill="white"
                            fontSize="2.5" fontWeight="bold" fontFamily="Space Grotesk, sans-serif"
                          >
                            {city.name} - {city.state}
                          </text>
                        </>
                      )}
                    </g>
                  );
                })}

                <defs>
                  <filter id="glow">
                    <feGaussianBlur stdDeviation="1" result="coloredBlur" />
                    <feMerge>
                      <feMergeNode in="coloredBlur" />
                      <feMergeNode in="SourceGraphic" />
                    </feMerge>
                  </filter>
                </defs>
              </svg>

              <div className="flex items-center justify-center gap-4 mt-4 relative z-10">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-primary" />
                  <span className="text-xs text-[hsl(var(--dark-section-muted))]">Cidade com cobertura</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-6 h-px bg-primary opacity-40" />
                  <span className="text-xs text-[hsl(var(--dark-section-muted))]">Rede de fibra</span>
                </div>
              </div>
            </div>
          </motion.div>

          {/* City list */}
          <motion.div
            className="lg:col-span-2"
            initial={{ opacity: 0, x: 30 }}
            animate={isVisible ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.4 }}
          >
            <div className="space-y-2.5">
              {cities.map((city) => (
                <button
                  key={city.name}
                  onMouseEnter={() => setActiveCity(city.name)}
                  onMouseLeave={() => setActiveCity(null)}
                  className={`w-full flex items-center gap-3 p-4 rounded-2xl border transition-all duration-400 text-left group ${
                    activeCity === city.name
                      ? "border-primary bg-primary/5 shadow-glow scale-[1.02]"
                      : "border-border bg-background hover:border-primary/30 shadow-card hover:shadow-elevated"
                  }`}
                >
                  <CheckCircle
                    className={`w-5 h-5 shrink-0 transition-colors ${
                      activeCity === city.name ? "text-primary" : "text-muted-foreground group-hover:text-primary/60"
                    }`}
                  />
                  <div>
                    <p className="font-display font-semibold text-foreground text-sm">{city.name}</p>
                    <p className="text-xs text-muted-foreground">{city.state}</p>
                  </div>
                </button>
              ))}
            </div>

            <div className="mt-6">
              <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                <Button className="bg-primary text-primary-foreground hover:bg-primary/90 w-full py-6 font-bold rounded-2xl shadow-glow hover:shadow-glow-lg transition-shadow duration-500 text-base" asChild>
                  <a href="#contato">
                    <MapPin className="w-5 h-5 mr-2" />
                    Consulte a disponibilidade
                  </a>
                </Button>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default CoverageSection;
