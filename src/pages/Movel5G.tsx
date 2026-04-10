import { useState, useRef, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import {
  Signal, Phone, MessageCircle, Shield, Zap,
  ChevronDown, Check, Globe, Music, Star, ArrowRight, Headphones,
  CreditCard, BarChart3, Sparkles, MapPin, CheckCircle,
  ChevronLeft, ChevronRight
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import heroImg from "@/assets/movel-5g-hero-tech.png";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import WhatsAppButton from "@/components/WhatsAppButton";

/* Hook: observe element and add visible class once in viewport */
const useFadeUp = () => {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    el.style.opacity = "0";
    el.style.transform = "translateY(32px)";
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.style.opacity = "";
          el.style.transform = "";
          el.classList.add("movel-section-animate");
          obs.disconnect();
        }
      },
      { threshold: 0.05, rootMargin: "0px 0px 80px 0px" }
    );
    obs.observe(el);
    // Safety: if not triggered in 2s, force visible
    const safety = setTimeout(() => {
      el.style.opacity = "";
      el.style.transform = "";
      obs.disconnect();
    }, 2000);
    return () => { obs.disconnect(); clearTimeout(safety); };
  }, []);
  return ref;
};

const mobilePlans = [
  { tier: "Start", name: "JD VOZ 1000MIN | 5GB", data: "5GB", minutes: "1000 Minutos", price: "35", cents: "00", whatsapp: true, deezer: false, popular: false },
  { tier: "Start", name: "START 6 + DEEZER", data: "6GB", minutes: "100 Minutos", price: "39", cents: "90", whatsapp: true, deezer: true, popular: false },
  { tier: "Start", name: "START 8 + DEEZER", data: "8GB", minutes: "Ilimitados", price: "44", cents: "90", whatsapp: true, deezer: true, popular: false },
  { tier: "Start", name: "START 14 + DEEZER", data: "14GB", minutes: "Ilimitados", price: "54", cents: "90", whatsapp: true, deezer: true, popular: true },
  { tier: "Turbo", name: "TURBO 21 + DEEZER", data: "21GB", minutes: "Ilimitados", price: "64", cents: "90", whatsapp: true, deezer: true, popular: false },
  { tier: "Turbo", name: "TURBO 29 + DEEZER", data: "29GB", minutes: "Ilimitados", price: "69", cents: "90", whatsapp: true, deezer: true, popular: false },
  { tier: "Turbo", name: "TURBO 39 + DEEZER", data: "39GB", minutes: "Ilimitados", price: "89", cents: "90", whatsapp: true, deezer: true, popular: false },
  { tier: "Turbo", name: "TURBO 44 + DEEZER", data: "44GB", minutes: "Ilimitados", price: "94", cents: "90", whatsapp: true, deezer: true, popular: false },
];

const faqs = [
  { q: "É necessário pagar alguma taxa para aderir ao plano?", a: "Não há cobrança de taxa de adesão. Para aderir, o cliente deve adquirir e ativar o chip JD Móvel. A ativação é feita automaticamente após a primeira recarga." },
  { q: "Como é feita a renovação do plano?", a: "A renovação é automática e ocorre no dia seguinte ao término da validade (30 dias). Para isso, efetue o pagamento da próxima assinatura via Pix, Boleto ou Cartão pelo autoatendimento." },
  { q: "Como faço a portabilidade para a JD Móvel?", a: "Utilize o chat ou WhatsApp para solicitar. Serão necessários: Nome, CPF, número que deseja manter e operadora antiga. Em até 5 dias úteis seu plano estará disponível." },
  { q: "É possível fazer ligações internacionais (DDI)?", a: "Não. Os benefícios de voz/sms não são válidos para ligações internacionais." },
];

