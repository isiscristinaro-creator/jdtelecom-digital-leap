import { useState } from "react";
import { MapPin, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";

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

// Map bounds for northern Brazil region
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
    <section id="cobertura" className="py-20 md:py-28 bg-background">
      <div className="container mx-auto px-4" ref={ref}>
        <div
          className={`text-center mb-16 space-y-4 transition-all duration-700 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
        >
          <h2 className="font-display text-3xl md:text-4xl lg:text-5xl font-bold text-foreground">
            Nossa <span className="text-primary">cobertura</span>
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Levando internet de qualidade para a região Norte do Brasil
          </p>
        </div>

        <div className="grid lg:grid-cols-5 gap-8 items-start">
          {/* Interactive Map */}
          <div
            className={`lg:col-span-3 relative transition-all duration-700 delay-200 ${
              isVisible ? "opacity-100 scale-100" : "opacity-0 scale-95"
            }`}
          >
            <div className="relative bg-gradient-to-br from-[hsl(var(--dark-section))] to-[hsl(220,20%,12%)] rounded-2xl p-6 md:p-10 overflow-hidden shadow-xl">
              {/* Grid pattern */}
              <div className="absolute inset-0 opacity-[0.03]" style={{
                backgroundImage: "linear-gradient(hsl(var(--dark-section-fg)) 1px, transparent 1px), linear-gradient(90deg, hsl(var(--dark-section-fg)) 1px, transparent 1px)",
                backgroundSize: "40px 40px"
              }} />

              <svg viewBox="0 0 100 100" className="w-full h-auto relative z-10" style={{ minHeight: 300 }}>
                {/* Simplified AM + PA state silhouettes */}
                {/* Amazonas silhouette */}
                <path
                  d="M5,20 L12,12 L22,10 L30,14 L35,10 L40,15 L38,25 L42,35 L38,45 L30,50 L22,48 L15,42 L8,35 L5,28 Z"
                  fill="hsl(24 95% 50% / 0.06)"
                  stroke="hsl(24 95% 50% / 0.15)"
                  strokeWidth="0.3"
                />
                {/* Pará silhouette */}
                <path
                  d="M40,15 L50,10 L60,12 L72,15 L80,20 L85,30 L82,42 L78,55 L70,65 L60,70 L50,68 L42,60 L38,50 L42,35 L40,25 Z"
                  fill="hsl(24 95% 50% / 0.06)"
                  stroke="hsl(24 95% 50% / 0.15)"
                  strokeWidth="0.3"
                />
                {/* Southern PA extension (Redenção area) */}
                <path
                  d="M60,70 L65,78 L70,90 L62,92 L55,85 L50,75 L50,68 Z"
                  fill="hsl(24 95% 50% / 0.04)"
                  stroke="hsl(24 95% 50% / 0.12)"
                  strokeWidth="0.3"
                />
                {/* Connection lines between cities */}
                {cities.map((city, i) => {
                  const pos = toSvg(city.lat, city.lng);
                  return cities.slice(i + 1).map((city2, j) => {
                    const pos2 = toSvg(city2.lat, city2.lng);
                    const dist = Math.sqrt((pos.x - pos2.x) ** 2 + (pos.y - pos2.y) ** 2);
                    if (dist > 25) return null;
                    return (
                      <line
                        key={`${city.name}-${city2.name}`}
                        x1={pos.x}
                        y1={pos.y}
                        x2={pos2.x}
                        y2={pos2.y}
                        stroke="hsl(24 95% 50%)"
                        strokeWidth="0.15"
                        opacity="0.3"
                      />
                    );
                  });
                })}

                {/* City dots */}
                {cities.map((city) => {
                  const pos = toSvg(city.lat, city.lng);
                  const isActive = activeCity === city.name;
                  return (
                    <g
                      key={city.name}
                      onMouseEnter={() => setActiveCity(city.name)}
                      onMouseLeave={() => setActiveCity(null)}
                      onClick={() => setActiveCity(isActive ? null : city.name)}
                      className="cursor-pointer"
                    >
                      {/* Pulse ring */}
                      <circle
                        cx={pos.x}
                        cy={pos.y}
                        r={isActive ? 3 : 1.8}
                        fill="none"
                        stroke="hsl(24 95% 50%)"
                        strokeWidth="0.3"
                        opacity={isActive ? 0.6 : 0.3}
                        className="transition-all duration-300"
                      >
                        {isActive && (
                          <animate attributeName="r" from="2" to="5" dur="1.5s" repeatCount="indefinite" />
                        )}
                        {isActive && (
                          <animate attributeName="opacity" from="0.6" to="0" dur="1.5s" repeatCount="indefinite" />
                        )}
                      </circle>
                      {/* Main dot */}
                      <circle
                        cx={pos.x}
                        cy={pos.y}
                        r={isActive ? 1.8 : 1.2}
                        fill="hsl(24 95% 50%)"
                        className="transition-all duration-300"
                        filter={isActive ? "url(#glow)" : undefined}
                      />
                      {/* Label */}
                      {isActive && (
                        <>
                          <rect
                            x={pos.x - 10}
                            y={pos.y - 7}
                            width="20"
                            height="4.5"
                            rx="1"
                            fill="hsl(24 95% 50%)"
                            opacity="0.95"
                          />
                          <text
                            x={pos.x}
                            y={pos.y - 4}
                            textAnchor="middle"
                            fill="white"
                            fontSize="2.5"
                            fontWeight="bold"
                            fontFamily="Space Grotesk, sans-serif"
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

              {/* Legend */}
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
          </div>

          {/* City list */}
          <div
            className={`lg:col-span-2 transition-all duration-700 delay-400 ${
              isVisible ? "opacity-100 translate-x-0" : "opacity-0 translate-x-8"
            }`}
          >
            <div className="space-y-2">
              {cities.map((city, i) => (
                <button
                  key={city.name}
                  onMouseEnter={() => setActiveCity(city.name)}
                  onMouseLeave={() => setActiveCity(null)}
                  onClick={() => setActiveCity(activeCity === city.name ? null : city.name)}
                  className={`w-full flex items-center gap-3 p-3.5 rounded-xl border transition-all duration-300 text-left ${
                    activeCity === city.name
                      ? "border-primary bg-primary/5 shadow-glow scale-[1.02]"
                      : "border-border bg-background hover:border-primary/30 shadow-card"
                  }`}
                >
                  <CheckCircle
                    className={`w-5 h-5 shrink-0 transition-colors ${
                      activeCity === city.name ? "text-primary" : "text-muted-foreground"
                    }`}
                  />
                  <div>
                    <p className="font-medium text-foreground text-sm">{city.name}</p>
                    <p className="text-xs text-muted-foreground">{city.state}</p>
                  </div>
                </button>
              ))}
            </div>

            <div className="mt-6 text-center">
              <Button className="bg-primary text-primary-foreground hover:bg-primary/90 w-full py-6 font-bold" asChild>
                <a href="https://wa.me/558005945678" target="_blank" rel="noopener noreferrer">
                  <MapPin className="w-5 h-5 mr-2" />
                  Consulte a disponibilidade
                </a>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CoverageSection;
