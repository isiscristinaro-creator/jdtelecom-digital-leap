import { useState, useEffect } from "react";
import { motion, AnimatePresence, useMotionValue, useTransform, animate } from "framer-motion";
import { Button } from "@/components/ui/button";
import {
  Wifi, Shield, Zap, ChevronDown, Check, ArrowRight, Headphones,
  Star, Sparkles, Globe, FileText, Phone,
  MessageCircle, MapPin, CreditCard, Activity, Gauge, Network
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import WhatsAppButton from "@/components/WhatsAppButton";
import equipmentFiberRouter from "@/assets/equipment-fiber-router.png";
import ProductTestimonials from "@/components/ProductTestimonials";

/* ══════════════════════════════════════════════════════════════
   FIBRA ÓPTICA — Unique Elements:
   1. FiberOpticLines — animated light pulses traveling through fiber cables
   2. SpeedGauge — animated speedometer with real-time needle
   3. NetworkTopology — animated network nodes diagram
   4. FiberVsCopper — interactive comparison section
   5. LiveSpeedCounter — animated counter showing speed values
   ══════════════════════════════════════════════════════════════ */

/* ── Fiber Optic Light Pulses (UNIQUE to Fibra) ── */
const FiberOpticLines = () => {
  const paths = [
    "M0,30 Q25,10 50,30 T100,30",
    "M0,50 Q30,30 60,50 T100,50",
    "M0,70 Q20,90 50,70 T100,70",
  ];
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-30">
      <svg viewBox="0 0 100 100" className="w-full h-full" preserveAspectRatio="none">
        {paths.map((d, i) => (
          <g key={i}>
            <path d={d} fill="none" stroke="hsl(24 95% 50% / 0.15)" strokeWidth="0.3" />
            <motion.circle r="1" fill="hsl(24 95% 50%)" filter="url(#fiberGlow)">
              <animateMotion dur={`${3 + i * 0.8}s`} repeatCount="indefinite" path={d} />
            </motion.circle>
            <motion.circle r="0.6" fill="hsl(40 100% 70%)">
              <animateMotion dur={`${3 + i * 0.8}s`} repeatCount="indefinite" path={d} begin={`${1.5 + i * 0.4}s`} />
            </motion.circle>
          </g>
        ))}
        <defs>
          <filter id="fiberGlow">
            <feGaussianBlur stdDeviation="0.8" result="blur" />
            <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
          </filter>
        </defs>
      </svg>
    </div>
  );
};