interface CoverageCity { name: string; state: string; lat: number; lng: number; has5g: boolean; }
const coverageCities: CoverageCity[] = [
  { name: "Manaus", state: "AM", lat: -3.119, lng: -60.022, has5g: true },
  { name: "Nhamundá", state: "AM", lat: -2.188, lng: -56.713, has5g: true },
  { name: "Terra Santa", state: "PA", lat: -2.104, lng: -56.488, has5g: false },
  { name: "Faro", state: "PA", lat: -2.168, lng: -56.741, has5g: false },
  { name: "Santarém", state: "PA", lat: -2.443, lng: -54.708, has5g: true },
  { name: "Oriximiná", state: "PA", lat: -1.766, lng: -55.866, has5g: false },
  { name: "Bagre", state: "PA", lat: -1.905, lng: -50.180, has5g: false },
  { name: "Breves", state: "PA", lat: -1.681, lng: -50.480, has5g: false },
  { name: "Melgaço", state: "PA", lat: -1.803, lng: -50.714, has5g: false },
  { name: "Portel", state: "PA", lat: -1.936, lng: -50.820, has5g: false },
  { name: "Redenção", state: "PA", lat: -8.028, lng: -50.032, has5g: true },
];
const mapBounds = { minLat: -9, maxLat: 1, minLng: -62, maxLng: -48 };
function toSvg(lat: number, lng: number) {
  return { x: ((lng - mapBounds.minLng) / (mapBounds.maxLng - mapBounds.minLng)) * 100, y: ((mapBounds.maxLat - lat) / (mapBounds.maxLat - mapBounds.minLat)) * 100 };
}

/* ── Decorative backgrounds ── */
const ParticleField = () => {
  const particles = Array.from({ length: 30 }, (_, i) => ({ id: i, x: Math.random() * 100, y: Math.random() * 100, size: Math.random() * 3 + 1, duration: Math.random() * 20 + 15, delay: Math.random() * 10 }));
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {particles.map((p) => (
        <motion.div key={p.id} className="absolute rounded-full bg-primary" style={{ left: `${p.x}%`, top: `${p.y}%`, width: p.size, height: p.size }}
          animate={{ y: [0, -40, 0, 30, 0], x: [0, 20, -10, 15, 0], opacity: [0.1, 0.5, 0.2, 0.6, 0.1] }}
          transition={{ duration: p.duration, repeat: Infinity, delay: p.delay, ease: "easeInOut" }} />
      ))}
    </div>
  );
};

const GlowingOrbs = () => (
  <div className="absolute inset-0 overflow-hidden pointer-events-none">
    <motion.div className="absolute w-[600px] h-[600px] rounded-full" style={{ background: "radial-gradient(circle, hsl(24 95% 50% / 0.12) 0%, transparent 70%)", top: "-10%", left: "-15%" }} animate={{ scale: [1, 1.3, 1], opacity: [0.4, 0.7, 0.4] }} transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }} />
    <motion.div className="absolute w-[500px] h-[500px] rounded-full" style={{ background: "radial-gradient(circle, hsl(200 80% 50% / 0.08) 0%, transparent 70%)", bottom: "-20%", right: "-10%" }} animate={{ scale: [1.2, 1, 1.2], opacity: [0.3, 0.6, 0.3] }} transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }} />
  </div>
);

const CyberGrid = () => (
  <div className="absolute inset-0 overflow-hidden pointer-events-none">
    <div className="absolute inset-0 opacity-[0.04]" style={{ backgroundImage: `linear-gradient(hsl(24 95% 50%) 1px, transparent 1px), linear-gradient(90deg, hsl(24 95% 50%) 1px, transparent 1px)`, backgroundSize: "80px 80px" }} />
    <motion.div className="absolute left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent" animate={{ top: ["0%", "100%"] }} transition={{ duration: 6, repeat: Infinity, ease: "linear" }} />
  </div>
);

const NeuralNetwork = () => {
  const nodes = Array.from({ length: 12 }, (_, i) => ({ x: 10 + (i % 4) * 28, y: 15 + Math.floor(i / 4) * 35 }));
  return (
    <svg className="absolute inset-0 w-full h-full opacity-[0.06] pointer-events-none" viewBox="0 0 100 100">
      {nodes.map((n1, i) => nodes.slice(i + 1).map((n2, j) => { const dist = Math.sqrt((n1.x - n2.x) ** 2 + (n1.y - n2.y) ** 2); if (dist > 40) return null; return <line key={`${i}-${j}`} x1={n1.x} y1={n1.y} x2={n2.x} y2={n2.y} stroke="hsl(24 95% 50%)" strokeWidth="0.3" />; }))}
      {nodes.map((n, i) => (<circle key={i} cx={n.x} cy={n.y} r="1.5" fill="hsl(24 95% 50%)" opacity="0.6"><animate attributeName="opacity" values="0.3;0.8;0.3" dur={`${2 + i * 0.3}s`} repeatCount="indefinite" /></circle>))}
    </svg>
  );
};

