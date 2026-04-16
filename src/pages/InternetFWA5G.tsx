import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import {
  Signal, Wifi, Zap, ChevronDown, Check, ArrowRight,
  Star, Sparkles, Globe, Monitor, Smartphone, MessageCircle,
  Home, Router, MapPin, Clock, Shield, Activity, Gauge,
  Cable, WifiOff, PlugZap
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import WhatsAppButton from "@/components/WhatsAppButton";
import equipment5gRouter from "@/assets/equipment-5g-router.png";
import ProductTestimonials from "@/components/ProductTestimonials";

/* ══════════════════════════════════════════════════════════════
   FWA 5G — Highly Personalized Unique Elements:
   1. SignalPropagation — animated 5G wave propagation from tower
   2. SignalTowerViz — animated tower with orbiting devices
   3. LiveLatencyMonitor — real-time latency visualization
   4. CoverageRadar — rotating radar with city dots
   5. InstallationTimeline — step-by-step install visual
   6. WirelessBenchmark — FWA vs Radio comparison bars
   7. BeforeAfter — cable mess vs clean wireless
   8. TechSpecsPanel — animated tech specifications
   9. DeviceConnectionMap — animated device mesh network
   ══════════════════════════════════════════════════════════════ */

/* ── 5G Signal Propagation (hero background) ── */
const SignalPropagation = () => (
  <div className="absolute inset-0 overflow-hidden pointer-events-none">
    {/* Expanding rings from center-right */}
    {[1, 2, 3, 4, 5, 6].map((i) => (
      <motion.div
        key={i}
        className="absolute rounded-full"
        style={{
          width: `${i * 180}px`, height: `${i * 180}px`,
          top: "40%", right: "-5%",
          transform: "translate(50%, -50%)",
          border: `1px solid hsl(24 95% 50% / ${0.15 - i * 0.02})`,
        }}
        animate={{
          scale: [0.6, 1.4],
          opacity: [0.3, 0],
        }}
        transition={{
          duration: 3,
          repeat: Infinity,
          delay: i * 0.5,
          ease: "easeOut",
        }}
      />
    ))}
    {/* Floating data packets */}
    {Array.from({ length: 8 }).map((_, i) => (
      <motion.div
        key={`packet-${i}`}
        className="absolute w-1 h-1 bg-primary rounded-full"
        style={{ left: `${50 + Math.random() * 50}%`, top: `${20 + Math.random() * 60}%` }}
        animate={{
          x: [0, -200 - Math.random() * 300],
          opacity: [0, 1, 0],
          scale: [0.5, 1.5, 0.5],
        }}
        transition={{
          duration: 2 + Math.random() * 2,
          repeat: Infinity,
          delay: Math.random() * 3,
          ease: "easeOut",
        }}
      />
    ))}
  </div>
);

/* ── Signal Tower Hero Visualization ── */
const SignalTowerViz = () => (
  <div className="relative w-72 sm:w-96 h-72 sm:h-96 flex items-center justify-center">
    {/* Concentric pulse rings */}
    {[0, 1, 2, 3, 4].map((i) => (
      <motion.div
        key={`ring-${i}`}
        className="absolute rounded-full border"
        style={{
          width: `${50 + i * 40}px`, height: `${50 + i * 40}px`,
          borderColor: `hsl(24 95% 50% / ${0.25 - i * 0.04})`,
        }}
        animate={{
          scale: [1, 1.3, 1],
          opacity: [0.3, 0.05, 0.3],
        }}
        transition={{ duration: 2.5, repeat: Infinity, delay: i * 0.4 }}
      />
    ))}

    {/* Central tower icon with glow */}
    <motion.div
      className="relative z-10 w-24 h-24 rounded-full bg-gradient-to-br from-primary/40 to-primary/10 border border-primary/30 flex items-center justify-center"
      animate={{
        boxShadow: [
          "0 0 20px hsl(24 95% 50% / 0), 0 0 60px hsl(24 95% 50% / 0)",
          "0 0 30px hsl(24 95% 50% / 0.3), 0 0 80px hsl(24 95% 50% / 0.1)",
          "0 0 20px hsl(24 95% 50% / 0), 0 0 60px hsl(24 95% 50% / 0)",
        ],
      }}
      transition={{ duration: 2.5, repeat: Infinity }}
    >
      <Signal className="w-12 h-12 text-primary" />
    </motion.div>

    {/* Orbiting devices */}
    {[
      { icon: Smartphone, label: "Celular", angle: -40, dist: 130, color: "hsl(220 80% 60%)" },
      { icon: Monitor, label: "Smart TV", angle: 30, dist: 140, color: "hsl(150 70% 50%)" },
      { icon: Home, label: "Casa", angle: 100, dist: 125, color: "hsl(24 95% 50%)" },
      { icon: Router, label: "Notebook", angle: 170, dist: 135, color: "hsl(280 60% 60%)" },
      { icon: Globe, label: "IoT", angle: 240, dist: 120, color: "hsl(40 90% 50%)" },
    ].map((d, i) => {
      const rad = ((d.angle - 90) * Math.PI) / 180;
      const x = Math.cos(rad) * d.dist;
      const y = Math.sin(rad) * d.dist;
      return (
        <motion.div
          key={d.label}
          className="absolute flex flex-col items-center gap-1 z-10"
          style={{
            left: `calc(50% + ${x}px)`,
            top: `calc(50% + ${y}px)`,
            transform: "translate(-50%, -50%)",
          }}
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.8 + i * 0.15, type: "spring" }}
        >
          {/* Animated connection line (SVG) */}
          <motion.div
            className="w-10 h-10 rounded-xl border flex items-center justify-center backdrop-blur-sm"
            style={{ backgroundColor: `${d.color}15`, borderColor: `${d.color}30` }}
            animate={{ y: [0, -3, 0] }}
            transition={{ duration: 3, repeat: Infinity, delay: i * 0.6 }}
            whileHover={{ scale: 1.2, borderColor: d.color }}
          >
            <d.icon className="w-4 h-4" style={{ color: d.color }} />
          </motion.div>
          <span className="text-[8px] text-white/40 font-bold">{d.label}</span>
        </motion.div>
      );
    })}

    {/* Animated connection rays from center to devices */}
    <svg className="absolute inset-0 w-full h-full pointer-events-none z-0" viewBox="0 0 384 384">
      {[
        { angle: -40, dist: 130 },
        { angle: 30, dist: 140 },
        { angle: 100, dist: 125 },
        { angle: 170, dist: 135 },
        { angle: 240, dist: 120 },
      ].map((d, i) => {
        const rad = ((d.angle - 90) * Math.PI) / 180;
        const ex = 192 + Math.cos(rad) * d.dist;
        const ey = 192 + Math.sin(rad) * d.dist;
        return (
          <motion.line
            key={i} x1="192" y1="192" x2={ex} y2={ey}
            stroke="hsl(24 95% 50%)" strokeWidth="0.8" strokeDasharray="4 6"
            animate={{ opacity: [0.1, 0.4, 0.1], strokeDashoffset: [0, -20] }}
            transition={{ duration: 2, repeat: Infinity, delay: i * 0.3 }}
          />
        );
      })}
    </svg>
  </div>
);

