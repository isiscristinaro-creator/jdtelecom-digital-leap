import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import {
  Signal, Wifi, Zap, ChevronDown, Check, ArrowRight,
  Star, Sparkles, Globe, Monitor, Smartphone, MessageCircle,
  Home, Router, MapPin
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import WhatsAppButton from "@/components/WhatsAppButton";

/* ══════════════════════════════════════════════════════════════
   FWA 5G — Unique Elements:
   1. SignalWaves — concentric 5G wave propagation animation
   2. SignalTower3D — animated cell tower with radiating signals
   3. CoverageRadar — rotating radar sweep showing coverage
   4. WirelessBenchmark — animated latency/speed comparison
   5. InstallationTimeline — step-by-step install process
   ══════════════════════════════════════════════════════════════ */

/* ── 5G Signal Waves (UNIQUE to FWA) ── */
const SignalWaves = () => (
  <div className="absolute inset-0 overflow-hidden pointer-events-none">
    {[1, 2, 3, 4, 5].map((i) => (
      <motion.div
        key={i}
        className="absolute rounded-full border border-primary/10"
        style={{
          width: `${i * 200}px`, height: `${i * 200}px`,
          top: "50%", left: "50%",
          transform: "translate(-50%, -50%)",
        }}
        animate={{ scale: [0.8, 1.2, 0.8], opacity: [0.05, 0.15, 0.05] }}
        transition={{ duration: 4, repeat: Infinity, delay: i * 0.6, ease: "easeInOut" }}
      />
    ))}
  </div>
);

/* ── Signal Tower Visualization (UNIQUE to FWA) ── */
const SignalTowerViz = () => (
  <div className="relative w-64 sm:w-80 h-64 sm:h-80 flex items-center justify-center">
    {/* Tower base */}
    <div className="absolute bottom-8 left-1/2 -translate-x-1/2 w-1 h-32 bg-gradient-to-t from-white/20 to-transparent" />
    <div className="absolute bottom-6 left-1/2 -translate-x-1/2 w-6 h-1 bg-white/20 rounded-full" />

    {/* Signal rings from tower */}
    {[0, 1, 2, 3].map((i) => (
      <motion.div
        key={i}
        className="absolute border border-primary/20 rounded-full"
        style={{ width: `${60 + i * 50}px`, height: `${60 + i * 50}px` }}
        animate={{
          scale: [1, 1.3, 1],
          opacity: [0.3, 0.05, 0.3],
          borderColor: ["hsl(24 95% 50% / 0.3)", "hsl(24 95% 50% / 0.05)", "hsl(24 95% 50% / 0.3)"],
        }}
        transition={{ duration: 2.5, repeat: Infinity, delay: i * 0.5 }}
      />
    ))}

    {/* Tower antenna */}
    <motion.div
      className="relative z-10 w-20 h-20 rounded-full bg-gradient-to-br from-primary/30 to-primary/10 border border-primary/20 flex items-center justify-center"
      animate={{ boxShadow: ["0 0 20px hsl(24 95% 50% / 0)", "0 0 40px hsl(24 95% 50% / 0.3)", "0 0 20px hsl(24 95% 50% / 0)"] }}
      transition={{ duration: 2, repeat: Infinity }}
    >
      <Signal className="w-10 h-10 text-primary" />
    </motion.div>

    {/* Device indicators */}
    {[
      { angle: -30, icon: Smartphone, label: "Celular" },
      { angle: 30, icon: Monitor, label: "Smart TV" },
      { angle: 90, icon: Home, label: "Casa" },
    ].map((d, i) => {
      const rad = (d.angle - 90) * (Math.PI / 180);
      const x = Math.cos(rad) * 120;
      const y = Math.sin(rad) * 120;
      return (
        <motion.div
          key={d.label}
          className="absolute flex flex-col items-center gap-1"
          style={{ left: `calc(50% + ${x}px)`, top: `calc(50% + ${y}px)`, transform: "translate(-50%, -50%)" }}
          animate={{ opacity: [0.4, 1, 0.4] }}
          transition={{ duration: 3, repeat: Infinity, delay: i * 0.8 }}
        >
          <div className="w-8 h-8 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center">
            <d.icon className="w-4 h-4 text-primary/70" />
          </div>
          <span className="text-[8px] text-white/30">{d.label}</span>
        </motion.div>
      );
    })}

    {/* Connection lines */}
    <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 320 320">
      {[
        { x: 100, y: 90 },
        { x: 220, y: 90 },
        { x: 260, y: 160 },
      ].map((p, i) => (
        <motion.line
          key={i} x1="160" y1="160" x2={p.x} y2={p.y}
          stroke="hsl(24 95% 50%)" strokeWidth="0.5" strokeDasharray="4 4"
          animate={{ opacity: [0.1, 0.4, 0.1] }}
          transition={{ duration: 2, repeat: Infinity, delay: i * 0.5 }}
        />
      ))}
    </svg>
  </div>
);

/* ── Coverage Radar (UNIQUE to FWA) ── */
const CoverageRadar = () => (
  <div className="relative w-48 h-48 mx-auto">
    <svg viewBox="0 0 200 200" className="w-full h-full">
      {/* Circles */}
      {[30, 60, 90].map((r) => (
        <circle key={r} cx="100" cy="100" r={r} fill="none" stroke="hsl(24 95% 50% / 0.1)" strokeWidth="0.5" />
      ))}
      {/* Cross lines */}
      <line x1="100" y1="10" x2="100" y2="190" stroke="hsl(24 95% 50% / 0.05)" strokeWidth="0.5" />
      <line x1="10" y1="100" x2="190" y2="100" stroke="hsl(24 95% 50% / 0.05)" strokeWidth="0.5" />
      {/* Sweep */}
      <motion.g animate={{ rotate: 360 }} transition={{ duration: 4, repeat: Infinity, ease: "linear" }} style={{ transformOrigin: "100px 100px" }}>
        <line x1="100" y1="100" x2="100" y2="10" stroke="hsl(24 95% 50% / 0.6)" strokeWidth="1" />
        <path d="M 100 100 L 100 10 A 90 90 0 0 1 163 37 Z" fill="hsl(24 95% 50% / 0.08)" />
      </motion.g>
      {/* Dots (coverage points) */}
      {[
        { x: 120, y: 60 }, { x: 70, y: 80 }, { x: 140, y: 120 },
        { x: 80, y: 130 }, { x: 110, y: 90 }, { x: 60, y: 60 },
        { x: 150, y: 80 }, { x: 90, y: 150 },
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

/* ── Installation Timeline (UNIQUE to FWA) ── */
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
        {/* Vertical line */}
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

/* ── Wireless Benchmark (UNIQUE to FWA) ── */
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
              <div className="flex-1 h-2 bg-white/5 rounded-full overflow-hidden">
                <motion.div
                  className="h-full rounded-full bg-gradient-to-r from-primary to-orange-400"
                  initial={{ width: 0 }}
                  whileInView={{ width: `${m.label === "Latência" ? 100 - m.fwaPercent : m.fwaPercent}%` }}
                  viewport={{ once: true }}
                  transition={{ duration: 1, delay: i * 0.1 }}
                />
              </div>
              <span className="text-[10px] font-bold text-white/70 w-16 text-right">{m.fwa}</span>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-[10px] font-bold text-white/30 w-16">Rádio</span>
              <div className="flex-1 h-2 bg-white/5 rounded-full overflow-hidden">
                <motion.div
                  className="h-full rounded-full bg-white/10"
                  initial={{ width: 0 }}
                  whileInView={{ width: `${m.label === "Latência" ? 100 - m.otherPercent : m.otherPercent}%` }}
                  viewport={{ once: true }}
                  transition={{ duration: 1, delay: i * 0.1 }}
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
];

const InternetFWA5G = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[hsl(220,20%,6%)] text-white overflow-x-hidden">
      <Navbar />

      {/* HERO with Signal Waves */}
      <section className="relative pt-[128px] sm:pt-[132px] md:pt-[176px] lg:pt-[184px] pb-16 sm:pb-24 overflow-hidden">
        <GlowingOrbs />
        <SignalWaves />
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
                {[{ icon: Check, label: "Sem Cabos" }, { icon: Check, label: "Wi-Fi 6" }, { icon: Check, label: "Instalação Rápida" }].map((item) => (
                  <span key={item.label} className="flex items-center gap-1.5"><item.icon className="w-4 h-4 text-primary" /> {item.label}</span>
                ))}
              </div>
            </motion.div>

            {/* Hero Visual: Signal Tower */}
            <motion.div className="flex justify-center lg:justify-end" initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 1, delay: 0.3 }}>
              <div className="relative">
                <div className="absolute inset-0 bg-primary/15 blur-[100px] rounded-full" />
                <SignalTowerViz />
                <motion.div
                  className="absolute -top-2 -right-2 sm:-top-4 sm:-right-4 bg-gradient-to-br from-primary to-orange-600 text-primary-foreground text-lg sm:text-xl font-black px-4 py-2 rounded-2xl shadow-glow-lg"
                  animate={{ y: [0, -8, 0] }}
                  transition={{ duration: 3, repeat: Infinity }}
                >5G</motion.div>
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
              { icon: Signal, title: "Ultra Velocidade", desc: "Grandes velocidades com ampla cobertura 5G.", color: "from-primary/20 to-yellow-500/10" },
              { icon: Zap, title: "Sem Cabos", desc: "Instalação sem quebradeira, sem furos na parede.", color: "from-blue-500/20 to-primary/10" },
              { icon: Monitor, title: "Multi-conexões", desc: "Rede segura e estável para todos dispositivos.", color: "from-green-500/20 to-primary/10" },
              { icon: Wifi, title: "Wi-Fi 6", desc: "Tecnologia de última geração para máximo desempenho.", color: "from-purple-500/20 to-primary/10" },
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

      {/* INSTALLATION TIMELINE (UNIQUE) */}
      <section className="py-16 sm:py-24 relative">
        <GlowingOrbs />
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center mb-10 sm:mb-14">
            <span className="inline-flex items-center gap-2 text-primary text-xs font-bold mb-4">
              <Zap className="w-4 h-4" /> Instalação Instantânea
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

      {/* COVERAGE RADAR (UNIQUE) */}
      <section className="py-16 sm:py-24 border-y border-white/5 relative">
        <CyberGrid />
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-5xl mx-auto grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <span className="inline-flex items-center gap-2 text-primary text-xs font-bold mb-4">
                <MapPin className="w-4 h-4" /> Cobertura 5G
              </span>
              <h2 className="font-display text-2xl sm:text-3xl font-bold mb-4">
                Sinal 5G <span className="text-primary">expandindo</span> na região Norte
              </h2>
              <p className="text-white/50 text-sm leading-relaxed mb-6">
                Nossa rede 5G está em constante expansão. Verifique a disponibilidade na sua cidade e garanta internet sem fio de última geração.
              </p>
              <div className="grid grid-cols-2 gap-3">
                {["Manaus - AM", "Santarém - PA", "Nhamundá - AM", "Redenção - PA"].map((city) => (
                  <div key={city} className="flex items-center gap-2 bg-white/[0.03] border border-white/[0.06] rounded-xl px-3 py-2">
                    <div className="w-2 h-2 rounded-full bg-green-400" />
                    <span className="text-xs text-white/60">{city}</span>
                  </div>
                ))}
              </div>
            </div>
            <CoverageRadar />
          </div>
        </div>
      </section>

      {/* BENCHMARK (UNIQUE) */}
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
              Veja a diferença real entre FWA 5G e internet comum por rádio
            </p>
          </div>
          <WirelessBenchmark />
        </div>
      </section>

      {/* ELEVATE */}
      <section className="py-16 sm:py-24 border-y border-white/5 relative">
        <DataStreams />
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center mb-10 sm:mb-14">
            <h2 className="font-display text-2xl sm:text-4xl lg:text-5xl font-bold mb-4">Eleve sua conexão a <span className="text-primary">outro nível</span></h2>
            <p className="text-white/50 text-sm sm:text-base max-w-md mx-auto">Potencialize suas tarefas do dia a dia com a Internet FWA 5G</p>
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 max-w-5xl mx-auto">
            {[
              { icon: Home, title: "Home Office", desc: "Conexão constante e segura para trabalho remoto", color: "from-blue-500/20 to-primary/10" },
              { icon: Monitor, title: "Streaming", desc: "Filmes e séries em alta resolução sem buffering", color: "from-purple-500/20 to-primary/10" },
              { icon: Smartphone, title: "Dispositivos", desc: "Conecte TVs, smartphones, notebooks e mais", color: "from-green-500/20 to-primary/10" },
              { icon: Router, title: "Portabilidade", desc: "Leve o roteador onde quiser, sem cabos", color: "from-primary/20 to-yellow-500/10" },
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

      {/* PLANS */}
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
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-5 max-w-4xl mx-auto">
            {fwaPlans.map((plan, idx) => (
              <motion.div key={plan.name} className="relative h-full"
                initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }} transition={{ delay: idx * 0.1 }}
              >
                {plan.popular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 z-10 bg-primary text-primary-foreground text-[10px] font-bold px-3 py-1 rounded-full whitespace-nowrap">
                    ⭐ MAIS POPULAR
                  </div>
                )}
                <div className={`rounded-2xl overflow-hidden h-full flex flex-col border transition-all backdrop-blur-sm ${plan.popular ? "border-primary shadow-glow-lg bg-white/[0.06]" : "border-white/[0.08] bg-white/[0.03] hover:border-white/15"}`}>
                  <div className="px-4 py-2 flex items-center gap-2 bg-gradient-to-r from-primary/15 to-transparent">
                    <Signal className="w-3.5 h-3.5 text-primary" />
                    <span className="text-[10px] font-bold text-primary tracking-wider uppercase">{plan.speed} MEGA • 5G</span>
                  </div>
                  <div className="p-5 flex-1 flex flex-col">
                    <h3 className="font-display text-xs sm:text-sm font-bold mb-4 text-white/90">{plan.name}</h3>
                    <div className="flex items-center gap-2.5 mb-3">
                      <Globe className="w-4 h-4 text-primary shrink-0" />
                      <div>
                        <span className="text-lg font-bold">{plan.speed} Mbps</span>
                        <span className="text-[10px] text-white/40 ml-1.5">DOWNLOAD</span>
                      </div>
                    </div>
                    {plan.features.map((f, i) => (
                      <div key={i} className="flex items-center gap-2 mb-2">
                        <Check className="w-3.5 h-3.5 text-primary shrink-0" />
                        <span className="text-xs text-white/60">{f}</span>
                      </div>
                    ))}
                    <div className="mt-auto pt-4">
                      <p className="text-[10px] text-white/40 mb-1">Por apenas</p>
                      <div className="flex items-baseline mb-4">
                        <span className="text-sm text-primary font-bold mr-1">R$</span>
                        <span className="font-display text-3xl sm:text-4xl font-extrabold">{plan.price}</span>
                        <span className="text-sm font-bold">.{plan.cents}</span>
                        <span className="text-xs text-white/40 ml-1">/mês</span>
                      </div>
                      <Button
                        className={`w-full rounded-xl h-11 text-sm font-bold ${plan.popular ? "bg-primary text-primary-foreground hover:bg-primary/90 shadow-glow" : "bg-primary/20 text-primary border border-primary/30 hover:bg-primary/30"}`}
                        onClick={() => navigate("/cadastro")}
                      >
                        Assinar Agora
                      </Button>
                    </div>
                  </div>
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
            <p className="text-white/50 text-sm sm:text-base">Tire suas dúvidas sobre internet FWA 5G</p>
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

      <Footer />
      <WhatsAppButton />
    </div>
  );
};

export default InternetFWA5G;