const DataStreams = () => (
  <div className="absolute inset-0 overflow-hidden pointer-events-none">
    {[20, 40, 60, 80].map((left, i) => (
      <motion.div key={i} className="absolute w-px h-32" style={{ left: `${left}%`, background: `linear-gradient(to bottom, transparent, hsl(24 95% 50% / 0.2), transparent)` }} animate={{ top: ["-20%", "120%"] }} transition={{ duration: 4 + i, repeat: Infinity, delay: i * 1.2, ease: "linear" }} />
    ))}
  </div>
);

/* ── Sub-components ── */
const FaqItem = ({ q, a }: { q: string; a: string }) => {
  const [open, setOpen] = useState(false);
  return (
    <div className="border border-white/10 rounded-2xl overflow-hidden bg-white/[0.03] backdrop-blur-sm">
      <button onClick={() => setOpen(!open)} className="w-full flex items-center justify-between p-5 text-left">
        <span className="text-sm sm:text-base font-semibold text-white pr-4">{q}</span>
        <ChevronDown className={`w-5 h-5 text-primary shrink-0 transition-transform duration-300 ${open ? "rotate-180" : ""}`} />
      </button>
      {open && <p className="px-5 pb-5 text-sm text-white/60 leading-relaxed">{a}</p>}
    </div>
  );
};

const PlanCard = ({ plan, navigate }: { plan: typeof mobilePlans[0]; navigate: (p: string) => void }) => (
  <div className="relative h-full">
    {plan.popular && <div className="absolute -top-3 left-1/2 -translate-x-1/2 z-10 bg-primary text-primary-foreground text-[10px] font-bold px-3 py-1 rounded-full whitespace-nowrap">⭐ MAIS POPULAR</div>}
    <div className={`rounded-2xl overflow-hidden h-full flex flex-col border transition-all backdrop-blur-sm ${plan.popular ? "border-primary shadow-glow-lg bg-white/[0.06]" : "border-white/[0.08] bg-white/[0.03] hover:border-white/15"}`}>
      <div className={`px-4 py-2 flex items-center gap-2 ${plan.tier === "Turbo" ? "bg-gradient-to-r from-primary/20 to-orange-500/10" : "bg-white/[0.03]"}`}>
        <Zap className="w-3.5 h-3.5 text-primary" />
        <span className="text-[10px] font-bold text-primary tracking-wider uppercase">{plan.tier}</span>
        {plan.tier === "Turbo" && <span className="text-[10px]">🔥</span>}
      </div>
      <div className="p-5 flex-1 flex flex-col">
        <h3 className="font-display text-xs sm:text-sm font-bold mb-4 text-white/90 leading-tight min-h-[2rem]">{plan.name}</h3>
        <div className="flex items-center gap-2.5 mb-3"><Globe className="w-4 h-4 text-primary shrink-0" /><div><span className="text-lg font-bold">{plan.data}</span><span className="text-[10px] text-white/40 ml-1.5">INTERNET 5G</span></div></div>
        <div className="flex items-center gap-2.5 mb-3"><MessageCircle className="w-4 h-4 text-green-400 shrink-0" /><div><span className="text-xs font-medium">WhatsApp Ilimitado</span><p className="text-[10px] text-white/40">Sem descontar da franquia</p></div></div>
        <div className="flex items-center gap-2.5 mb-5"><Phone className="w-4 h-4 text-primary shrink-0" /><div><span className="text-xs font-medium">{plan.minutes}</span><p className="text-[10px] text-white/40">Para todo Brasil</p></div></div>
        {plan.deezer && <div className="flex items-center gap-1.5 mb-5 bg-white/[0.04] rounded-lg px-3 py-1.5"><Music className="w-3 h-3 text-primary" /><span className="text-[10px] font-medium text-white/60">Deezer incluso</span></div>}
        <div className="mt-auto">
          <p className="text-[10px] text-white/40 mb-1">Por apenas</p>
          <div className="flex items-baseline mb-4">
            <span className="text-sm text-primary font-bold mr-1">R$</span>
            <span className="font-display text-3xl sm:text-4xl font-extrabold">{plan.price}</span>
            <span className="text-sm font-bold">.{plan.cents}</span>
            <span className="text-xs text-white/40 ml-1">/mês</span>
          </div>
          <Button className={`w-full rounded-xl h-11 text-sm font-bold ${plan.popular ? "bg-primary text-primary-foreground hover:bg-primary/90 shadow-glow" : "bg-primary/20 text-primary border border-primary/30 hover:bg-primary/30"}`} onClick={() => navigate("/cadastro")}>Assinar Agora</Button>
        </div>
      </div>
    </div>
  </div>
);