/* ── Live Latency Monitor (UNIQUE) ── */
const LiveLatencyMonitor = () => {
  const [values, setValues] = useState<number[]>(Array(20).fill(8));

  useEffect(() => {
    const interval = setInterval(() => {
      setValues((prev) => {
        const next = [...prev.slice(1), 5 + Math.random() * 8];
        return next;
      });
    }, 500);
    return () => clearInterval(interval);
  }, []);

  const max = 20;
  const points = values.map((v, i) => `${(i / (values.length - 1)) * 100},${100 - (v / max) * 100}`).join(" ");

  return (
    <div className="bg-white/[0.03] border border-white/[0.08] rounded-2xl p-5 overflow-hidden">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Activity className="w-4 h-4 text-primary" />
          <span className="text-xs font-bold text-white/80">Latência em Tempo Real</span>
        </div>
        <div className="flex items-center gap-1.5">
          <motion.div
            className="w-2 h-2 rounded-full bg-green-400"
            animate={{ opacity: [1, 0.3, 1] }}
            transition={{ duration: 1, repeat: Infinity }}
          />
          <span className="text-[10px] text-green-400 font-bold">{values[values.length - 1].toFixed(0)}ms</span>
        </div>
      </div>
      <svg viewBox="0 0 100 100" className="w-full h-20" preserveAspectRatio="none">
        <defs>
          <linearGradient id="latencyFill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="hsl(24 95% 50%)" stopOpacity="0.3" />
            <stop offset="100%" stopColor="hsl(24 95% 50%)" stopOpacity="0" />
          </linearGradient>
        </defs>
        {/* Grid lines */}
        {[25, 50, 75].map((y) => (
          <line key={y} x1="0" y1={y} x2="100" y2={y} stroke="white" strokeOpacity="0.05" strokeWidth="0.3" />
        ))}
        <polygon
          points={`0,100 ${points} 100,100`}
          fill="url(#latencyFill)"
        />
        <polyline
          points={points}
          fill="none" stroke="hsl(24 95% 50%)" strokeWidth="1.5" strokeLinejoin="round"
        />
        {/* Current dot */}
        <circle cx="100" cy={100 - (values[values.length - 1] / max) * 100} r="2" fill="hsl(24 95% 50%)">
          <animate attributeName="r" values="2;3;2" dur="1s" repeatCount="indefinite" />
        </circle>
      </svg>
      <div className="flex justify-between mt-2 text-[9px] text-white/30">
        <span>10s atrás</span>
        <span>agora</span>
      </div>
    </div>
  );
};

/* ── Before/After - Cables vs Wireless (UNIQUE) ── */
const BeforeAfter = () => {
  const [showAfter, setShowAfter] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => setShowAfter((p) => !p), 3000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="max-w-md mx-auto">
      <div className="flex gap-2 mb-4 justify-center">
        <button
          onClick={() => setShowAfter(false)}
          className={`px-4 py-2 rounded-full text-xs font-bold transition-all ${
            !showAfter ? "bg-red-500/20 text-red-400 border border-red-500/30" : "bg-white/5 text-white/30"
          }`}
        >
          <WifiOff className="w-3 h-3 inline mr-1" /> Internet Comum
        </button>
        <button
          onClick={() => setShowAfter(true)}
          className={`px-4 py-2 rounded-full text-xs font-bold transition-all ${
            showAfter ? "bg-primary/20 text-primary border border-primary/30" : "bg-white/5 text-white/30"
          }`}
        >
          <Signal className="w-3 h-3 inline mr-1" /> FWA 5G
        </button>
      </div>
      <AnimatePresence mode="wait">
        {!showAfter ? (
          <motion.div
            key="before"
            className="bg-red-500/5 border border-red-500/10 rounded-2xl p-6"
            initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }}
          >
            <div className="grid grid-cols-2 gap-4 mb-4">
              {[
                { label: "Velocidade", value: "50 Mbps", bad: true },
                { label: "Latência", value: "45ms", bad: true },
                { label: "Instalação", value: "3-7 dias", bad: true },
                { label: "Estabilidade", value: "Instável", bad: true },
              ].map((m) => (
                <div key={m.label} className="text-center">
                  <p className="text-[10px] text-white/30 mb-0.5">{m.label}</p>
                  <p className="text-sm font-bold text-red-400">{m.value}</p>
                </div>
              ))}
            </div>
            <div className="flex items-center gap-3 bg-red-500/10 rounded-xl px-3 py-2">
              <Cable className="w-5 h-5 text-red-400 shrink-0" />
              <div>
                <p className="text-xs font-bold text-red-400">Cabos por toda casa</p>
                <p className="text-[10px] text-white/30">Instalação complexa, furos na parede</p>
              </div>
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="after"
            className="bg-primary/5 border border-primary/10 rounded-2xl p-6"
            initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}
          >
            <div className="grid grid-cols-2 gap-4 mb-4">
              {[
                { label: "Velocidade", value: "500 Mbps" },
                { label: "Latência", value: "8ms" },
                { label: "Instalação", value: "3 minutos" },
                { label: "Estabilidade", value: "99.9%" },
              ].map((m) => (
                <div key={m.label} className="text-center">
                  <p className="text-[10px] text-white/30 mb-0.5">{m.label}</p>
                  <p className="text-sm font-bold text-primary">{m.value}</p>
                </div>
              ))}
            </div>
            <div className="flex items-center gap-3 bg-primary/10 rounded-xl px-3 py-2">
              <PlugZap className="w-5 h-5 text-primary shrink-0" />
              <div>
                <p className="text-xs font-bold text-primary">Só precisa de uma tomada</p>
                <p className="text-[10px] text-white/30">Plug & Play, sem cabos, sem furos</p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

