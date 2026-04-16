import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import {
  Tv, Music, Film, Smartphone, Wifi, ArrowRight, Sparkles, Package,
  ChevronDown, Check, MessageCircle, Shield,
  Calculator, TrendingDown, Layers, Gift, BadgePercent
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import WhatsAppButton from "@/components/WhatsAppButton";

/* ══════════════════════════════════════════════════════════════
   COMBOS — Unique Elements:
   1. SavingsCalculator — animated calculator showing savings
   2. BundleConnector — visual lines connecting services in a bundle
   3. ComboComparison — side-by-side separate vs combo pricing
   4. ServiceOrbit — orbiting services around a central hub
   5. SavingsCounter — animated savings amount
   ══════════════════════════════════════════════════════════════ */

/* ── Service Orbit (UNIQUE to Combos) ── */
const ServiceOrbit = () => {
  const services = [
    { icon: Wifi, label: "Internet", angle: 0, color: "hsl(24 95% 50%)" },
    { icon: Tv, label: "TV", angle: 72, color: "hsl(220 80% 60%)" },
    { icon: Music, label: "Música", angle: 144, color: "hsl(280 70% 60%)" },
    { icon: Smartphone, label: "Móvel", angle: 216, color: "hsl(150 70% 50%)" },
    { icon: Film, label: "Filmes", angle: 288, color: "hsl(0 70% 60%)" },
  ];
  const radius = 110;

  return (
    <div className="relative w-72 h-72 sm:w-80 sm:h-80 mx-auto">
      {/* Orbit ring */}
      <motion.div
        className="absolute inset-6 border border-white/[0.06] rounded-full"
        animate={{ rotate: 360 }}
        transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
      />
      <motion.div
        className="absolute inset-12 border border-dashed border-primary/10 rounded-full"
        animate={{ rotate: -360 }}
        transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
      />

      {/* Center hub */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10">
        <motion.div
          className="w-20 h-20 rounded-full bg-gradient-to-br from-primary/30 to-primary/10 border border-primary/30 flex items-center justify-center"
          animate={{ boxShadow: ["0 0 20px hsl(24 95% 50% / 0)", "0 0 40px hsl(24 95% 50% / 0.3)", "0 0 20px hsl(24 95% 50% / 0)"] }}
          transition={{ duration: 3, repeat: Infinity }}
        >
          <Package className="w-8 h-8 text-primary" />
        </motion.div>
        <motion.span
          className="absolute -bottom-6 left-1/2 -translate-x-1/2 text-[10px] font-bold text-primary whitespace-nowrap"
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          COMBO JD
        </motion.span>
      </div>

      {/* Orbiting services */}
      {services.map((svc, i) => {
        const rad = ((svc.angle - 90) * Math.PI) / 180;
        const x = Math.cos(rad) * radius;
        const y = Math.sin(rad) * radius;
        return (
          <motion.div
            key={svc.label}
            className="absolute flex flex-col items-center gap-1"
            style={{
              left: `calc(50% + ${x}px)`,
              top: `calc(50% + ${y}px)`,
              transform: "translate(-50%, -50%)",
            }}
            animate={{ scale: [1, 1.08, 1] }}
            transition={{ duration: 3, repeat: Infinity, delay: i * 0.5 }}
          >
            {/* Connection line */}
            <svg className="absolute w-full h-full pointer-events-none" style={{
              left: "50%", top: "50%", width: `${Math.abs(x) + 40}px`, height: `${Math.abs(y) + 40}px`,
              transform: "translate(-50%, -50%)",
            }}>
            </svg>
            <motion.div
              className="w-12 h-12 rounded-xl border flex items-center justify-center backdrop-blur-sm"
              style={{
                backgroundColor: `${svc.color}15`,
                borderColor: `${svc.color}30`,
              }}
              whileHover={{ scale: 1.15, borderColor: svc.color }}
            >
              <svc.icon className="w-5 h-5" style={{ color: svc.color }} />
            </motion.div>
            <span className="text-[9px] font-bold text-white/50">{svc.label}</span>
          </motion.div>
        );
      })}
    </div>
  );
};

/* ── Savings Calculator (UNIQUE to Combos) ── */
const SavingsCalculator = () => {
  const [selectedServices, setSelectedServices] = useState<string[]>(["internet", "music"]);

  const services = [
    { id: "internet", name: "Internet Fibra", icon: Wifi, separatePrice: 119.90, color: "from-primary/20 to-primary/10" },
    { id: "tv", name: "JD TV", icon: Tv, separatePrice: 49.90, color: "from-blue-500/20 to-blue-500/10" },
    { id: "music", name: "JD Music", icon: Music, separatePrice: 24.90, color: "from-purple-500/20 to-purple-500/10" },
    { id: "mobile", name: "JD Móvel", icon: Smartphone, separatePrice: 54.90, color: "from-green-500/20 to-green-500/10" },
  ];

  const toggleService = (id: string) => {
    setSelectedServices((prev) =>
      prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id]
    );
  };

  const separateTotal = useMemo(
    () => services.filter((s) => selectedServices.includes(s.id)).reduce((sum, s) => sum + s.separatePrice, 0),
    [selectedServices]
  );

  const comboPrice = useMemo(() => {
    const count = selectedServices.length;
    if (count <= 1) return separateTotal;
    return separateTotal * (count === 2 ? 0.82 : count === 3 ? 0.72 : 0.65);
  }, [selectedServices, separateTotal]);

  const savings = separateTotal - comboPrice;

  return (
    <div className="max-w-lg mx-auto">
      <div className="grid grid-cols-2 gap-3 mb-6">
        {services.map((svc) => {
          const active = selectedServices.includes(svc.id);
          return (
            <motion.button
              key={svc.id}
              onClick={() => toggleService(svc.id)}
              className={`relative p-4 rounded-xl border text-left transition-all ${
                active
                  ? "border-primary/40 bg-primary/10"
                  : "border-white/[0.06] bg-white/[0.02] hover:border-white/10"
              }`}
              whileTap={{ scale: 0.97 }}
            >
              <div className="flex items-center gap-2 mb-2">
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${active ? "bg-primary/20" : "bg-white/5"}`}>
                  <svc.icon className={`w-4 h-4 ${active ? "text-primary" : "text-white/30"}`} />
                </div>
                <motion.div
                  className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ml-auto ${active ? "border-primary bg-primary" : "border-white/20"}`}
                  animate={active ? { scale: [1, 1.2, 1] } : {}}
                >
                  {active && <Check className="w-2.5 h-2.5 text-primary-foreground" />}
                </motion.div>
              </div>
              <p className="text-xs font-bold text-white/80">{svc.name}</p>
              <p className="text-[10px] text-white/40">R$ {svc.separatePrice.toFixed(2).replace(".", ",")}/mês</p>
            </motion.button>
          );
        })}
      </div>

      {/* Result */}
      <AnimatePresence mode="wait">
        <motion.div
          key={selectedServices.join("-")}
          className="bg-white/[0.03] border border-white/[0.08] rounded-2xl p-5"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs text-white/40">Separado:</span>
            <span className="text-sm text-white/40 line-through">R$ {separateTotal.toFixed(2).replace(".", ",")}</span>
          </div>
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold text-primary">No Combo:</span>
            <span className="text-2xl font-black text-white">
              R$ {comboPrice.toFixed(2).replace(".", ",")}
              <span className="text-xs font-normal text-white/40">/mês</span>
            </span>
          </div>
          {savings > 0 && (
            <motion.div
              className="flex items-center gap-2 bg-green-500/10 border border-green-500/20 rounded-xl px-3 py-2"
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
            >
              <TrendingDown className="w-4 h-4 text-green-400" />
              <span className="text-xs font-bold text-green-400">
                Economia de R$ {savings.toFixed(2).replace(".", ",")} por mês!
              </span>
            </motion.div>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

/* ── Combo Tier Badges (UNIQUE to Combos) ── */
const ComboTierBadge = ({ tier }: { tier: string }) => {
  const config: Record<string, { bg: string; icon: string; glow: string }> = {
    Start: { bg: "from-white/5 to-white/[0.02]", icon: "⚡", glow: "" },
    Plus: { bg: "from-blue-500/10 to-primary/5", icon: "💎", glow: "shadow-[0_0_20px_hsl(220_80%_60%/0.15)]" },
    Premium: { bg: "from-primary/15 to-orange-500/10", icon: "👑", glow: "shadow-glow" },
  };
  const c = config[tier] || config.Start;
  return (
    <motion.div
      className={`inline-flex items-center gap-1.5 bg-gradient-to-r ${c.bg} border border-white/10 rounded-full px-3 py-1 text-[10px] font-bold ${c.glow}`}
      animate={tier === "Premium" ? { scale: [1, 1.03, 1] } : {}}
      transition={{ duration: 2, repeat: Infinity }}
    >
      <span>{c.icon}</span>
      <span className="text-white/70">{tier}</span>
    </motion.div>
  );
};

/* ── Bundle Visual (UNIQUE to Combos) ── */
const BundleVisual = ({ includes }: { includes: string[] }) => (
  <div className="space-y-2">
    {includes.map((item, i) => (
      <motion.div
        key={i}
        className="flex items-center gap-2"
        initial={{ opacity: 0, x: -10 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true }}
        transition={{ delay: i * 0.08 }}
      >
        <div className="w-5 h-5 rounded-full bg-primary/15 flex items-center justify-center shrink-0">
          <Check className="w-3 h-3 text-primary" />
        </div>
        <span className="text-xs text-white/60">{item}</span>
        {i < includes.length - 1 && (
          <motion.div
            className="absolute left-2.5 mt-5 w-px h-3 bg-primary/10"
            animate={{ opacity: [0.2, 0.5, 0.2] }}
            transition={{ duration: 2, repeat: Infinity, delay: i * 0.2 }}
          />
        )}
      </motion.div>
    ))}
  </div>
);

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
      style={{ background: "radial-gradient(circle, hsl(280 60% 50% / 0.06) 0%, transparent 70%)", bottom: "-20%", right: "-10%" }}
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
const entertainmentServices = [
  { icon: Music, name: "JD Music", desc: "Streaming de música ilimitado com milhões de faixas.", color: "from-purple-500/20 to-primary/10" },
  { icon: Film, name: "JD Play", desc: "Filmes, séries e canais ao vivo em um único lugar.", color: "from-red-500/20 to-primary/10" },
  { icon: Tv, name: "JD TV", desc: "Canais ao vivo e on-demand para toda a família.", color: "from-blue-500/20 to-primary/10" },
  { icon: Smartphone, name: "JD Móvel", desc: "Internet 5G com WhatsApp ilimitado incluso.", color: "from-green-500/20 to-primary/10" },
];

const comboPlans = [
  {
    name: "COMBO START", speed: "400 Mega", tier: "Start",
    includes: ["Internet Fibra 400 Mega", "JD Music", "WhatsApp Ilimitado"],
    price: "109", cents: "90", popular: false, savingsPercent: 18,
  },
  {
    name: "COMBO PLUS", speed: "600 Mega", tier: "Plus",
    includes: ["Internet Fibra 600 Mega", "JD Music + JD Play", "Telefone Fixo Ilimitado", "Wi-Fi 6"],
    price: "139", cents: "90", popular: true, savingsPercent: 28,
  },
  {
    name: "COMBO PREMIUM", speed: "1 Giga", tier: "Premium",
    includes: ["Internet Fibra 1 Giga", "JD Music + JD Play + JD TV", "Telefone Fixo + Móvel 5G", "Wi-Fi 6 + Roteador Premium"],
    price: "189", cents: "90", popular: false, savingsPercent: 35,
  },
];

const faqs = [
  { q: "Posso escolher quais serviços incluir no combo?", a: "Nossos combos são pré-configurados para oferecer o melhor custo-benefício. Caso queira personalizar, fale com nossos consultores pelo WhatsApp." },
  { q: "Existe fidelidade nos combos?", a: "Não exigimos fidelidade! Você pode cancelar ou alterar seu combo a qualquer momento." },
  { q: "Os serviços de streaming são ilimitados?", a: "Sim! Todos os serviços de entretenimento inclusos nos combos são ilimitados, sem restrição de uso." },
  { q: "Consigo fazer upgrade do meu combo?", a: "Claro! Você pode fazer upgrade a qualquer momento pelo autoatendimento ou WhatsApp, sem burocracia." },
];

const Combos = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[hsl(220,20%,6%)] text-white overflow-x-hidden">
      <Navbar />

      {/* HERO with Service Orbit */}
      <section className="relative pt-[128px] sm:pt-[132px] md:pt-[176px] lg:pt-[184px] pb-16 sm:pb-24 overflow-hidden">
        <GlowingOrbs />
        <ParticleField />
        <CyberGrid />
        <div className="container mx-auto px-4 relative z-10">
          <div className="grid lg:grid-cols-2 gap-10 lg:gap-16 items-center">
            <motion.div initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
              <motion.span
                className="inline-flex items-center gap-2 bg-gradient-to-r from-primary/20 to-purple-500/10 border border-primary/30 text-primary text-xs font-bold px-4 py-2 rounded-full mb-6 backdrop-blur-sm"
                initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.2 }}
              >
                <motion.div animate={{ rotate: [0, 360] }} transition={{ duration: 4, repeat: Infinity, ease: "linear" }}>
                  <Sparkles className="w-3.5 h-3.5" />
                </motion.div>
                Ofertas Especiais
              </motion.span>
              <h1 className="font-display text-3xl sm:text-5xl lg:text-6xl xl:text-7xl font-bold leading-[1.05] mb-6">
                <span className="block">COMBOS</span>
                <motion.span
                  className="block bg-gradient-to-r from-primary via-orange-400 to-primary bg-clip-text text-transparent bg-[length:200%_auto]"
                  animate={{ backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"] }}
                  transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
                >INTERNET +</motion.span>
                <span className="block">MUITO MAIS<span className="text-primary">.</span></span>
              </h1>
              <p className="text-white/60 text-base sm:text-lg max-w-lg mb-8 leading-relaxed">
                Combine <strong className="text-primary font-bold">internet, telefonia e entretenimento</strong> em um único pacote com preço especial.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 mb-8">
                <Button size="lg" className="bg-primary text-primary-foreground rounded-full px-8 text-sm font-bold h-12 shadow-glow"
                  onClick={() => document.querySelector("#planos")?.scrollIntoView({ behavior: "smooth" })}
                >
                  <span className="flex items-center gap-2">Ver Combos <ArrowRight className="w-4 h-4" /></span>
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
                {[{ icon: Check, label: "Sem Fidelidade" }, { icon: Check, label: "Tudo Incluso" }, { icon: Check, label: "Até 35% OFF" }].map((item) => (
                  <span key={item.label} className="flex items-center gap-1.5"><item.icon className="w-4 h-4 text-primary" /> {item.label}</span>
                ))}
              </div>
            </motion.div>

            {/* Hero Visual: Service Orbit */}
            <motion.div className="flex justify-center lg:justify-end" initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 1, delay: 0.3 }}>
              <div className="relative">
                <div className="absolute inset-0 bg-primary/10 blur-[100px] rounded-full" />
                <ServiceOrbit />
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ENTERTAINMENT */}
      <section className="py-12 sm:py-16 border-y border-white/5 relative">
        <DataStreams />
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center mb-10 sm:mb-14">
            <span className="inline-flex items-center gap-2 text-primary text-xs font-bold mb-4">
              <Layers className="w-4 h-4" /> Entretenimento
            </span>
            <h2 className="font-display text-2xl sm:text-4xl font-bold mb-3">Serviços inclusos nos combos</h2>
            <p className="text-white/50 text-sm sm:text-base max-w-md mx-auto">Os melhores serviços para combinar com sua internet</p>
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {entertainmentServices.map((svc, i) => (
              <motion.div key={svc.name}
                className="relative bg-white/[0.04] border border-white/[0.08] rounded-2xl p-5 sm:p-6 hover:border-primary/30 transition-all duration-300 group overflow-hidden"
                whileHover={{ y: -4 }}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
              >
                <div className={`absolute inset-0 bg-gradient-to-br ${svc.color} opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />
                <div className="relative z-10">
                  <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                    <svc.icon className="w-5 h-5 text-primary" />
                  </div>
                  <h3 className="font-display text-sm sm:text-base font-bold mb-2">{svc.name}</h3>
                  <p className="text-xs sm:text-sm text-white/50 leading-relaxed">{svc.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* SAVINGS CALCULATOR (UNIQUE) */}
      <section className="py-16 sm:py-24 relative">
        <GlowingOrbs />
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center mb-10 sm:mb-14">
            <span className="inline-flex items-center gap-2 text-primary text-xs font-bold mb-4">
              <Calculator className="w-4 h-4" /> Simulador de Economia
            </span>
            <h2 className="font-display text-2xl sm:text-4xl lg:text-5xl font-bold mb-4">
              Calcule sua <span className="text-primary">economia</span>
            </h2>
            <p className="text-white/50 text-sm sm:text-base max-w-md mx-auto">
              Selecione os serviços que deseja e veja quanto você economiza no combo
            </p>
          </div>
          <SavingsCalculator />
        </div>
      </section>

      {/* PLANS with Tier Badges and Savings */}
      <section id="planos" className="py-16 sm:py-24 border-y border-white/5 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-primary/[0.02] to-transparent" />
        <CyberGrid />
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center mb-10 sm:mb-14">
            <span className="inline-flex items-center gap-2 text-primary text-xs font-bold mb-4">
              <Package className="w-4 h-4" /> Combos Exclusivos
            </span>
            <h2 className="font-display text-2xl sm:text-4xl lg:text-5xl font-bold mb-4">Nossos Combos</h2>
            <p className="text-white/50 text-sm sm:text-base max-w-md mx-auto">Internet + telefonia + entretenimento em um único pacote</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-5 max-w-5xl mx-auto">
            {comboPlans.map((plan, idx) => (
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
                  <div className={`px-4 py-2 flex items-center justify-between ${plan.tier === "Premium" ? "bg-gradient-to-r from-primary/20 to-orange-500/10" : plan.tier === "Plus" ? "bg-gradient-to-r from-primary/15 to-blue-500/10" : "bg-white/[0.03]"}`}>
                    <div className="flex items-center gap-2">
                      <Package className="w-3.5 h-3.5 text-primary" />
                      <span className="text-[10px] font-bold text-primary tracking-wider uppercase">{plan.tier}</span>
                    </div>
                    <motion.span
                      className="text-[10px] font-bold text-green-400 bg-green-500/10 px-2 py-0.5 rounded-full"
                      animate={{ scale: [1, 1.05, 1] }}
                      transition={{ duration: 2, repeat: Infinity }}
                    >
                      -{plan.savingsPercent}%
                    </motion.span>
                  </div>
                  <div className="p-5 flex-1 flex flex-col">
                    <div className="flex items-center gap-2 mb-3">
                      <h3 className="font-display text-xs sm:text-sm font-bold text-white/90">{plan.name}</h3>
                      <ComboTierBadge tier={plan.tier} />
                    </div>
                    <div className="flex items-center gap-2.5 mb-4">
                      <Wifi className="w-4 h-4 text-primary shrink-0" />
                      <div>
                        <span className="text-lg font-bold">{plan.speed}</span>
                        <span className="text-[10px] text-white/40 ml-1.5">FIBRA</span>
                      </div>
                    </div>
                    {plan.includes.map((item, i) => (
                      <motion.div key={i} className="flex items-center gap-2 mb-2"
                        initial={{ opacity: 0, x: -5 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: idx * 0.1 + i * 0.05 }}
                      >
                        <Check className="w-3.5 h-3.5 text-primary shrink-0" />
                        <span className="text-xs text-white/60">{item}</span>
                      </motion.div>
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

      {/* WHY CHOOSE */}
      <section className="py-16 sm:py-24 relative">
        <GlowingOrbs />
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center mb-10 sm:mb-14">
            <h2 className="font-display text-2xl sm:text-4xl font-bold mb-3">Por que escolher um <span className="text-primary">Combo JD</span>?</h2>
            <p className="text-white/50 text-sm sm:text-base max-w-md mx-auto">Tudo que você precisa em um único pacote</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 max-w-4xl mx-auto">
            {[
              { icon: BadgePercent, title: "Economia Real", desc: "Economize até 35% combinando internet, telefonia e entretenimento.", color: "from-primary/20 to-yellow-500/10" },
              { icon: Shield, title: "Sem Fidelidade", desc: "Cancele ou altere quando quiser, sem multas ou burocracia.", color: "from-blue-500/20 to-primary/10" },
              { icon: Gift, title: "Tudo Incluso", desc: "Internet, streaming, telefone e muito mais em um único pagamento.", color: "from-green-500/20 to-primary/10" },
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
            <p className="text-white/50 text-sm sm:text-base">Tire suas dúvidas sobre nossos combos</p>
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
          <h2 className="font-display text-2xl sm:text-4xl lg:text-5xl font-bold text-white mb-4">Monte seu combo ideal</h2>
          <p className="text-white/80 text-sm sm:text-base mb-8 max-w-md mx-auto">Fale com nossos consultores e encontre o pacote perfeito para você.</p>
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

export default Combos;