const PlansCarousel = ({ plans, navigate }: { plans: typeof mobilePlans; navigate: (p: string) => void }) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [current, setCurrent] = useState(0);
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => { const check = () => setIsMobile(window.innerWidth < 768); check(); window.addEventListener("resize", check); return () => window.removeEventListener("resize", check); }, []);
  const updateCurrent = useCallback(() => { const el = scrollRef.current; if (!el) return; const cardWidth = el.scrollWidth / plans.length; setCurrent(Math.round(el.scrollLeft / cardWidth)); }, [plans.length]);
  const scrollToIndex = (idx: number) => { const el = scrollRef.current; if (!el) return; const cardWidth = el.scrollWidth / plans.length; el.scrollTo({ left: cardWidth * idx, behavior: "smooth" }); setCurrent(idx); };

  if (!isMobile) {
    return (
      <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-5 max-w-6xl mx-auto">
        {plans.map((plan) => <PlanCard key={plan.name} plan={plan} navigate={navigate} />)}
      </div>
    );
  }

  return (
    <div className="relative">
      <div ref={scrollRef} onScroll={updateCurrent} className="flex gap-4 overflow-x-auto snap-x snap-mandatory pb-4 -mx-4 px-4" style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}>
        {plans.map((plan) => (<div key={plan.name} className="snap-center shrink-0 w-[280px]"><PlanCard plan={plan} navigate={navigate} /></div>))}
      </div>
      {current > 0 && <button onClick={() => scrollToIndex(current - 1)} className="absolute left-0 top-1/2 -translate-y-1/2 z-10 w-9 h-9 rounded-full bg-primary/90 text-white flex items-center justify-center shadow-lg"><ChevronLeft className="w-5 h-5" /></button>}
      {current < plans.length - 1 && <button onClick={() => scrollToIndex(current + 1)} className="absolute right-0 top-1/2 -translate-y-1/2 z-10 w-9 h-9 rounded-full bg-primary/90 text-white flex items-center justify-center shadow-lg"><ChevronRight className="w-5 h-5" /></button>}
      <div className="flex justify-center gap-1.5 mt-4">
        {plans.map((_, i) => (<button key={i} onClick={() => scrollToIndex(i)} className={`rounded-full transition-all duration-300 ${i === current ? "w-6 h-2 bg-primary" : "w-2 h-2 bg-white/20 hover:bg-white/40"}`} />))}
      </div>
    </div>
  );
};