/* ── Tech Specs Panel (UNIQUE) ── */
const TechSpecsPanel = () => {
  const specs = [
    { label: "Tecnologia", value: "5G NR (New Radio)", icon: Signal },
    { label: "Frequência", value: "3.5 GHz / mmWave", icon: Activity },
    { label: "Wi-Fi", value: "Wi-Fi 6 (802.11ax)", icon: Wifi },
    { label: "Latência", value: "< 10ms", icon: Gauge },
    { label: "Segurança", value: "WPA3 Enterprise", icon: Shield },
    { label: "Cobertura", value: "Até 150m²", icon: Home },
  ];

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 max-w-xl mx-auto">
      {specs.map((spec, i) => (
        <motion.div
          key={spec.label}
          className="bg-white/[0.03] border border-white/[0.06] rounded-xl p-3 text-center group hover:border-primary/20 transition-all"
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ delay: i * 0.08 }}
          whileHover={{ y: -2 }}
        >
          <spec.icon className="w-4 h-4 text-primary/50 mx-auto mb-2 group-hover:text-primary transition-colors" />
          <p className="text-[10px] text-white/30 mb-0.5">{spec.label}</p>
          <p className="text-xs font-bold text-white/70">{spec.value}</p>
        </motion.div>
      ))}
    </div>
  );
};

/* ── Coverage Radar (UNIQUE) ── */
const CoverageRadar = () => (
  <div className="relative w-56 h-56 mx-auto">
    <svg viewBox="0 0 200 200" className="w-full h-full">
      {[30, 60, 90].map((r) => (
        <circle key={r} cx="100" cy="100" r={r} fill="none" stroke="hsl(24 95% 50% / 0.1)" strokeWidth="0.5" />
      ))}
      <line x1="100" y1="10" x2="100" y2="190" stroke="hsl(24 95% 50% / 0.05)" strokeWidth="0.5" />
      <line x1="10" y1="100" x2="190" y2="100" stroke="hsl(24 95% 50% / 0.05)" strokeWidth="0.5" />
      <motion.g animate={{ rotate: 360 }} transition={{ duration: 4, repeat: Infinity, ease: "linear" }} style={{ transformOrigin: "100px 100px" }}>
        <line x1="100" y1="100" x2="100" y2="10" stroke="hsl(24 95% 50% / 0.6)" strokeWidth="1" />
        <path d="M 100 100 L 100 10 A 90 90 0 0 1 163 37 Z" fill="hsl(24 95% 50% / 0.08)" />
      </motion.g>
      {[
        { x: 120, y: 60 }, { x: 70, y: 80 }, { x: 140, y: 120 },
        { x: 80, y: 130 }, { x: 110, y: 90 }, { x: 60, y: 60 },
        { x: 150, y: 80 }, { x: 90, y: 150 }, { x: 130, y: 70 },
      ].map((p, i) => (
        <motion.circle
          key={i} cx={p.x} cy={p.y} r="2.5"
          fill="hsl(24 95% 50%)" opacity="0.6"
          animate={{ opacity: [0.2, 0.8, 0.2], r: [2, 3, 2] }}
          transition={{ duration: 3, repeat: Infinity, delay: i * 0.4 }}
        />
      ))}
    </svg>
    <div className="absolute inset-0 flex items-center justify-center">
      <div className="w-3 h-3 rounded-full bg-primary shadow-glow" />
    </div>
  </div>
);