/* ── Speed Gauge (UNIQUE to Fibra) ── */
const SpeedGauge = ({ speed }: { speed: number }) => {
  const angle = useMotionValue(0);
  const displaySpeed = useMotionValue(0);

  useEffect(() => {
    const maxAngle = (speed / 1000) * 240 - 120;
    animate(angle, maxAngle, { duration: 2, ease: "easeOut" });
    animate(displaySpeed, speed, { duration: 2, ease: "easeOut" });
  }, [speed]);

  const rotation = useTransform(angle, (v) => `rotate(${v}deg)`);

  return (
    <div className="relative w-48 h-48 sm:w-56 sm:h-56">
      {/* Gauge background */}
      <svg viewBox="0 0 200 200" className="w-full h-full">
        <defs>
          <linearGradient id="gaugeGrad" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="hsl(24 95% 50% / 0.2)" />
            <stop offset="100%" stopColor="hsl(24 95% 50% / 0.8)" />
          </linearGradient>
        </defs>
        {/* Background arc */}
        <path d="M 30 150 A 80 80 0 1 1 170 150" fill="none" stroke="white" strokeOpacity="0.05" strokeWidth="8" strokeLinecap="round" />
        {/* Filled arc */}
        <motion.path
          d="M 30 150 A 80 80 0 1 1 170 150"
          fill="none" stroke="url(#gaugeGrad)" strokeWidth="8" strokeLinecap="round"
          initial={{ pathLength: 0 }} animate={{ pathLength: speed / 1000 }}
          transition={{ duration: 2, ease: "easeOut" }}
        />
        {/* Tick marks */}
        {[0, 200, 400, 600, 800, 1000].map((v, i) => {
          const a = ((v / 1000) * 240 - 120) * (Math.PI / 180);
          const x1 = 100 + 72 * Math.cos(a);
          const y1 = 100 + 72 * Math.sin(a);
          const x2 = 100 + 80 * Math.cos(a);
          const y2 = 100 + 80 * Math.sin(a);
          const tx = 100 + 62 * Math.cos(a);
          const ty = 100 + 62 * Math.sin(a);
          return (
            <g key={i}>
              <line x1={x1} y1={y1} x2={x2} y2={y2} stroke="white" strokeOpacity="0.3" strokeWidth="1.5" />
              <text x={tx} y={ty} fill="white" fillOpacity="0.4" fontSize="8" textAnchor="middle" dominantBaseline="middle">{v}</text>
            </g>
          );
        })}
      </svg>
      {/* Needle */}
      <motion.div
        className="absolute top-1/2 left-1/2 w-1 h-20 -mt-16 -ml-0.5 origin-bottom"
        style={{ rotate: rotation }}
      >
        <div className="w-full h-full bg-gradient-to-t from-primary to-orange-300 rounded-full" />
      </motion.div>
      {/* Center dot */}
      <div className="absolute top-1/2 left-1/2 w-4 h-4 -mt-2 -ml-2 rounded-full bg-primary shadow-glow" />
      {/* Speed text */}
      <div className="absolute bottom-4 left-0 right-0 text-center">
        <SpeedCounter target={speed} />
        <span className="text-[10px] text-white/40 block">Mbps</span>
      </div>
    </div>
  );
};

const SpeedCounter = ({ target }: { target: number }) => {
  const [val, setVal] = useState(0);
  useEffect(() => {
    let frame: number;
    const start = performance.now();
    const dur = 2000;
    const tick = (now: number) => {
      const p = Math.min((now - start) / dur, 1);
      const ease = 1 - Math.pow(1 - p, 3);
      setVal(Math.round(ease * target));
      if (p < 1) frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [target]);
  return <span className="font-display text-2xl font-black text-white">{val === 1000 ? "1 Gbps" : `${val}`}</span>;
};

/* ── Network Topology (UNIQUE to Fibra) ── */
const NetworkTopology = () => {
  const nodes = [
    { x: 50, y: 15, label: "OLT", main: true },
    { x: 20, y: 45, label: "Splitter" },
    { x: 80, y: 45, label: "Splitter" },
    { x: 10, y: 75, label: "Casa" },
    { x: 30, y: 75, label: "Casa" },
    { x: 70, y: 75, label: "Casa" },
    { x: 90, y: 75, label: "Casa" },
  ];
  const links = [
    [0, 1], [0, 2], [1, 3], [1, 4], [2, 5], [2, 6],
  ];

  return (
    <div className="relative w-full max-w-md mx-auto h-48">
      <svg viewBox="0 0 100 90" className="w-full h-full">
        <defs>
          <filter id="nodeGlow">
            <feGaussianBlur stdDeviation="1.5" result="blur" />
            <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
          </filter>
        </defs>
        {links.map(([a, b], i) => (
          <g key={i}>
            <line
              x1={nodes[a].x} y1={nodes[a].y} x2={nodes[b].x} y2={nodes[b].y}
              stroke="hsl(24 95% 50% / 0.2)" strokeWidth="0.5"
            />
            <motion.circle r="1" fill="hsl(24 95% 50%)" filter="url(#nodeGlow)">
              <animateMotion dur={`${1.5 + i * 0.3}s`} repeatCount="indefinite">
                <mpath xlinkHref={`#link-${i}`} />
              </animateMotion>
            </motion.circle>
            <path id={`link-${i}`} d={`M${nodes[a].x},${nodes[a].y} L${nodes[b].x},${nodes[b].y}`} fill="none" />
          </g>
        ))}
        {nodes.map((n, i) => (
          <g key={i}>
            <motion.circle
              cx={n.x} cy={n.y} r={n.main ? 4 : 2.5}
              fill={n.main ? "hsl(24 95% 50%)" : "hsl(24 95% 50% / 0.5)"}
              filter="url(#nodeGlow)"
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 2, repeat: Infinity, delay: i * 0.3 }}
            />
            <text x={n.x} y={n.y + (n.main ? -7 : 7)} fill="white" fillOpacity="0.5" fontSize="3" textAnchor="middle">{n.label}</text>
          </g>
        ))}
      </svg>
    </div>
  );
};

