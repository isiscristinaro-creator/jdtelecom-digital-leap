import { useState, useEffect } from "react";
import { MapPin, CheckCircle, Navigation, Wifi, Signal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import { motion, AnimatePresence } from "framer-motion";

interface City {
  name: string;
  state: string;
  lat: number;
  lng: number;
  population?: string;
  type?: "hub" | "city";
}

const cities: City[] = [
  { name: "Manaus", state: "AM", lat: -3.119, lng: -60.022, population: "2.2M hab.", type: "hub" },
  { name: "Nhamundá", state: "AM", lat: -2.188, lng: -56.713, population: "21K hab.", type: "city" },
  { name: "Terra Santa", state: "PA", lat: -2.104, lng: -56.488, population: "18K hab.", type: "city" },
  { name: "Faro", state: "PA", lat: -2.168, lng: -56.741, population: "9K hab.", type: "city" },
  { name: "Santarém", state: "PA", lat: -2.443, lng: -54.708, population: "306K hab.", type: "hub" },
  { name: "Oriximiná", state: "PA", lat: -1.766, lng: -55.866, population: "72K hab.", type: "city" },
  { name: "Bagre", state: "PA", lat: -1.905, lng: -50.180, population: "30K hab.", type: "city" },
  { name: "Breves", state: "PA", lat: -1.681, lng: -50.480, population: "103K hab.", type: "city" },
  { name: "Melgaço", state: "PA", lat: -1.803, lng: -50.714, population: "27K hab.", type: "city" },
  { name: "Portel", state: "PA", lat: -1.936, lng: -50.820, population: "63K hab.", type: "city" },
  { name: "Redenção", state: "PA", lat: -8.028, lng: -50.032, population: "82K hab.", type: "city" },
];

// Network connections — fiber routes between cities
const fiberRoutes: [string, string][] = [
  ["Manaus", "Nhamundá"],
  ["Nhamundá", "Faro"],
  ["Nhamundá", "Terra Santa"],
  ["Faro", "Oriximiná"],
  ["Oriximiná", "Santarém"],
  ["Terra Santa", "Santarém"],
  ["Santarém", "Breves"],
  ["Breves", "Bagre"],
  ["Breves", "Melgaço"],
  ["Melgaço", "Portel"],
  ["Bagre", "Redenção"],
  ["Manaus", "Oriximiná"],
];

const mapBounds = {
  minLat: -9.5,
  maxLat: 0.5,
  minLng: -62.5,
  maxLng: -48,
};

function toSvg(lat: number, lng: number): { x: number; y: number } {
  const x = ((lng - mapBounds.minLng) / (mapBounds.maxLng - mapBounds.minLng)) * 100;
  const y = ((mapBounds.maxLat - lat) / (mapBounds.maxLat - mapBounds.minLat)) * 100;
  return { x, y };
}

function getCityByName(name: string) {
  return cities.find(c => c.name === name);
}

// Approximate simplified Amazon River path (for visual effect)
const amazonRiverPath = "M 2,30 C 8,28 12,32 18,30 C 24,28 28,26 34,28 C 40,30 44,28 50,30 C 54,31 58,30 62,32 C 66,33 72,31 78,33 C 82,34 86,32 92,34 L 98,35";

// Simplified state boundaries (Amazonas outline approximation)
const amStatePath = "M 2,10 L 8,8 L 18,6 L 24,8 L 30,10 L 36,8 L 40,12 L 38,20 L 36,28 L 38,36 L 40,44 L 36,52 L 28,56 L 20,54 L 12,48 L 6,40 L 2,32 Z";
// Pará outline approximation
const paStatePath = "M 40,6 L 50,4 L 60,6 L 72,8 L 82,12 L 90,18 L 94,26 L 92,36 L 88,46 L 82,56 L 74,64 L 64,70 L 56,72 L 48,68 L 42,58 L 38,48 L 38,36 L 36,28 L 38,20 L 40,12 Z";

// Secondary road paths for visual depth
const secondaryRoads = [
  "M 10,24 C 16,22 22,26 28,24 C 34,22 38,26 44,24",
  "M 50,18 C 56,20 62,18 68,22 C 72,24 76,22 82,26",
  "M 45,40 C 50,42 55,38 60,42 C 65,44 70,40 75,44",
  "M 30,50 C 36,48 42,52 48,50",
];

const CoverageSection = () => {
  const [activeCity, setActiveCity] = useState<string | null>(null);
  
  const { ref, isVisible } = useScrollAnimation();
  const [animPhase, setAnimPhase] = useState(0);

  useEffect(() => {
    if (isVisible) {
      const t1 = setTimeout(() => setAnimPhase(1), 300);
      const t2 = setTimeout(() => setAnimPhase(2), 800);
      const t3 = setTimeout(() => setAnimPhase(3), 1300);
      return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); };
    }
  }, [isVisible]);

  const activeInfo = activeCity ? getCityByName(activeCity) : null;

  return (
    <section id="cobertura" className="py-20 md:py-32 bg-[hsl(var(--dark-section))] relative overflow-hidden">
      {/* Ambient glows */}
      <div className="absolute top-0 left-1/4 w-[600px] h-[600px] rounded-full bg-primary/[0.03] blur-[150px] pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-[400px] h-[400px] rounded-full bg-blue-500/[0.02] blur-[120px] pointer-events-none" />

      <div className="container mx-auto px-4 relative z-10" ref={ref}>
        <motion.div
          className="text-center mb-12 md:mb-16 space-y-4"
          initial={{ opacity: 0, y: 20 }}
          animate={isVisible ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
        >
          <span className="inline-block px-4 py-1.5 bg-primary/10 text-primary text-xs font-bold uppercase tracking-widest rounded-full">
            Mapa de Cobertura
          </span>
          <h2 className="font-display text-2xl sm:text-4xl md:text-5xl lg:text-[3.5rem] font-bold text-[hsl(var(--dark-section-fg))] leading-[1.1]">
            Nossa <span className="text-gradient">rede</span> no Norte
          </h2>
          <p className="text-[hsl(var(--dark-section-muted))] text-lg md:text-xl max-w-2xl mx-auto">
            Infraestrutura de fibra óptica conectando {cities.length} cidades no Amazonas e Pará
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-5 gap-6 lg:gap-8 items-start">
          {/* Dark Map */}
          <motion.div
            className="lg:col-span-3"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={isVisible ? { opacity: 1, scale: 1 } : {}}
            transition={{ duration: 0.7, delay: 0.2 }}
          >
            <div className="relative rounded-3xl overflow-hidden shadow-elevated" style={{
              background: "linear-gradient(145deg, #1a1d23 0%, #12151a 40%, #0d1117 100%)"
            }}>
              {/* Google Maps style grid pattern */}
              <div className="absolute inset-0 opacity-[0.04]" style={{
                backgroundImage: `
                  linear-gradient(rgba(255,255,255,0.15) 1px, transparent 1px),
                  linear-gradient(90deg, rgba(255,255,255,0.15) 1px, transparent 1px)
                `,
                backgroundSize: "60px 60px"
              }} />

              {/* Subtle coordinate grid */}
              <div className="absolute inset-0 opacity-[0.02]" style={{
                backgroundImage: `
                  linear-gradient(rgba(255,255,255,0.3) 1px, transparent 1px),
                  linear-gradient(90deg, rgba(255,255,255,0.3) 1px, transparent 1px)
                `,
                backgroundSize: "12px 12px"
              }} />

              <div className="p-4 md:p-8">
                {/* Map header bar — Google Maps style */}
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                    <span className="text-[10px] font-mono text-emerald-400/80 uppercase tracking-wider">Rede ao Vivo</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-1.5 px-2 py-1 bg-white/[0.05] rounded-md">
                      <Signal className="w-3 h-3 text-primary" />
                      <span className="text-[10px] font-mono text-[hsl(var(--dark-section-muted))]">{cities.length} cidades</span>
                    </div>
                    <div className="flex items-center gap-1.5 px-2 py-1 bg-white/[0.05] rounded-md">
                      <Wifi className="w-3 h-3 text-cyan-400" />
                      <span className="text-[10px] font-mono text-[hsl(var(--dark-section-muted))]">{fiberRoutes.length} rotas</span>
                    </div>
                  </div>
                </div>

                <svg viewBox="0 0 100 100" className="w-full h-auto relative z-10" style={{ minHeight: 320 }}>
                  <defs>
                    {/* City glow filter */}
                    <filter id="cityGlow" x="-50%" y="-50%" width="200%" height="200%">
                      <feGaussianBlur stdDeviation="0.8" result="blur" />
                      <feMerge>
                        <feMergeNode in="blur" />
                        <feMergeNode in="SourceGraphic" />
                      </feMerge>
                    </filter>

                    {/* Hub glow — bigger */}
                    <filter id="hubGlow" x="-100%" y="-100%" width="300%" height="300%">
                      <feGaussianBlur stdDeviation="1.5" result="blur" />
                      <feMerge>
                        <feMergeNode in="blur" />
                        <feMergeNode in="SourceGraphic" />
                      </feMerge>
                    </filter>

                    {/* Active pulse glow */}
                    <filter id="activeGlow" x="-200%" y="-200%" width="500%" height="500%">
                      <feGaussianBlur stdDeviation="2" result="blur" />
                      <feMerge>
                        <feMergeNode in="blur" />
                        <feMergeNode in="blur" />
                        <feMergeNode in="SourceGraphic" />
                      </feMerge>
                    </filter>

                    {/* Water gradient */}
                    <linearGradient id="waterGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#1a3a4a" stopOpacity="0.3" />
                      <stop offset="100%" stopColor="#0d2833" stopOpacity="0.2" />
                    </linearGradient>

                    {/* Fiber route gradient */}
                    <linearGradient id="fiberGrad">
                      <stop offset="0%" stopColor="hsl(24 95% 50%)" />
                      <stop offset="50%" stopColor="hsl(30 100% 60%)" />
                      <stop offset="100%" stopColor="hsl(24 95% 50%)" />
                    </linearGradient>

                    {/* Animated dash for active routes */}
                    <linearGradient id="activeFiberGrad">
                      <stop offset="0%" stopColor="#22d3ee" />
                      <stop offset="50%" stopColor="hsl(24 95% 50%)" />
                      <stop offset="100%" stopColor="#22d3ee" />
                    </linearGradient>
                  </defs>

                  {/* === LAYER 1: State boundaries (dark terrain) === */}
                  <g opacity={animPhase >= 1 ? 1 : 0} style={{ transition: "opacity 0.8s ease" }}>
                    <path d={amStatePath}
                      fill="rgba(255,255,255,0.015)"
                      stroke="rgba(255,255,255,0.06)"
                      strokeWidth="0.2"
                      strokeDasharray="1,1"
                    />
                    <path d={paStatePath}
                      fill="rgba(255,255,255,0.02)"
                      stroke="rgba(255,255,255,0.06)"
                      strokeWidth="0.2"
                      strokeDasharray="1,1"
                    />

                    {/* State labels */}
                    <text x="18" y="30" textAnchor="middle" fill="rgba(255,255,255,0.08)"
                      fontSize="5" fontWeight="600" fontFamily="Space Grotesk, sans-serif" letterSpacing="0.5">
                      AM
                    </text>
                    <text x="62" y="35" textAnchor="middle" fill="rgba(255,255,255,0.08)"
                      fontSize="5" fontWeight="600" fontFamily="Space Grotesk, sans-serif" letterSpacing="0.5">
                      PA
                    </text>
                  </g>

                  {/* === LAYER 2: Amazon river === */}
                  <g opacity={animPhase >= 1 ? 1 : 0} style={{ transition: "opacity 1s ease 0.2s" }}>
                    <path d={amazonRiverPath}
                      fill="none"
                      stroke="url(#waterGrad)"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                      opacity="0.4"
                    />
                    <path d={amazonRiverPath}
                      fill="none"
                      stroke="#1a4a5a"
                      strokeWidth="0.8"
                      strokeLinecap="round"
                      opacity="0.3"
                    />
                  </g>

                  {/* === LAYER 3: Secondary roads === */}
                  <g opacity={animPhase >= 2 ? 0.15 : 0} style={{ transition: "opacity 0.6s ease" }}>
                    {secondaryRoads.map((path, i) => (
                      <path key={i} d={path}
                        fill="none"
                        stroke="rgba(255,255,255,0.4)"
                        strokeWidth="0.15"
                        strokeDasharray="0.8,1.2"
                      />
                    ))}
                  </g>

                  {/* === LAYER 4: Fiber routes (connections) === */}
                  <g opacity={animPhase >= 2 ? 1 : 0} style={{ transition: "opacity 0.8s ease" }}>
                    {fiberRoutes.map(([from, to]) => {
                      const c1 = getCityByName(from);
                      const c2 = getCityByName(to);
                      if (!c1 || !c2) return null;
                      const p1 = toSvg(c1.lat, c1.lng);
                      const p2 = toSvg(c2.lat, c2.lng);
                      const routeKey = `${from}-${to}`;
                      const isRouteActive = activeCity === from || activeCity === to;

                      // Bezier curve for more natural routing
                      const midX = (p1.x + p2.x) / 2;
                      const midY = (p1.y + p2.y) / 2;
                      const dx = p2.x - p1.x;
                      const dy = p2.y - p1.y;
                      const offset = Math.min(Math.sqrt(dx * dx + dy * dy) * 0.15, 4);
                      const cpX = midX + (dy > 0 ? -offset : offset);
                      const cpY = midY + (dx > 0 ? offset : -offset);

                      return (
                        <g key={routeKey}>
                          {/* Route shadow / glow */}
                          <path
                            d={`M ${p1.x},${p1.y} Q ${cpX},${cpY} ${p2.x},${p2.y}`}
                            fill="none"
                            stroke={isRouteActive ? "hsl(24 95% 50%)" : "hsl(24 95% 50%)"}
                            strokeWidth={isRouteActive ? "0.8" : "0.3"}
                            opacity={isRouteActive ? 0.4 : 0.1}
                            strokeLinecap="round"
                            filter={isRouteActive ? "url(#cityGlow)" : undefined}
                          />
                          {/* Main route line */}
                          <path
                            d={`M ${p1.x},${p1.y} Q ${cpX},${cpY} ${p2.x},${p2.y}`}
                            fill="none"
                            stroke={isRouteActive ? "url(#activeFiberGrad)" : "url(#fiberGrad)"}
                            strokeWidth={isRouteActive ? "0.4" : "0.2"}
                            opacity={isRouteActive ? 0.9 : 0.35}
                            strokeLinecap="round"
                            strokeDasharray={isRouteActive ? "none" : "1.5,0.8"}
                            className="transition-all duration-500"
                          >
                            {isRouteActive && (
                              <animate
                                attributeName="stroke-dashoffset"
                                from="6"
                                to="0"
                                dur="1.5s"
                                repeatCount="indefinite"
                              />
                            )}
                          </path>
                          {/* Data flow animation dots */}
                          {isRouteActive && (
                            <circle r="0.4" fill="#22d3ee" filter="url(#cityGlow)">
                              <animateMotion
                                path={`M ${p1.x},${p1.y} Q ${cpX},${cpY} ${p2.x},${p2.y}`}
                                dur="2s"
                                repeatCount="indefinite"
                              />
                              <animate attributeName="opacity" values="0;1;1;0" dur="2s" repeatCount="indefinite" />
                            </circle>
                          )}
                        </g>
                      );
                    })}
                  </g>

                  {/* === LAYER 5: City markers === */}
                  <g opacity={animPhase >= 3 ? 1 : 0} style={{ transition: "opacity 0.6s ease" }}>
                    {cities.map((city) => {
                      const pos = toSvg(city.lat, city.lng);
                      const isActive = activeCity === city.name;
                      const isHub = city.type === "hub";
                      const baseR = isHub ? 1.6 : 1;

                      return (
                        <g
                          key={city.name}
                          onMouseEnter={() => setActiveCity(city.name)}
                          onMouseLeave={() => setActiveCity(null)}
                          onClick={() => setActiveCity(isActive ? null : city.name)}
                          className="cursor-pointer"
                        >
                          {/* Coverage radius ring */}
                          <circle cx={pos.x} cy={pos.y}
                            r={isActive ? 6 : isHub ? 4 : 2.5}
                            fill="none"
                            stroke="hsl(24 95% 50%)"
                            strokeWidth="0.1"
                            opacity={isActive ? 0.3 : 0.08}
                            strokeDasharray="0.5,0.5"
                            className="transition-all duration-500"
                          />

                          {/* Pulse ring animation */}
                          {(isActive || isHub) && (
                            <circle cx={pos.x} cy={pos.y} r={baseR}
                              fill="none"
                              stroke="hsl(24 95% 50%)"
                              strokeWidth="0.2"
                              opacity="0"
                            >
                              <animate attributeName="r" from={String(baseR)} to={String(baseR + 4)} dur="2s" repeatCount="indefinite" />
                              <animate attributeName="opacity" from="0.5" to="0" dur="2s" repeatCount="indefinite" />
                            </circle>
                          )}

                          {/* Outer glow ring */}
                          <circle cx={pos.x} cy={pos.y}
                            r={isActive ? baseR + 1 : baseR + 0.4}
                            fill={isActive ? "hsl(24 95% 50% / 0.15)" : "hsl(24 95% 50% / 0.05)"}
                            className="transition-all duration-300"
                          />

                          {/* Main dot */}
                          <circle cx={pos.x} cy={pos.y}
                            r={isActive ? baseR + 0.3 : baseR}
                            fill={isHub ? "hsl(24 95% 50%)" : isActive ? "hsl(24 95% 50%)" : "hsl(30 80% 55%)"}
                            filter={isActive ? "url(#activeGlow)" : isHub ? "url(#hubGlow)" : "url(#cityGlow)"}
                            className="transition-all duration-300"
                          />

                          {/* Inner bright core */}
                          <circle cx={pos.x} cy={pos.y}
                            r={isActive ? 0.5 : 0.3}
                            fill="white"
                            opacity={isActive ? 0.9 : 0.6}
                          />

                          {/* City label — always visible for hubs */}
                          {(isActive || isHub) && (
                            <g>
                              {/* Label background */}
                              <rect
                                x={pos.x + 2.5} y={pos.y - 2.8}
                                width={isActive ? 22 : 14}
                                height={isActive ? 7.5 : 4}
                                rx="1"
                                fill="rgba(18,21,26,0.92)"
                                stroke={isActive ? "hsl(24 95% 50% / 0.4)" : "rgba(255,255,255,0.08)"}
                                strokeWidth="0.15"
                              />
                              {/* City name */}
                              <text
                                x={pos.x + 3.5} y={pos.y - 0.2}
                                fill={isActive ? "hsl(24 95% 50%)" : "rgba(255,255,255,0.7)"}
                                fontSize={isActive ? "2.2" : "1.8"}
                                fontWeight="700"
                                fontFamily="Space Grotesk, sans-serif"
                              >
                                {city.name}
                              </text>
                              {isActive && city.population && (
                                <text
                                  x={pos.x + 3.5} y={pos.y + 2.8}
                                  fill="rgba(255,255,255,0.45)"
                                  fontSize="1.5"
                                  fontFamily="Space Grotesk, sans-serif"
                                >
                                  {city.state} · {city.population}
                                </text>
                              )}
                            </g>
                          )}
                        </g>
                      );
                    })}
                  </g>

                  {/* === LAYER 6: Coordinate markers === */}
                  <g opacity="0.15">
                    <text x="2" y="98" fill="white" fontSize="1.5" fontFamily="monospace">-62.5°W</text>
                    <text x="88" y="98" fill="white" fontSize="1.5" fontFamily="monospace">-48°W</text>
                    <text x="2" y="3" fill="white" fontSize="1.5" fontFamily="monospace">0.5°N</text>
                    <text x="2" y="96" fill="white" fontSize="1.5" fontFamily="monospace">-9.5°S</text>
                  </g>
                </svg>

                {/* Legend bar */}
                <div className="flex flex-wrap items-center justify-center gap-4 md:gap-6 mt-4 pt-4 border-t border-white/[0.05]">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-primary shadow-[0_0_8px_rgba(249,115,22,0.4)]" />
                    <span className="text-[10px] text-white/40 font-mono">Hub principal</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-orange-400" />
                    <span className="text-[10px] text-white/40 font-mono">Cidade atendida</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-px bg-gradient-to-r from-primary to-cyan-400 opacity-60" />
                    <span className="text-[10px] text-white/40 font-mono">Rota de fibra</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-0.5 bg-[#1a4a5a] rounded opacity-60" />
                    <span className="text-[10px] text-white/40 font-mono">Rio Amazonas</span>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* City list sidebar */}
          <motion.div
            className="lg:col-span-2"
            initial={{ opacity: 0, x: 30 }}
            animate={isVisible ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.4 }}
          >
            {/* Active city info card */}
            <AnimatePresence mode="wait">
              {activeInfo && (
                <motion.div
                  key={activeCity}
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                  className="mb-4 p-4 rounded-2xl border border-primary/20 bg-primary/[0.05] backdrop-blur-sm"
                >
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
                      <Navigation className="w-4 h-4 text-primary" />
                    </div>
                    <div>
                      <p className="font-display font-bold text-[hsl(var(--dark-section-fg))] text-sm">{activeInfo.name}</p>
                      <p className="text-xs text-[hsl(var(--dark-section-muted))]">{activeInfo.state} · {activeInfo.population}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-emerald-400">
                    <Wifi className="w-3 h-3" />
                    <span>Cobertura ativa · Fibra óptica</span>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <div className="space-y-2">
              {cities.map((city, i) => (
                <motion.button
                  key={city.name}
                  initial={{ opacity: 0, x: 20 }}
                  animate={isVisible ? { opacity: 1, x: 0 } : {}}
                  transition={{ duration: 0.4, delay: 0.5 + i * 0.05 }}
                  onMouseEnter={() => setActiveCity(city.name)}
                  onMouseLeave={() => setActiveCity(null)}
                  onClick={() => setActiveCity(activeCity === city.name ? null : city.name)}
                  className={`w-full flex items-center gap-3 p-3 md:p-4 rounded-2xl border transition-all duration-400 text-left group ${
                    activeCity === city.name
                      ? "border-primary/40 bg-primary/[0.08] shadow-[0_0_20px_rgba(249,115,22,0.1)]"
                      : "border-[hsl(var(--dark-section-border))] bg-[hsl(var(--dark-section-card))] hover:border-primary/20"
                  }`}
                >
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 transition-colors ${
                    activeCity === city.name ? "bg-primary/20" : "bg-white/[0.03]"
                  }`}>
                    {city.type === "hub" ? (
                      <Signal className={`w-4 h-4 ${activeCity === city.name ? "text-primary" : "text-[hsl(var(--dark-section-muted))]"}`} />
                    ) : (
                      <CheckCircle className={`w-4 h-4 ${activeCity === city.name ? "text-primary" : "text-[hsl(var(--dark-section-muted))]"}`} />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-display font-semibold text-[hsl(var(--dark-section-fg))] text-sm truncate">
                      {city.name}
                      {city.type === "hub" && (
                        <span className="ml-2 text-[9px] px-1.5 py-0.5 bg-primary/10 text-primary rounded-full font-bold uppercase">Hub</span>
                      )}
                    </p>
                    <p className="text-xs text-[hsl(var(--dark-section-muted))]">{city.state} · {city.population}</p>
                  </div>
                  <div className={`w-2 h-2 rounded-full transition-colors ${
                    activeCity === city.name ? "bg-emerald-400 shadow-[0_0_6px_rgba(52,211,153,0.4)]" : "bg-emerald-400/30"
                  }`} />
                </motion.button>
              ))}
            </div>

            <div className="mt-6">
              <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                <Button className="bg-primary text-primary-foreground hover:bg-primary/90 w-full py-6 font-bold rounded-2xl shadow-[0_0_30px_rgba(249,115,22,0.2)] hover:shadow-[0_0_40px_rgba(249,115,22,0.3)] transition-shadow duration-500 text-base" asChild>
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