/* ── Installation Timeline (UNIQUE) ── */
const InstallationTimeline = () => {
  const steps = [
    { icon: "📦", title: "Receba o Roteador", desc: "Entregamos o equipamento 5G na sua porta", time: "Dia 1" },
    { icon: "🔌", title: "Conecte na Tomada", desc: "Basta ligar o roteador — zero cabos extras", time: "2 min" },
    { icon: "📶", title: "Conecte-se", desc: "O roteador detecta o sinal 5G automaticamente", time: "1 min" },
    { icon: "🎉", title: "Pronto!", desc: "Navegue em altíssima velocidade sem cabos", time: "Agora" },
  ];
  return (
    <div className="max-w-2xl mx-auto">
      <div className="relative">
        <div className="absolute left-6 top-0 bottom-0 w-px bg-gradient-to-b from-primary/40 via-primary/20 to-transparent" />
        <div className="space-y-6">
          {steps.map((s, i) => (
            <motion.div
              key={s.title}
              className="flex items-start gap-5 relative"
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.15 }}
            >
              <div className="relative z-10 w-12 h-12 rounded-full bg-white/[0.05] border border-primary/20 flex items-center justify-center text-lg shrink-0">
                {s.icon}
              </div>
              <div className="flex-1 bg-white/[0.03] border border-white/[0.06] rounded-xl p-4">
                <div className="flex items-center justify-between mb-1">
                  <h4 className="font-bold text-sm text-white">{s.title}</h4>
                  <span className="text-[10px] text-primary font-bold bg-primary/10 px-2 py-0.5 rounded-full">{s.time}</span>
                </div>
                <p className="text-xs text-white/50">{s.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

/* ── Wireless Benchmark (UNIQUE) ── */
const WirelessBenchmark = () => {
  const metrics = [
    { label: "Download", fwa: "500 Mbps", other: "50 Mbps", fwaPercent: 100, otherPercent: 10 },
    { label: "Upload", fwa: "100 Mbps", other: "10 Mbps", fwaPercent: 100, otherPercent: 10 },
    { label: "Latência", fwa: "8ms", other: "45ms", fwaPercent: 18, otherPercent: 90 },
    { label: "Estabilidade", fwa: "99%", other: "75%", fwaPercent: 99, otherPercent: 75 },
  ];
  return (
    <div className="max-w-lg mx-auto space-y-5">
      {metrics.map((m, i) => (
        <motion.div key={m.label}
          initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }} transition={{ delay: i * 0.1 }}
        >
          <div className="flex justify-between text-xs mb-2">
            <span className="text-white/60 font-semibold">{m.label}</span>
          </div>
          <div className="space-y-1.5">
            <div className="flex items-center gap-3">
              <span className="text-[10px] font-bold text-primary w-16">FWA 5G</span>
              <div className="flex-1 h-2.5 bg-white/5 rounded-full overflow-hidden">
                <motion.div
                  className="h-full rounded-full bg-gradient-to-r from-primary to-orange-400"
                  initial={{ width: 0 }}
                  whileInView={{ width: `${m.label === "Latência" ? 100 - m.fwaPercent : m.fwaPercent}%` }}
                  viewport={{ once: true }}
                  transition={{ duration: 1.2, delay: i * 0.1, ease: "easeOut" }}
                />
              </div>
              <span className="text-[10px] font-bold text-white/70 w-16 text-right">{m.fwa}</span>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-[10px] font-bold text-white/30 w-16">Rádio</span>
              <div className="flex-1 h-2.5 bg-white/5 rounded-full overflow-hidden">
                <motion.div
                  className="h-full rounded-full bg-white/10"
                  initial={{ width: 0 }}
                  whileInView={{ width: `${m.label === "Latência" ? 100 - m.otherPercent : m.otherPercent}%` }}
                  viewport={{ once: true }}
                  transition={{ duration: 1.2, delay: i * 0.1, ease: "easeOut" }}
                />
              </div>
              <span className="text-[10px] font-bold text-white/30 w-16 text-right">{m.other}</span>
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
};

/* ── Standard backgrounds ── */
const ParticleField = () => {
  const particles = Array.from({ length: 25 }, (_, i) => ({
    id: i, x: Math.random() * 100, y: Math.random() * 100,
    size: Math.random() * 3 + 1, duration: Math.random() * 20 + 15, delay: Math.random() * 10
  }));
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {particles.map((p) => (
        <motion.div key={p.id} className="absolute rounded-full bg-primary"
          style={{ left: `${p.x}%`, top: `${p.y}%`, width: p.size, height: p.size }}
          animate={{ y: [0, -40, 0, 30, 0], x: [0, 20, -10, 15, 0], opacity: [0.1, 0.5, 0.2, 0.6, 0.1] }}
          transition={{ duration: p.duration, repeat: Infinity, delay: p.delay, ease: "easeInOut" }}
        />
      ))}
    </div>
  );
};

const GlowingOrbs = () => (
  <div className="absolute inset-0 overflow-hidden pointer-events-none">
    <motion.div className="absolute w-[600px] h-[600px] rounded-full"
      style={{ background: "radial-gradient(circle, hsl(24 95% 50% / 0.12) 0%, transparent 70%)", top: "-10%", left: "-15%" }}
      animate={{ scale: [1, 1.3, 1], opacity: [0.4, 0.7, 0.4] }}
      transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
    />
    <motion.div className="absolute w-[500px] h-[500px] rounded-full"
      style={{ background: "radial-gradient(circle, hsl(200 80% 50% / 0.08) 0%, transparent 70%)", bottom: "-20%", right: "-10%" }}
      animate={{ scale: [1.2, 1, 1.2], opacity: [0.3, 0.6, 0.3] }}
      transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
    />
  </div>
);

const CyberGrid = () => (
  <div className="absolute inset-0 overflow-hidden pointer-events-none">
    <div className="absolute inset-0 opacity-[0.04]"
      style={{ backgroundImage: `linear-gradient(hsl(24 95% 50%) 1px, transparent 1px), linear-gradient(90deg, hsl(24 95% 50%) 1px, transparent 1px)`, backgroundSize: "80px 80px" }}
    />
    <motion.div className="absolute left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent"
      animate={{ top: ["0%", "100%"] }}
      transition={{ duration: 6, repeat: Infinity, ease: "linear" }}
    />
  </div>
);

const DataStreams = () => (
  <div className="absolute inset-0 overflow-hidden pointer-events-none">
    {[20, 40, 60, 80].map((left, i) => (
      <motion.div key={i} className="absolute w-px h-32"
        style={{ left: `${left}%`, background: `linear-gradient(to bottom, transparent, hsl(24 95% 50% / 0.2), transparent)` }}
        animate={{ top: ["-20%", "120%"] }}
        transition={{ duration: 4 + i, repeat: Infinity, delay: i * 1.2, ease: "linear" }}
      />
    ))}
  </div>
);

const FaqItem = ({ q, a }: { q: string; a: string }) => {
  const [open, setOpen] = useState(false);
  return (
    <div className="border border-white/10 rounded-2xl overflow-hidden bg-white/[0.03] backdrop-blur-sm">
      <button onClick={() => setOpen(!open)} className="w-full flex items-center justify-between p-5 text-left">
        <span className="text-sm sm:text-base font-semibold text-white pr-4">{q}</span>
        <ChevronDown className={`w-5 h-5 text-primary shrink-0 transition-transform duration-300 ${open ? "rotate-180" : ""}`} />
      </button>
      <AnimatePresence>
        {open && (
          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.3 }}>
            <p className="px-5 pb-5 text-sm text-white/60 leading-relaxed">{a}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

/* ── Data ── */
const fwaPlans = [
  { name: "FWA 200", speed: "200", price: "89", cents: "90", features: ["Wi-Fi 6", "Sem cabos", "Roteador incluso"], popular: false },
  { name: "FWA 400", speed: "400", price: "109", cents: "90", features: ["Wi-Fi 6", "Sem cabos", "Roteador incluso", "Baixa latência"], popular: true },
  { name: "FWA 500", speed: "500", price: "129", cents: "90", features: ["Wi-Fi 6", "Sem cabos", "Roteador Premium", "Baixa latência", "Suporte VIP"], popular: false },
];

const faqs = [
  { q: "O que é internet FWA 5G?", a: "FWA (Fixed Wireless Access) é uma tecnologia que entrega internet de alta velocidade via sinal 5G, sem necessidade de cabos. Um roteador 5G recebe o sinal e distribui Wi-Fi 6 na sua casa." },
  { q: "Precisa de instalação com cabos?", a: "Não! A maior vantagem do FWA 5G é que não precisa de cabos. Basta ligar o roteador na tomada e ele já se conecta à rede 5G automaticamente." },
  { q: "Posso levar o roteador para outro cômodo?", a: "Sim! Como não há cabos, você pode posicionar o roteador onde preferir para melhor sinal. Basta ter uma tomada." },
  { q: "A velocidade é a mesma da fibra óptica?", a: "O FWA 5G oferece velocidades excelentes com baixa latência. A experiência é muito similar à fibra óptica para uso residencial." },
  { q: "O sinal é afetado por chuva?", a: "A tecnologia 5G NR opera em frequências otimizadas. Em condições extremas pode haver leve variação, mas o sistema se adapta automaticamente para manter a estabilidade." },
  { q: "Quantos dispositivos posso conectar?", a: "O roteador Wi-Fi 6 suporta até 64 dispositivos simultâneos com tecnologia MU-MIMO, sem perda de performance." },
];

const InternetFWA5G = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[hsl(220,20%,6%)] text-white overflow-x-hidden">
      <Navbar />

      {/* ══ HERO ══ */}
      <section className="relative pt-[128px] sm:pt-[132px] md:pt-[176px] lg:pt-[184px] pb-16 sm:pb-24 overflow-hidden">
        <GlowingOrbs />
        <SignalPropagation />
        <ParticleField />
        <div className="container mx-auto px-4 relative z-10">
          <div className="grid lg:grid-cols-2 gap-10 lg:gap-16 items-center">
            <motion.div initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
              <motion.span
                className="inline-flex items-center gap-2 bg-gradient-to-r from-primary/20 to-blue-500/10 border border-primary/30 text-primary text-xs font-bold px-4 py-2 rounded-full mb-6 backdrop-blur-sm"
                initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.2 }}
              >
                <motion.div animate={{ rotate: [0, 360] }} transition={{ duration: 4, repeat: Infinity, ease: "linear" }}>
                  <Sparkles className="w-3.5 h-3.5" />
                </motion.div>
                Nova Tecnologia Sem Fio
              </motion.span>
              <h1 className="font-display text-3xl sm:text-5xl lg:text-6xl xl:text-7xl font-bold leading-[1.05] mb-6">
                <span className="block">INTERNET</span>
                <motion.span
                  className="block bg-gradient-to-r from-primary via-orange-400 to-primary bg-clip-text text-transparent bg-[length:200%_auto]"
                  animate={{ backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"] }}
                  transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
                >FWA 5G</motion.span>
                <span className="block">SEM CABOS<span className="text-primary">.</span></span>
              </h1>
              <p className="text-white/60 text-base sm:text-lg max-w-lg mb-8 leading-relaxed">
                Internet residencial <strong className="text-primary font-bold">livre de cabos</strong>. Ultravelocidade com Wi-Fi 6, instalação em minutos.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 mb-8">
                <Button size="lg" className="bg-primary text-primary-foreground rounded-full px-8 text-sm font-bold h-12 shadow-glow"
                  onClick={() => document.querySelector("#planos")?.scrollIntoView({ behavior: "smooth" })}
                >
                  <span className="flex items-center gap-2">Aproveitar Oferta <ArrowRight className="w-4 h-4" /></span>
                </Button>
                <Button size="lg" variant="outline"
                  className="border-primary/50 text-primary hover:bg-primary/10 rounded-full px-8 h-12 font-bold backdrop-blur-sm"
                  asChild
                >
                  <a href="https://wa.me/558005945678" target="_blank" rel="noopener noreferrer">
                    <MessageCircle className="w-4 h-4 mr-1" /> Falar no WhatsApp
                  </a>
                </Button>
              </div>
              <div className="flex flex-wrap gap-6 text-xs sm:text-sm text-white/50">
                {[{ icon: Check, label: "Sem Cabos" }, { icon: Check, label: "Wi-Fi 6" }, { icon: Check, label: "< 10ms Latência" }].map((item) => (
                  <span key={item.label} className="flex items-center gap-1.5"><item.icon className="w-4 h-4 text-primary" /> {item.label}</span>
                ))}
              </div>
            </motion.div>

            {/* Hero: Signal Tower with Devices */}
            <motion.div className="flex justify-center lg:justify-end" initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 1, delay: 0.3 }}>
              <div className="relative">
                <div className="absolute inset-0 bg-primary/10 blur-[120px] rounded-full" />
                <SignalTowerViz />
                <motion.div
                  className="absolute -top-2 -right-2 sm:-top-4 sm:-right-4 bg-gradient-to-br from-primary to-orange-600 text-primary-foreground text-lg sm:text-xl font-black px-4 py-2 rounded-2xl shadow-glow-lg z-20"
                  animate={{ y: [0, -8, 0] }}
                  transition={{ duration: 3, repeat: Infinity }}
                >5G</motion.div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ══ FEATURES ══ */}
      <section className="py-12 sm:py-16 border-y border-white/5 relative">
        <DataStreams />
        <div className="container mx-auto px-4 relative z-10">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {[
              { icon: Signal, title: "Ultra Velocidade", desc: "Até 500 Mbps via sinal 5G direto na sua casa.", color: "from-primary/20 to-yellow-500/10" },
              { icon: Zap, title: "Zero Cabos", desc: "Instalação sem quebradeira, sem furos, sem espera.", color: "from-blue-500/20 to-primary/10" },
              { icon: Shield, title: "WPA3 Seguro", desc: "Criptografia de última geração para sua rede.", color: "from-green-500/20 to-primary/10" },
              { icon: Wifi, title: "Wi-Fi 6", desc: "64 dispositivos simultâneos com MU-MIMO.", color: "from-purple-500/20 to-primary/10" },
            ].map((f) => (
              <motion.div key={f.title}
                className="relative bg-white/[0.04] border border-white/[0.08] rounded-2xl p-5 sm:p-6 hover:border-primary/30 transition-all duration-300 group overflow-hidden"
                whileHover={{ y: -4, transition: { duration: 0.2 } }}
              >
                <div className={`absolute inset-0 bg-gradient-to-br ${f.color} opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />
                <div className="relative z-10">
                  <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                    <f.icon className="w-5 h-5 text-primary" />
                  </div>
                  <h3 className="font-display text-sm sm:text-base font-bold mb-2">{f.title}</h3>
                  <p className="text-xs sm:text-sm text-white/50 leading-relaxed">{f.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ══ BEFORE / AFTER (UNIQUE) ══ */}
      <section className="py-16 sm:py-24 relative">
        <GlowingOrbs />
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center mb-10 sm:mb-14">
            <span className="inline-flex items-center gap-2 text-primary text-xs font-bold mb-4">
              <Zap className="w-4 h-4" /> Comparação
            </span>
            <h2 className="font-display text-2xl sm:text-4xl lg:text-5xl font-bold mb-4">
              Antes e <span className="text-primary">depois</span> do 5G
            </h2>
            <p className="text-white/50 text-sm sm:text-base max-w-md mx-auto">
              Veja a diferença real entre internet comum e FWA 5G
            </p>
          </div>
          <BeforeAfter />
        </div>
      </section>

      {/* ══ TECH SPECS (UNIQUE) ══ */}
      <section className="py-16 sm:py-24 border-y border-white/5 relative">
        <CyberGrid />
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center mb-10 sm:mb-14">
            <span className="inline-flex items-center gap-2 text-primary text-xs font-bold mb-4">
              <Gauge className="w-4 h-4" /> Especificações Técnicas
            </span>
            <h2 className="font-display text-2xl sm:text-4xl font-bold mb-4">
              Tecnologia de <span className="text-primary">ponta</span>
            </h2>
            <p className="text-white/50 text-sm sm:text-base max-w-md mx-auto">
              Equipamento 5G NR com Wi-Fi 6 e segurança WPA3
            </p>
          </div>
          <TechSpecsPanel />
        </div>
      </section>

      {/* ══ INSTALLATION TIMELINE (UNIQUE) ══ */}
      <section className="py-16 sm:py-24 relative">
        <GlowingOrbs />
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center mb-10 sm:mb-14">
            <span className="inline-flex items-center gap-2 text-primary text-xs font-bold mb-4">
              <Clock className="w-4 h-4" /> Instalação Instantânea
            </span>
            <h2 className="font-display text-2xl sm:text-4xl lg:text-5xl font-bold mb-4">
              Pronto em <span className="text-primary">3 minutos</span>
            </h2>
            <p className="text-white/50 text-sm sm:text-base max-w-md mx-auto">
              Sem técnico, sem cabos, sem espera. A instalação mais rápida do mercado.
            </p>
          </div>
          <InstallationTimeline />
        </div>
      </section>

      {/* EQUIPMENT SHOWCASE */}
      <section className="py-16 sm:py-24 relative overflow-hidden">
        <div className="container mx-auto px-4 relative z-10">
          <div className="grid lg:grid-cols-2 gap-10 lg:gap-16 items-center">
            <motion.div
              className="order-2 lg:order-1 space-y-6"
              initial={{ opacity: 0, x: -40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <span className="inline-flex items-center gap-2 text-primary text-xs font-bold">
                <Signal className="w-4 h-4" /> Roteador 5G Incluso
              </span>
              <h2 className="font-display text-2xl sm:text-4xl font-bold">
                Conecte-se ao <span className="text-primary">futuro</span>
              </h2>
              <p className="text-white/60 text-sm sm:text-base leading-relaxed max-w-md">
                O roteador 5G FWA capta o sinal da torre diretamente e distribui Wi-Fi 6 pela sua casa. Sem cabos, sem instalação complexa — basta ligar na tomada.
              </p>
              <div className="space-y-3">
                {[
                  { label: "Plug & Play", desc: "Ligue na tomada e use em 2 minutos" },
                  { label: "Wi-Fi 6 integrado", desc: "Cobertura de até 150m² sem repetidor" },
                  { label: "Design compacto", desc: "Discreto e elegante em qualquer ambiente" },
                ].map((spec, i) => (
                  <motion.div
                    key={spec.label}
                    className="flex items-start gap-3 bg-white/[0.04] border border-white/[0.08] rounded-xl p-4 hover:border-primary/20 transition-all"
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.1 }}
                  >
                    <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center shrink-0 mt-0.5">
                      <Check className="w-4 h-4 text-primary" />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-white/80">{spec.label}</p>
                      <p className="text-xs text-white/40">{spec.desc}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
            <motion.div
              className="order-1 lg:order-2 relative flex justify-center"
              initial={{ opacity: 0, x: 40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              <div className="relative">
                <div className="absolute inset-0 bg-primary/20 blur-[80px] rounded-full scale-75" />
                <motion.img
                  src={equipment5gRouter}
                  alt="Roteador 5G FWA JD Telecom"
                  className="relative z-10 w-48 sm:w-64 h-auto drop-shadow-2xl"
                  width={800}
                  height={800}
                  loading="lazy"
                  animate={{ y: [0, -14, 0] }}
                  transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
                />
                <motion.div
                  className="absolute -bottom-4 left-1/2 -translate-x-1/2 w-40 h-6 bg-primary/10 rounded-full blur-xl"
                  animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3] }}
                  transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
                />
                <motion.div
                  className="absolute top-4 right-0 bg-gradient-to-br from-primary to-orange-600 text-primary-foreground text-xs font-black px-3 py-1.5 rounded-full shadow-glow z-20"
                  animate={{ scale: [1, 1.05, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  Wi-Fi 6
                </motion.div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ══ LATENCY MONITOR + COVERAGE (UNIQUE) ══ */}
      <section className="py-16 sm:py-24 border-y border-white/5 relative">
        <DataStreams />
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-5xl mx-auto grid lg:grid-cols-2 gap-10 items-start">
            {/* Latency Monitor */}
            <div>
              <span className="inline-flex items-center gap-2 text-primary text-xs font-bold mb-4">
                <Activity className="w-4 h-4" /> Monitoramento
              </span>
              <h3 className="font-display text-xl sm:text-2xl font-bold mb-4">
                Latência <span className="text-primary">ultra-baixa</span>
              </h3>
              <p className="text-white/50 text-sm leading-relaxed mb-6">
                Monitore a performance em tempo real. Ideal para games, video calls e streaming 4K.
              </p>
              <LiveLatencyMonitor />
            </div>

            {/* Coverage Radar */}
            <div>
              <span className="inline-flex items-center gap-2 text-primary text-xs font-bold mb-4">
                <MapPin className="w-4 h-4" /> Cobertura 5G
              </span>
              <h3 className="font-display text-xl sm:text-2xl font-bold mb-4">
                Sinal <span className="text-primary">expandindo</span>
              </h3>
              <p className="text-white/50 text-sm leading-relaxed mb-6">
                Nossa rede 5G cresce a cada dia na região Norte.
              </p>
              <CoverageRadar />
              <div className="grid grid-cols-2 gap-2 mt-6">
                {["Manaus - AM", "Santarém - PA", "Nhamundá - AM", "Redenção - PA"].map((city) => (
                  <div key={city} className="flex items-center gap-2 bg-white/[0.03] border border-white/[0.06] rounded-xl px-3 py-2">
                    <motion.div className="w-2 h-2 rounded-full bg-green-400" animate={{ opacity: [0.5, 1, 0.5] }} transition={{ duration: 2, repeat: Infinity }} />
                    <span className="text-xs text-white/60">{city}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ══ BENCHMARK (UNIQUE) ══ */}
      <section className="py-16 sm:py-24 relative">
        <GlowingOrbs />
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center mb-10 sm:mb-14">
            <span className="inline-flex items-center gap-2 text-primary text-xs font-bold mb-4">
              <Signal className="w-4 h-4" /> Performance
            </span>
            <h2 className="font-display text-2xl sm:text-4xl font-bold mb-4">
              FWA 5G <span className="text-primary">vs</span> Internet por Rádio
            </h2>
            <p className="text-white/50 text-sm sm:text-base max-w-md mx-auto">
              Números reais que mostram a superioridade do 5G
            </p>
          </div>
          <WirelessBenchmark />
        </div>
      </section>

      {/* ══ USE CASES ══ */}
      <section className="py-16 sm:py-24 border-y border-white/5 relative">
        <DataStreams />
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center mb-10 sm:mb-14">
            <h2 className="font-display text-2xl sm:text-4xl lg:text-5xl font-bold mb-4">Eleve sua conexão a <span className="text-primary">outro nível</span></h2>
            <p className="text-white/50 text-sm sm:text-base max-w-md mx-auto">Potencialize suas tarefas do dia a dia com a Internet FWA 5G</p>
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 max-w-5xl mx-auto">
            {[
              { icon: Home, title: "Home Office", desc: "Videoconferências HD sem travamento", color: "from-blue-500/20 to-primary/10" },
              { icon: Monitor, title: "Streaming 4K", desc: "Netflix, Disney+ e YouTube sem buffering", color: "from-purple-500/20 to-primary/10" },
              { icon: Smartphone, title: "Gaming Online", desc: "Latência < 10ms para jogos competitivos", color: "from-green-500/20 to-primary/10" },
              { icon: Router, title: "Smart Home", desc: "Câmeras, Alexa, IoT sem instabilidade", color: "from-primary/20 to-yellow-500/10" },
            ].map((uc) => (
              <motion.div key={uc.title}
                className="relative bg-white/[0.04] border border-white/[0.08] rounded-2xl p-5 sm:p-6 hover:border-primary/30 transition-all duration-300 group overflow-hidden"
                whileHover={{ y: -4 }}
              >
                <div className={`absolute inset-0 bg-gradient-to-br ${uc.color} opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />
                <div className="relative z-10">
                  <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                    <uc.icon className="w-5 h-5 text-primary" />
                  </div>
                  <h3 className="font-display text-sm sm:text-base font-bold mb-2">{uc.title}</h3>
                  <p className="text-xs sm:text-sm text-white/50 leading-relaxed">{uc.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ══ PLANS ══ */}
      <section id="planos" className="py-16 sm:py-24 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-primary/[0.02] to-transparent" />
        <CyberGrid />
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center mb-10 sm:mb-14">
            <span className="inline-flex items-center gap-2 text-primary text-xs font-bold mb-4">
              <Star className="w-4 h-4" /> Planos FWA 5G
            </span>
            <h2 className="font-display text-2xl sm:text-4xl lg:text-5xl font-bold mb-4">Escolha Seu Plano</h2>
            <p className="text-white/50 text-sm sm:text-base max-w-md mx-auto">Internet sem fio de alta velocidade com roteador 5G incluso</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-5 max-w-4xl mx-auto" style={{ perspective: "1200px" }}>
            {fwaPlans.map((plan, idx) => (
              <motion.div key={plan.name} className="relative h-full"
                initial={{ opacity: 0, y: 40, rotateX: 8 }} whileInView={{ opacity: 1, y: 0, rotateX: 0 }}
                viewport={{ once: true }} transition={{ delay: idx * 0.12, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                whileHover={{ y: -10, scale: 1.03, rotateY: plan.popular ? 0 : (idx === 0 ? 2 : -2), transition: { duration: 0.3, ease: "easeOut" } }}
                style={{ transformStyle: "preserve-3d" }}
              >
                {plan.popular && (
                  <motion.div
                    className="absolute -top-3 left-1/2 -translate-x-1/2 z-10 bg-primary text-primary-foreground text-[10px] font-bold px-3 py-1 rounded-full whitespace-nowrap"
                    animate={{ y: [0, -3, 0], scale: [1, 1.05, 1] }}
                    transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                  >
                    ⭐ MAIS POPULAR
                  </motion.div>
                )}
                <div className={`rounded-2xl overflow-hidden h-full flex flex-col border transition-all duration-500 backdrop-blur-sm group relative ${plan.popular ? "border-primary shadow-glow-lg bg-white/[0.06]" : "border-white/[0.08] bg-white/[0.03] hover:border-primary/40 hover:shadow-[0_0_30px_hsl(24_95%_50%/0.15)]"}`}>
                  <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none overflow-hidden rounded-2xl">
                    <motion.div className="absolute -inset-full bg-gradient-to-r from-transparent via-white/[0.05] to-transparent skew-x-12"
                      animate={{ x: ["-100%", "200%"] }}
                      transition={{ duration: 3, repeat: Infinity, repeatDelay: 2 }}
                    />
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-b from-primary/[0.04] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none rounded-2xl" />
                  <div className="px-4 py-2 flex items-center gap-2 bg-gradient-to-r from-primary/15 to-transparent relative z-10">
                    <Signal className="w-3.5 h-3.5 text-primary" />
                    <span className="text-[10px] font-bold text-primary tracking-wider uppercase">{plan.speed} MEGA • 5G</span>
                  </div>
                  <div className="p-5 flex-1 flex flex-col relative z-10">
                    <h3 className="font-display text-xs sm:text-sm font-bold mb-4 text-white/90">{plan.name}</h3>
                    <div className="flex items-center gap-2.5 mb-3">
                      <Globe className="w-4 h-4 text-primary shrink-0" />
                      <div>
                        <span className="text-lg font-bold">{plan.speed} Mbps</span>
                        <span className="text-[10px] text-white/40 ml-1.5">DOWNLOAD</span>
                      </div>
                    </div>
                    {plan.features.map((f, i) => (
                      <motion.div key={i} className="flex items-center gap-2 mb-2"
                        initial={{ opacity: 0, x: -8 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: idx * 0.1 + i * 0.06, duration: 0.4 }}
                      >
                        <motion.div whileHover={{ scale: 1.3, rotate: 10 }} transition={{ type: "spring", stiffness: 400 }}>
                          <Check className="w-3.5 h-3.5 text-primary shrink-0" />
                        </motion.div>
                        <span className="text-xs text-white/60">{f}</span>
                      </motion.div>
                    ))}
                    <div className="mt-auto pt-4">
                      <p className="text-[10px] text-white/40 mb-1">Por apenas</p>
                      <div className="flex items-baseline mb-4">
                        <span className="text-sm text-primary font-bold mr-1">R$</span>
                        <motion.span className="font-display text-3xl sm:text-4xl font-extrabold"
                          initial={{ scale: 0.8, opacity: 0 }}
                          whileInView={{ scale: 1, opacity: 1 }}
                          viewport={{ once: true }}
                          transition={{ delay: idx * 0.1 + 0.3, type: "spring", stiffness: 200 }}
                        >{plan.price}</motion.span>
                        <span className="text-sm font-bold">.{plan.cents}</span>
                        <span className="text-xs text-white/40 ml-1">/mês</span>
                      </div>
                      <motion.div whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}>
                        <Button
                          className={`w-full rounded-xl h-11 text-sm font-bold transition-all duration-300 ${plan.popular ? "bg-primary text-primary-foreground hover:bg-primary/90 hover:shadow-[0_0_20px_hsl(24_95%_50%/0.4)] shadow-glow" : "bg-primary/20 text-primary border border-primary/30 hover:bg-primary/30 hover:shadow-[0_0_15px_hsl(24_95%_50%/0.2)]"}`}
                          onClick={() => navigate("/cadastro")}
                        >
                          Assinar Agora
                        </Button>
                      </motion.div>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ══ FAQ ══ */}
      <section className="py-16 sm:py-24 border-t border-white/5">
        <div className="container mx-auto px-4">
          <div className="text-center mb-10 sm:mb-14">
            <h2 className="font-display text-2xl sm:text-4xl font-bold mb-3">Perguntas Frequentes</h2>
            <p className="text-white/50 text-sm sm:text-base">Tire suas dúvidas sobre internet FWA 5G</p>
          </div>
          <div className="max-w-2xl mx-auto space-y-3">
            {faqs.map((faq, i) => <FaqItem key={i} q={faq.q} a={faq.a} />)}
          </div>
        </div>
      </section>

      {/* ══ CTA ══ */}
      <section className="py-16 sm:py-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary via-[hsl(20,92%,45%)] to-[hsl(10,80%,35%)]" />
        <div className="absolute inset-0 opacity-20" style={{ backgroundImage: `radial-gradient(circle at 30% 50%, white 0%, transparent 50%)` }} />
        <ParticleField />
        <div className="container mx-auto px-4 relative z-10 text-center">
          <h2 className="font-display text-2xl sm:text-4xl lg:text-5xl font-bold text-white mb-4">Internet 5G sem complicação</h2>
          <p className="text-white/80 text-sm sm:text-base mb-8 max-w-md mx-auto">Assine agora e conecte-se ao futuro sem cabos.</p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Button size="lg" className="bg-white text-primary hover:bg-white/90 rounded-full px-8 h-12 font-bold shadow-lg" onClick={() => navigate("/cadastro")}>
              Assinar Agora <ArrowRight className="w-4 h-4 ml-1" />
            </Button>
            <Button size="lg" className="bg-transparent border-2 border-white/40 text-white hover:bg-white/10 rounded-full px-8 h-12 font-bold" asChild>
              <a href="https://wa.me/558005945678" target="_blank" rel="noopener noreferrer">
                <MessageCircle className="w-4 h-4 mr-1" /> Falar no WhatsApp
              </a>
            </Button>
          </div>
        </div>
      </section>

      <ProductTestimonials produto="fwa5g" title="Clientes conectados via 5G" subtitle="Depoimentos FWA 5G" />

      <Footer />
      <WhatsAppButton />
    </div>
  );
};

export default InternetFWA5G;