/* ── Fiber vs Copper Comparison (UNIQUE to Fibra) ── */
const FiberVsCopper = () => {
  const [hoveredSide, setHoveredSide] = useState<"fiber" | "copper" | null>(null);
  const comparisons = [
    { label: "Velocidade", fiber: "Até 1 Gbps", copper: "Até 100 Mbps" },
    { label: "Latência", fiber: "< 5ms", copper: "> 30ms" },
    { label: "Estabilidade", fiber: "99.9%", copper: "~90%" },
    { label: "Distância", fiber: "Sem perda", copper: "Perde sinal" },
  ];
  return (
    <div className="max-w-3xl mx-auto">
      <div className="grid grid-cols-3 gap-0">
        {/* Fiber column */}
        <div className="text-center p-4" onMouseEnter={() => setHoveredSide("fiber")} onMouseLeave={() => setHoveredSide(null)}>
          <motion.div
            className="w-16 h-16 rounded-full bg-primary/20 border border-primary/30 flex items-center justify-center mx-auto mb-3"
            animate={hoveredSide === "fiber" ? { scale: 1.1, boxShadow: "0 0 30px hsl(24 95% 50% / 0.4)" } : { scale: 1 }}
          >
            <Zap className="w-7 h-7 text-primary" />
          </motion.div>
          <h4 className="font-bold text-primary text-sm mb-1">Fibra Óptica</h4>
          <p className="text-[10px] text-white/40">JD Telecom</p>
        </div>
        {/* VS */}
        <div className="flex items-center justify-center">
          <div className="w-12 h-12 rounded-full bg-white/5 border border-white/10 flex items-center justify-center">
            <span className="font-display text-xs font-black text-white/40">VS</span>
          </div>
        </div>
        {/* Copper column */}
        <div className="text-center p-4" onMouseEnter={() => setHoveredSide("copper")} onMouseLeave={() => setHoveredSide(null)}>
          <div className="w-16 h-16 rounded-full bg-white/5 border border-white/10 flex items-center justify-center mx-auto mb-3">
            <Wifi className="w-7 h-7 text-white/30" />
          </div>
          <h4 className="font-bold text-white/50 text-sm mb-1">Internet Comum</h4>
          <p className="text-[10px] text-white/30">Cabo/Rádio</p>
        </div>
      </div>
      <div className="space-y-2 mt-6">
        {comparisons.map((c, i) => (
          <motion.div
            key={c.label}
            className="grid grid-cols-3 gap-2 items-center"
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1 }}
          >
            <div className="bg-primary/10 border border-primary/20 rounded-xl px-3 py-2.5 text-center">
              <span className="text-xs font-bold text-primary">{c.fiber}</span>
            </div>
            <div className="text-center">
              <span className="text-[10px] font-semibold text-white/50">{c.label}</span>
            </div>
            <div className="bg-white/[0.03] border border-white/[0.06] rounded-xl px-3 py-2.5 text-center">
              <span className="text-xs font-bold text-white/40">{c.copper}</span>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

/* ── Animated Speed Bars (UNIQUE to Fibra) ── */
const SpeedBars = () => {
  const speeds = [
    { label: "400 Mega", value: 40, color: "from-primary/60 to-primary/30" },
    { label: "600 Mega", value: 60, color: "from-primary/70 to-primary/40" },
    { label: "800 Mega", value: 80, color: "from-primary/80 to-primary/50" },
    { label: "1 Giga", value: 100, color: "from-primary to-orange-400" },
  ];
  return (
    <div className="space-y-4 max-w-md">
      {speeds.map((s, i) => (
        <div key={s.label}>
          <div className="flex justify-between text-xs mb-1.5">
            <span className="font-bold text-white/70">{s.label}</span>
            <span className="text-primary font-bold">{s.value === 100 ? "1 Gbps" : `${s.value * 10} Mbps`}</span>
          </div>
          <div className="h-2.5 bg-white/5 rounded-full overflow-hidden">
            <motion.div
              className={`h-full rounded-full bg-gradient-to-r ${s.color}`}
              initial={{ width: 0 }}
              whileInView={{ width: `${s.value}%` }}
              viewport={{ once: true }}
              transition={{ duration: 1.2, delay: i * 0.15, ease: "easeOut" }}
            />
          </div>
        </div>
      ))}
    </div>
  );
};

/* ── Standard decorative backgrounds ── */
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
const fibraPlans = [
  { name: "JD FIBRA 400", speed: "400", price: "99", cents: "90", features: ["Wi-Fi Dual Band", "Instalação Gratuita", "Suporte 24h"], popular: false },
  { name: "JD FIBRA 600", speed: "600", price: "119", cents: "90", features: ["Wi-Fi Dual Band", "Instalação Gratuita", "IP Fixo Grátis", "Suporte 24h"], popular: true },
  { name: "JD FIBRA 800", speed: "800", price: "139", cents: "90", features: ["Wi-Fi 6", "Instalação Gratuita", "IP Fixo Grátis", "Suporte VIP"], popular: false },
  { name: "JD FIBRA 1 GIGA", speed: "1000", price: "149", cents: "90", features: ["Wi-Fi 6", "Instalação Gratuita", "IP Fixo Grátis", "Roteador Premium", "Suporte VIP"], popular: false },
];

const faqs = [
  { q: "Quanto tempo leva para instalar a internet fibra?", a: "A instalação é realizada em até 48 horas após a confirmação do pedido, dependendo da disponibilidade na sua região." },
  { q: "Preciso pagar taxa de instalação?", a: "Não! A instalação é totalmente gratuita para todos os planos de fibra óptica." },
  { q: "Posso mudar de plano depois?", a: "Sim! Você pode fazer upgrade ou downgrade a qualquer momento pelo nosso autoatendimento ou WhatsApp." },
  { q: "A velocidade é garantida?", a: "Garantimos no mínimo 80% da velocidade contratada via cabo e 40% via Wi-Fi, conforme regulamentação da Anatel." },
];

/* ── Main Page ── */
const InternetFibra = () => {
  const navigate = useNavigate();
  const [selectedSpeed, setSelectedSpeed] = useState(600);

  return (
    <div className="min-h-screen bg-[hsl(220,20%,6%)] text-white overflow-x-hidden">
      <Navbar />

      {/* HERO with Fiber Optic Lines */}
      <section className="relative pt-[128px] sm:pt-[132px] md:pt-[176px] lg:pt-[184px] pb-16 sm:pb-24 overflow-hidden">
        <GlowingOrbs />
        <FiberOpticLines />
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
                Internet de Alta Performance
              </motion.span>
              <h1 className="font-display text-3xl sm:text-5xl lg:text-6xl xl:text-7xl font-bold leading-[1.05] mb-6">
                <span className="block">FIBRA</span>
                <motion.span
                  className="block bg-gradient-to-r from-primary via-orange-400 to-primary bg-clip-text text-transparent bg-[length:200%_auto]"
                  animate={{ backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"] }}
                  transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
                >ÓPTICA</motion.span>
                <span className="block">JD TELECOM<span className="text-primary">.</span></span>
              </h1>
              <p className="text-white/60 text-base sm:text-lg max-w-lg mb-8 leading-relaxed">
                Conexão ultra-rápida com <strong className="text-primary font-bold">fibra óptica</strong> de verdade. Navegue, trabalhe, estude e se divirta sem limites.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 mb-8">
                <Button size="lg" className="bg-primary text-primary-foreground rounded-full px-8 text-sm font-bold h-12 shadow-glow"
                  onClick={() => document.querySelector("#planos")?.scrollIntoView({ behavior: "smooth" })}
                >
                  <span className="flex items-center gap-2">Ver Planos <ArrowRight className="w-4 h-4" /></span>
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
                {[{ icon: Check, label: "Até 1 Gbps" }, { icon: Check, label: "Instalação Grátis" }, { icon: Check, label: "Suporte 24h" }].map((item) => (
                  <span key={item.label} className="flex items-center gap-1.5"><item.icon className="w-4 h-4 text-primary" /> {item.label}</span>
                ))}
              </div>
            </motion.div>

            {/* Hero Visual: Speed Gauge */}
            <motion.div className="flex justify-center lg:justify-end" initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 1, delay: 0.3 }}>
              <div className="relative">
                <div className="absolute inset-0 bg-primary/15 blur-[100px] rounded-full" />
                <div className="relative flex flex-col items-center gap-6">
                  <SpeedGauge speed={selectedSpeed} />
                  <div className="flex gap-2">
                    {[400, 600, 800, 1000].map((s) => (
                      <button
                        key={s}
                        onClick={() => setSelectedSpeed(s)}
                        className={`px-3 py-1.5 rounded-full text-[10px] font-bold transition-all ${
                          selectedSpeed === s
                            ? "bg-primary text-primary-foreground shadow-glow"
                            : "bg-white/5 text-white/40 hover:bg-white/10"
                        }`}
                      >
                        {s === 1000 ? "1G" : s}
                      </button>
                    ))}
                  </div>
                  <motion.div
                    className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl px-4 py-2 text-xs text-center"
                    animate={{ y: [0, -4, 0] }}
                    transition={{ duration: 3, repeat: Infinity }}
                  >
                    <span className="text-primary font-bold">Clique</span> para testar velocidades
                  </motion.div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section className="py-12 sm:py-16 border-y border-white/5 relative">
        <DataStreams />
        <div className="container mx-auto px-4 relative z-10">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {[
              { icon: Gauge, title: "Ultra Velocidade", desc: "Fibra óptica com até 1 Gbps de velocidade simétrica.", color: "from-primary/20 to-yellow-500/10" },
              { icon: Shield, title: "Estabilidade Total", desc: "Conexão estável 24h por dia, sem quedas.", color: "from-blue-500/20 to-primary/10" },
              { icon: Network, title: "Rede Inteligente", desc: "Infraestrutura GPON de última geração.", color: "from-green-500/20 to-primary/10" },
              { icon: Headphones, title: "Suporte Premium", desc: "Atendimento humano 24h pelo WhatsApp e telefone.", color: "from-purple-500/20 to-primary/10" },
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

      {/* EQUIPMENT SHOWCASE */}
      <section className="py-16 sm:py-24 relative overflow-hidden">
        <div className="container mx-auto px-4 relative z-10">
          <div className="grid lg:grid-cols-2 gap-10 lg:gap-16 items-center">
            <motion.div
              className="relative flex justify-center"
              initial={{ opacity: 0, x: -40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <div className="relative">
                <div className="absolute inset-0 bg-primary/20 blur-[80px] rounded-full scale-75" />
                <motion.img
                  src={equipmentFiberRouter}
                  alt="Roteador Wi-Fi 6 de Fibra Óptica JD Telecom"
                  className="relative z-10 w-64 sm:w-80 h-auto drop-shadow-2xl"
                  width={800}
                  height={800}
                  loading="lazy"
                  animate={{ y: [0, -12, 0] }}
                  transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
                />
                <motion.div
                  className="absolute -bottom-4 left-1/2 -translate-x-1/2 w-48 h-6 bg-primary/10 rounded-full blur-xl"
                  animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3] }}
                  transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
                />
              </div>
            </motion.div>
            <motion.div
              className="space-y-6"
              initial={{ opacity: 0, x: 40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              <span className="inline-flex items-center gap-2 text-primary text-xs font-bold">
                <Sparkles className="w-4 h-4" /> Equipamento Premium
              </span>
              <h2 className="font-display text-2xl sm:text-4xl font-bold">
                Roteador <span className="text-primary">Wi-Fi 6</span> incluso
              </h2>
              <p className="text-white/60 text-sm sm:text-base leading-relaxed max-w-md">
                Receba um roteador de última geração com tecnologia Wi-Fi 6, capaz de suportar dezenas de dispositivos simultâneos sem perda de velocidade.
              </p>
              <div className="grid grid-cols-2 gap-3">
                {[
                  { label: "Wi-Fi 6", desc: "802.11ax de última geração" },
                  { label: "Dual Band", desc: "2.4 GHz + 5 GHz simultâneo" },
                  { label: "MU-MIMO", desc: "Múltiplos dispositivos" },
                  { label: "Beamforming", desc: "Sinal direcionado" },
                ].map((spec, i) => (
                  <motion.div
                    key={spec.label}
                    className="bg-white/[0.04] border border-white/[0.08] rounded-xl p-3 hover:border-primary/20 transition-all"
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.1 }}
                  >
                    <p className="text-xs font-bold text-primary mb-0.5">{spec.label}</p>
                    <p className="text-[10px] text-white/40">{spec.desc}</p>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      <section className="py-16 sm:py-24 relative">
        <GlowingOrbs />
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center mb-10">
            <span className="inline-flex items-center gap-2 text-primary text-xs font-bold mb-4">
              <Network className="w-4 h-4" /> Infraestrutura
            </span>
            <h2 className="font-display text-2xl sm:text-4xl lg:text-5xl font-bold mb-4">
              Rede <span className="text-primary">100% Fibra Óptica</span>
            </h2>
            <p className="text-white/50 text-sm sm:text-base max-w-lg mx-auto">
              Da central até sua casa, tudo em fibra óptica. Sem conversões, sem perda de qualidade.
            </p>
          </div>
          <NetworkTopology />
          <div className="grid grid-cols-3 gap-4 max-w-lg mx-auto mt-8">
            {[
              { label: "OLT Central", desc: "Equipamento de alta capacidade" },
              { label: "Splitter", desc: "Distribui o sinal ótico" },
              { label: "Sua Casa", desc: "Fibra direto no roteador" },
            ].map((n, i) => (
              <motion.div key={n.label} className="text-center"
                initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }} transition={{ delay: i * 0.15 }}
              >
                <div className="w-8 h-8 rounded-full bg-primary/20 border border-primary/30 flex items-center justify-center mx-auto mb-2">
                  <span className="text-primary font-bold text-xs">{i + 1}</span>
                </div>
                <p className="text-xs font-bold text-white/80">{n.label}</p>
                <p className="text-[10px] text-white/40">{n.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* SPEED COMPARISON (UNIQUE) */}
      <section className="py-16 sm:py-24 border-y border-white/5 relative">
        <CyberGrid />
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-5xl mx-auto grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <span className="inline-flex items-center gap-2 text-primary text-xs font-bold mb-4">
                <Activity className="w-4 h-4" /> Velocidade Real
              </span>
              <h2 className="font-display text-2xl sm:text-3xl font-bold mb-4">Sinta a diferença da <span className="text-primary">velocidade real</span></h2>
              <p className="text-white/50 text-sm leading-relaxed mb-8">
                Nossos planos entregam velocidade simétrica — o upload é tão rápido quanto o download. Ideal para home office, lives e jogos online.
              </p>
              <SpeedBars />
            </div>
            <FiberVsCopper />
          </div>
        </div>
      </section>

      {/* PLANS */}
      <section id="planos" className="py-16 sm:py-24 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-primary/[0.02] to-transparent" />
        <CyberGrid />
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center mb-10 sm:mb-14">
            <span className="inline-flex items-center gap-2 text-primary text-xs font-bold mb-4">
              <Star className="w-4 h-4" /> Planos Fibra Óptica
            </span>
            <h2 className="font-display text-2xl sm:text-4xl lg:text-5xl font-bold mb-4">Escolha Seu Plano</h2>
            <p className="text-white/50 text-sm sm:text-base max-w-md mx-auto">Internet fibra óptica com instalação gratuita e Wi-Fi incluso</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5 max-w-6xl mx-auto" style={{ perspective: "1200px" }}>
            {fibraPlans.map((plan, idx) => (
              <motion.div key={plan.name} className="relative h-full"
                initial={{ opacity: 0, y: 40, rotateX: 8 }} whileInView={{ opacity: 1, y: 0, rotateX: 0 }}
                viewport={{ once: true }} transition={{ delay: idx * 0.12, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                whileHover={{ y: -10, scale: 1.03, rotateY: plan.popular ? 0 : (idx % 2 === 0 ? 2 : -2), transition: { duration: 0.3, ease: "easeOut" } }}
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
                  {/* Shimmer effect */}
                  <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none overflow-hidden rounded-2xl">
                    <motion.div className="absolute -inset-full bg-gradient-to-r from-transparent via-white/[0.05] to-transparent skew-x-12"
                      animate={{ x: ["-100%", "200%"] }}
                      transition={{ duration: 3, repeat: Infinity, repeatDelay: 2 }}
                    />
                  </div>
                  {/* Hover glow overlay */}
                  <div className="absolute inset-0 bg-gradient-to-b from-primary/[0.04] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none rounded-2xl" />
                  <div className="px-4 py-2 flex items-center gap-2 bg-gradient-to-r from-primary/15 to-transparent relative z-10">
                    <Wifi className="w-3.5 h-3.5 text-primary" />
                    <span className="text-[10px] font-bold text-primary tracking-wider uppercase">{plan.speed} MEGA</span>
                  </div>
                  <div className="p-5 flex-1 flex flex-col relative z-10">
                    <h3 className="font-display text-xs sm:text-sm font-bold mb-4 text-white/90">{plan.name}</h3>
                    <div className="flex items-center gap-2.5 mb-3">
                      <Globe className="w-4 h-4 text-primary shrink-0" />
                      <div>
                        <span className="text-lg font-bold">{plan.speed === "1000" ? "1 Gbps" : `${plan.speed} Mbps`}</span>
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

      {/* SELF-SERVICE */}
      <section className="py-16 sm:py-24 border-y border-white/5 relative">
        <DataStreams />
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center mb-10 sm:mb-14">
            <span className="inline-flex items-center gap-2 text-primary text-xs font-bold mb-4">
              <Headphones className="w-4 h-4" /> Autoatendimento
            </span>
            <h2 className="font-display text-2xl sm:text-4xl font-bold mb-3">Tudo na palma da sua mão</h2>
            <p className="text-white/50 text-sm sm:text-base max-w-md mx-auto">Resolva tudo online de forma rápida e prática</p>
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 max-w-5xl mx-auto">
            {[
              { icon: FileText, title: "2ª Via da Fatura", desc: "Baixe sua fatura pelo portal", href: "/assinante", color: "from-blue-500/20 to-primary/10" },
              { icon: Phone, title: "Ligamos para Você", desc: "Informe seus dados e ligamos", href: "#contato", color: "from-green-500/20 to-primary/10" },
              { icon: MapPin, title: "Cobertura", desc: "Verifique disponibilidade", href: "#cobertura", color: "from-purple-500/20 to-primary/10" },
              { icon: MessageCircle, title: "WhatsApp", desc: "Atendimento rápido e fácil", href: "https://wa.me/558005945678", color: "from-primary/20 to-yellow-500/10" },
            ].map((item) => (
              <a key={item.title} href={item.href} target={item.href.startsWith("http") ? "_blank" : undefined} rel={item.href.startsWith("http") ? "noopener noreferrer" : undefined}
                className="relative bg-white/[0.04] border border-white/[0.08] rounded-2xl p-5 sm:p-6 hover:border-primary/30 transition-all duration-300 group overflow-hidden block"
              >
                <div className={`absolute inset-0 bg-gradient-to-br ${item.color} opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />
                <div className="relative z-10">
                  <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                    <item.icon className="w-5 h-5 text-primary" />
                  </div>
                  <h3 className="font-display text-sm sm:text-base font-bold mb-1">{item.title}</h3>
                  <p className="text-xs text-white/50 mb-3">{item.desc}</p>
                  <span className="text-primary text-xs font-semibold flex items-center gap-1 group-hover:gap-2 transition-all">
                    Acessar <ArrowRight className="w-3.5 h-3.5" />
                  </span>
                </div>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* WHY CHOOSE */}
      <section className="py-16 sm:py-24 relative">
        <GlowingOrbs />
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center mb-10 sm:mb-14">
            <h2 className="font-display text-2xl sm:text-4xl font-bold mb-3">Por que escolher a <span className="text-primary">JD Fibra</span>?</h2>
            <p className="text-white/50 text-sm sm:text-base max-w-md mx-auto">A melhor internet fibra óptica da região Norte</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 max-w-4xl mx-auto">
            {[
              { icon: Zap, title: "Velocidade Real", desc: "Fibra óptica de verdade com velocidades simétricas de upload e download.", color: "from-primary/20 to-yellow-500/10" },
              { icon: Shield, title: "Conexão Estável", desc: "Sem quedas, sem lentidão. Internet que funciona quando você precisa.", color: "from-blue-500/20 to-primary/10" },
              { icon: CreditCard, title: "Preço Justo", desc: "Planos acessíveis com a melhor relação custo-benefício do mercado.", color: "from-green-500/20 to-primary/10" },
            ].map((item) => (
              <motion.div key={item.title}
                className="relative bg-white/[0.04] border border-white/[0.08] rounded-2xl p-6 text-center hover:border-primary/30 transition-all overflow-hidden group"
                whileHover={{ y: -6 }}
              >
                <div className={`absolute inset-0 bg-gradient-to-br ${item.color} opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />
                <div className="relative z-10">
                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
                    <item.icon className="w-6 h-6 text-primary" />
                  </div>
                  <h3 className="font-display text-sm sm:text-base font-bold mb-2">{item.title}</h3>
                  <p className="text-xs sm:text-sm text-white/50 leading-relaxed">{item.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-16 sm:py-24 border-t border-white/5">
        <div className="container mx-auto px-4">
          <div className="text-center mb-10 sm:mb-14">
            <h2 className="font-display text-2xl sm:text-4xl font-bold mb-3">Perguntas Frequentes</h2>
            <p className="text-white/50 text-sm sm:text-base">Tire suas dúvidas sobre internet fibra óptica</p>
          </div>
          <div className="max-w-2xl mx-auto space-y-3">
            {faqs.map((faq, i) => <FaqItem key={i} q={faq.q} a={faq.a} />)}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 sm:py-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary via-[hsl(20,92%,45%)] to-[hsl(10,80%,35%)]" />
        <div className="absolute inset-0 opacity-20" style={{ backgroundImage: `radial-gradient(circle at 30% 50%, white 0%, transparent 50%)` }} />
        <FiberOpticLines />
        <div className="container mx-auto px-4 relative z-10 text-center">
          <h2 className="font-display text-2xl sm:text-4xl lg:text-5xl font-bold text-white mb-4">Pronto para navegar sem limites?</h2>
          <p className="text-white/80 text-sm sm:text-base mb-8 max-w-md mx-auto">Assine agora e tenha a melhor internet fibra óptica da região.</p>
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

      <ProductTestimonials produto="fibra" title="Clientes que amam nossa Fibra" subtitle="Depoimentos Fibra Óptica" />

      <Footer />
      <WhatsAppButton />
    </div>
  );
};

export default InternetFibra;