const CoverageMapSection = () => {
  const [activeCity, setActiveCity] = useState<string | null>(null);
  return (
    <section id="cobertura" className="py-16 sm:py-24 border-y border-white/5 relative">
      <DataStreams />
      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-10 sm:mb-14">
          <span className="inline-flex items-center gap-2 text-primary text-xs font-bold mb-4"><MapPin className="w-4 h-4" /> Cobertura Móvel</span>
          <h2 className="font-display text-2xl sm:text-4xl lg:text-5xl font-bold mb-4">Onde estamos com <span className="text-primary">5G</span></h2>
          <p className="text-white/50 text-sm sm:text-base max-w-md mx-auto">Cobertura crescente na região Norte, levando conexão 5G para mais cidades</p>
        </div>
        <div className="grid lg:grid-cols-5 gap-8 items-start max-w-5xl mx-auto">
          <div className="lg:col-span-3">
            <div className="relative bg-white/[0.03] border border-white/[0.08] rounded-3xl p-6 md:p-10 overflow-hidden">
              <NeuralNetwork />
              <div className="absolute top-0 right-0 w-48 h-48 bg-primary/5 blur-[80px] pointer-events-none" />
              <svg viewBox="0 0 100 100" className="w-full h-auto relative z-10" style={{ minHeight: 250 }}>
                <path d="M5,20 L12,12 L22,10 L30,14 L35,10 L40,15 L38,25 L42,35 L38,45 L30,50 L22,48 L15,42 L8,35 L5,28 Z" fill="hsl(24 95% 50% / 0.06)" stroke="hsl(24 95% 50% / 0.15)" strokeWidth="0.3" />
                <path d="M40,15 L50,10 L60,12 L72,15 L80,20 L85,30 L82,42 L78,55 L70,65 L60,70 L50,68 L42,60 L38,50 L42,35 L40,25 Z" fill="hsl(24 95% 50% / 0.06)" stroke="hsl(24 95% 50% / 0.15)" strokeWidth="0.3" />
                <path d="M60,70 L65,78 L70,90 L62,92 L55,85 L50,75 L50,68 Z" fill="hsl(24 95% 50% / 0.04)" stroke="hsl(24 95% 50% / 0.12)" strokeWidth="0.3" />
                {coverageCities.map((city, i) => { const pos = toSvg(city.lat, city.lng); return coverageCities.slice(i + 1).map((city2) => { const pos2 = toSvg(city2.lat, city2.lng); const dist = Math.sqrt((pos.x - pos2.x) ** 2 + (pos.y - pos2.y) ** 2); if (dist > 25) return null; return <line key={`${city.name}-${city2.name}`} x1={pos.x} y1={pos.y} x2={pos2.x} y2={pos2.y} stroke="hsl(24 95% 50%)" strokeWidth="0.15" opacity="0.3" />; }); })}
                {coverageCities.map((city) => { const pos = toSvg(city.lat, city.lng); const isActive = activeCity === city.name; return (
                  <g key={city.name} onMouseEnter={() => setActiveCity(city.name)} onMouseLeave={() => setActiveCity(null)} className="cursor-pointer">
                    {isActive && <circle cx={pos.x} cy={pos.y} r={3} fill="none" stroke="hsl(24 95% 50%)" strokeWidth="0.3" opacity={0.6}><animate attributeName="r" from="2" to="5" dur="1.5s" repeatCount="indefinite" /><animate attributeName="opacity" from="0.6" to="0" dur="1.5s" repeatCount="indefinite" /></circle>}
                    <circle cx={pos.x} cy={pos.y} r={isActive ? 1.8 : 1.2} fill={city.has5g ? "hsl(24 95% 50%)" : "hsl(200 60% 50%)"} className="transition-all duration-300" />
                    {isActive && <><rect x={pos.x - 12} y={pos.y - 7} width="24" height="4.5" rx="1" fill="hsl(24 95% 50%)" opacity="0.95" /><text x={pos.x} y={pos.y - 4} textAnchor="middle" fill="white" fontSize="2.2" fontWeight="bold" fontFamily="Space Grotesk, sans-serif">{city.name} - {city.state} {city.has5g ? "• 5G" : ""}</text></>}
                  </g>
                ); })}
              </svg>
              <div className="flex items-center justify-center gap-4 mt-4 relative z-10 flex-wrap">
                <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-primary" /><span className="text-xs text-white/40">Cobertura 5G</span></div>
                <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-[hsl(200,60%,50%)]" /><span className="text-xs text-white/40">Cobertura 4G</span></div>
              </div>
            </div>
          </div>
          <div className="lg:col-span-2">
            <div className="grid grid-cols-2 lg:grid-cols-1 gap-2">
              {coverageCities.map((city) => (
                <button key={city.name} onMouseEnter={() => setActiveCity(city.name)} onMouseLeave={() => setActiveCity(null)}
                  className={`w-full flex items-center gap-2.5 p-3 sm:p-4 rounded-xl border transition-all duration-300 text-left group ${activeCity === city.name ? "border-primary bg-primary/10 scale-[1.02]" : "border-white/[0.08] bg-white/[0.03] hover:border-white/15"}`}>
                  <CheckCircle className={`w-4 h-4 shrink-0 transition-colors ${activeCity === city.name ? "text-primary" : "text-white/30"}`} />
                  <div className="min-w-0">
                    <p className="font-display font-semibold text-white text-xs sm:text-sm truncate">{city.name}</p>
                    <p className="text-[10px] text-white/40">{city.state} • {city.has5g ? "5G" : "4G"}</p>
                  </div>
                  {city.has5g && <span className="ml-auto text-[9px] font-bold bg-primary/20 text-primary px-1.5 py-0.5 rounded-full shrink-0">5G</span>}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

/* ── Main Page ── */
const Movel5G = () => {
  const [filter, setFilter] = useState<"all" | "start" | "turbo">("all");
  const navigate = useNavigate();
  const filtered = mobilePlans.filter((p) => filter === "all" || p.tier.toLowerCase() === filter);
  const featuresRef = useFadeUp();
  const plansRef = useFadeUp();
  const coverageRef = useFadeUp();
  const aboutRef = useFadeUp();
  const whyRef = useFadeUp();
  const faqRef = useFadeUp();
  const ctaRef = useFadeUp();

  return (
    <div className="min-h-screen bg-[hsl(220,20%,6%)] text-white overflow-x-hidden">
      <Navbar />

      {/* HERO */}
      <section id="inicio" className="relative pt-[128px] sm:pt-[132px] md:pt-[176px] lg:pt-[184px] pb-16 sm:pb-24 overflow-hidden">
        <GlowingOrbs />
        <ParticleField />
        <CyberGrid />
        <div className="container mx-auto px-4 relative z-10">
          <div className="grid lg:grid-cols-2 gap-10 lg:gap-16 items-center">
            <motion.div initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
              <motion.span className="inline-flex items-center gap-2 bg-gradient-to-r from-primary/20 to-blue-500/10 border border-primary/30 text-primary text-xs font-bold px-4 py-2 rounded-full mb-6 backdrop-blur-sm" initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.2 }}>
                <motion.div animate={{ rotate: [0, 360] }} transition={{ duration: 4, repeat: Infinity, ease: "linear" }}><Sparkles className="w-3.5 h-3.5" /></motion.div>
                Tecnologia de Última Geração
              </motion.span>
              <h1 className="font-display text-3xl sm:text-5xl lg:text-6xl xl:text-7xl font-bold leading-[1.05] mb-6">
                <span className="block">A ERA</span>
                <motion.span className="block bg-gradient-to-r from-primary via-orange-400 to-primary bg-clip-text text-transparent bg-[length:200%_auto]" animate={{ backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"] }} transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}>DIGITAL</motion.span>
                <span className="block">CHEGOU<span className="text-primary">.</span></span>
              </h1>
              <p className="text-white/60 text-base sm:text-lg max-w-lg mb-8 leading-relaxed">Conheça os planos da <strong className="text-primary font-bold">JD MÓVEL</strong> e aproveite liberdade total, com internet ultra-rápida, chamadas ilimitadas e muito mais.</p>
              <div className="flex flex-col sm:flex-row gap-3 mb-8">
                <Button size="lg" className="bg-primary text-primary-foreground rounded-full px-8 text-sm font-bold h-12 shadow-glow" onClick={() => document.querySelector("#planos")?.scrollIntoView({ behavior: "smooth" })}>
                  <span className="flex items-center gap-2">Pedir Chip <ArrowRight className="w-4 h-4" /></span>
                </Button>
                <Button size="lg" variant="outline" className="border-primary/50 text-primary hover:bg-primary/10 rounded-full px-8 h-12 font-bold backdrop-blur-sm" onClick={() => document.querySelector("#cobertura")?.scrollIntoView({ behavior: "smooth" })}>Ver Cobertura</Button>
              </div>
              <div className="flex flex-wrap gap-6 text-xs sm:text-sm text-white/50">
                {[{ icon: Check, label: "Internet Ultra Rápida" }, { icon: Check, label: "Chamadas Ilimitadas" }, { icon: Check, label: "Suporte 24/7" }].map((item) => (
                  <span key={item.label} className="flex items-center gap-1.5"><item.icon className="w-4 h-4 text-primary" /> {item.label}</span>
                ))}
              </div>
            </motion.div>

            <motion.div className="flex justify-center lg:justify-end" initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 1, delay: 0.3 }}>
              <div className="relative">
                <motion.div className="absolute inset-[-20%] border border-primary/10 rounded-full" animate={{ rotate: 360 }} transition={{ duration: 30, repeat: Infinity, ease: "linear" }} />
                <motion.div className="absolute inset-[-10%] border border-primary/5 rounded-full" animate={{ rotate: -360 }} transition={{ duration: 20, repeat: Infinity, ease: "linear" }} />
                <div className="absolute inset-0 bg-primary/20 blur-[80px] rounded-full" />
                <img src={heroImg} alt="5G Mobile" className="relative w-64 sm:w-80 lg:w-96 h-auto drop-shadow-2xl" width={1024} height={1024} />
                <motion.div className="absolute -top-2 -right-2 sm:-top-4 sm:-right-4 bg-gradient-to-br from-primary to-orange-600 text-primary-foreground text-xl sm:text-2xl font-black px-4 py-2 rounded-2xl shadow-glow-lg" animate={{ y: [0, -8, 0] }} transition={{ duration: 3, repeat: Infinity }}>5G</motion.div>
                <motion.div className="absolute -bottom-2 -left-2 sm:-bottom-4 sm:-left-4 bg-white/10 backdrop-blur-xl border border-white/20 rounded-xl px-3 py-2 text-xs" animate={{ y: [0, 5, 0] }} transition={{ duration: 4, repeat: Infinity, delay: 1.5 }}>
                  <div className="flex items-center gap-1.5"><motion.div className="w-2 h-2 rounded-full bg-green-400" animate={{ opacity: [1, 0.3, 1] }} transition={{ duration: 1.5, repeat: Infinity }} /><span className="font-bold text-white">1Gbps</span></div>
                  <p className="text-white/40 text-[9px]">Velocidade máx.</p>
                </motion.div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section ref={featuresRef} className="py-12 sm:py-16 border-y border-white/5 relative">
        <DataStreams />
        <div className="container mx-auto px-4 relative z-10">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {[
              { icon: Shield, title: "Segurança", desc: "Dados protegidos com criptografia avançada.", color: "from-blue-500/20 to-primary/10" },
              { icon: Zap, title: "Gestão Fácil", desc: "Controle tudo pelo autoatendimento online.", color: "from-primary/20 to-yellow-500/10" },
              { icon: CreditCard, title: "Faturas Simples", desc: "Renove seu plano com praticidade total.", color: "from-green-500/20 to-primary/10" },
              { icon: BarChart3, title: "Acúmulo de Gigas", desc: "Acompanhe seus gigas em tempo real.", color: "from-purple-500/20 to-primary/10" },
            ].map((f) => (
              <div key={f.title} className="relative bg-white/[0.04] border border-white/[0.08] rounded-2xl p-5 sm:p-6 hover:border-primary/30 transition-all duration-300 group overflow-hidden">
                <div className={`absolute inset-0 bg-gradient-to-br ${f.color} opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />
                <div className="relative z-10">
                  <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors"><f.icon className="w-5 h-5 text-primary" /></div>
                  <h3 className="font-display text-sm sm:text-base font-bold mb-2">{f.title}</h3>
                  <p className="text-xs sm:text-sm text-white/50 leading-relaxed">{f.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* PLANS */}
      <section ref={plansRef} id="planos" className="py-16 sm:py-24 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-primary/[0.02] to-transparent" />
        <CyberGrid />
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center mb-10 sm:mb-14">
            <span className="inline-flex items-center gap-2 text-primary text-xs font-bold mb-4"><Star className="w-4 h-4" /> Planos Premium</span>
            <h2 className="font-display text-2xl sm:text-4xl lg:text-5xl font-bold mb-4">Escolha Seu Plano</h2>
            <p className="text-white/50 text-sm sm:text-base max-w-md mx-auto">Internet ultra-rápida 5G, WhatsApp ilimitado e muito mais</p>
          </div>
          <div className="flex justify-center gap-2 mb-8 sm:mb-10">
            {[{ label: "Todos", value: "all" as const, icon: Signal }, { label: "Start", value: "start" as const, icon: Zap }, { label: "Turbo", value: "turbo" as const, icon: Sparkles }].map((tab) => (
              <button key={tab.value} onClick={() => setFilter(tab.value)} className={`flex items-center gap-1.5 px-4 sm:px-5 py-2.5 rounded-full text-xs sm:text-sm font-bold transition-all ${filter === tab.value ? "bg-primary text-primary-foreground shadow-glow" : "bg-white/[0.06] text-white/60 hover:bg-white/[0.1]"}`}>
                <tab.icon className="w-3.5 h-3.5" />{tab.label}
              </button>
            ))}
          </div>
          <PlansCarousel plans={filtered} navigate={navigate} />
        </div>
      </section>

      {/* COVERAGE */}
      <div ref={coverageRef}>
        <CoverageMapSection />
      </div>

      {/* ABOUT */}
      <section ref={aboutRef} id="sobre" className="py-16 sm:py-24 border-y border-white/5 relative">
        <GlowingOrbs />
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-3xl mx-auto text-center">
            <span className="inline-flex items-center gap-2 text-primary text-xs font-bold mb-4"><Sparkles className="w-4 h-4" /> Sobre Nós</span>
            <h2 className="font-display text-2xl sm:text-4xl lg:text-5xl font-bold mb-6">Conectando Pessoas e Simplicidade</h2>
            <p className="text-white/50 text-sm sm:text-base leading-relaxed mb-8">Somos diferentes de tudo que você já viu! Estamos comprometidos em revolucionar a maneira como você interage com a sua operadora através de uma abordagem completamente digital. Sem complicações! Com um atendimento personalizado, mais próximo das pessoas, fácil de usar e altamente eficaz.</p>
          </div>
        </div>
      </section>

      {/* WHY CHOOSE */}
      <section ref={whyRef} className="py-16 sm:py-24 relative">
        <DataStreams />
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center mb-10 sm:mb-14">
            <h2 className="font-display text-2xl sm:text-4xl font-bold mb-3">Por que escolher a <span className="text-primary">JD Móvel</span>?</h2>
            <p className="text-white/50 text-sm sm:text-base max-w-md mx-auto">Conectamos pessoas, sonhos e oportunidades.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 max-w-4xl mx-auto">
            {[
              { icon: Zap, title: "Internet de Alta Performance", desc: "Estabilidade e velocidade real para aproveitar cada segundo online.", color: "from-primary/20 to-yellow-500/10" },
              { icon: Headphones, title: "Atendimento Humano 24h", desc: "Nossa equipe está sempre pronta para ajudar você de verdade.", color: "from-blue-500/20 to-primary/10" },
              { icon: Star, title: "Planos que Cabem no Bolso", desc: "Qualidade premium com o melhor custo-benefício do mercado.", color: "from-green-500/20 to-primary/10" },
            ].map((item) => (
              <div key={item.title} className="relative bg-white/[0.04] border border-white/[0.08] rounded-2xl p-6 text-center hover:border-primary/30 transition-all overflow-hidden group">
                <div className={`absolute inset-0 bg-gradient-to-br ${item.color} opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />
                <div className="relative z-10">
                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mx-auto mb-4"><item.icon className="w-6 h-6 text-primary" /></div>
                  <h3 className="font-display text-sm sm:text-base font-bold mb-2">{item.title}</h3>
                  <p className="text-xs sm:text-sm text-white/50 leading-relaxed">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section ref={faqRef} id="contato" className="py-16 sm:py-24 border-t border-white/5">
        <div className="container mx-auto px-4">
          <div className="text-center mb-10 sm:mb-14">
            <h2 className="font-display text-2xl sm:text-4xl font-bold mb-3">Perguntas Frequentes</h2>
            <p className="text-white/50 text-sm sm:text-base">Tire suas dúvidas sobre nossos serviços</p>
          </div>
          <div className="max-w-2xl mx-auto space-y-3">
            {faqs.map((faq, i) => <FaqItem key={i} q={faq.q} a={faq.a} />)}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section ref={ctaRef} className="py-16 sm:py-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary via-[hsl(20,92%,45%)] to-[hsl(10,80%,35%)]" />
        <div className="absolute inset-0 opacity-20" style={{ backgroundImage: `radial-gradient(circle at 30% 50%, white 0%, transparent 50%)` }} />
        <ParticleField />
        <div className="container mx-auto px-4 relative z-10 text-center">
          <h2 className="font-display text-2xl sm:text-4xl lg:text-5xl font-bold text-white mb-4">Pronto para a revolução 5G?</h2>
          <p className="text-white/80 text-sm sm:text-base mb-8 max-w-md mx-auto">Peça já o seu chip e entre na nova era digital com a JD Móvel.</p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Button size="lg" className="bg-white text-primary hover:bg-white/90 rounded-full px-8 h-12 font-bold shadow-lg" onClick={() => navigate("/cadastro")}>Pedir Meu Chip <ArrowRight className="w-4 h-4 ml-1" /></Button>
            <Button size="lg" className="bg-transparent border-2 border-white/40 text-white hover:bg-white/10 rounded-full px-8 h-12 font-bold" asChild>
              <a href="https://wa.me/558005945678" target="_blank" rel="noopener noreferrer"><MessageCircle className="w-4 h-4 mr-1" /> Falar no WhatsApp</a>
            </Button>
          </div>
        </div>
      </section>

      <Footer />
      <WhatsAppButton />
    </div>
  );
};

export default Movel5G;
