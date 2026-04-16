import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import {
  Tv, Music, Film, Smartphone, Wifi, ArrowRight, Sparkles, Package,
  ChevronDown, Check, Star, MessageCircle, Shield, Zap, Globe, Headphones
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import WhatsAppButton from "@/components/WhatsAppButton";

/* ── Decorative backgrounds ── */
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
      {open && <p className="px-5 pb-5 text-sm text-white/60 leading-relaxed">{a}</p>}
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
    price: "109", cents: "90", popular: false,
  },
  {
    name: "COMBO PLUS", speed: "600 Mega", tier: "Plus",
    includes: ["Internet Fibra 600 Mega", "JD Music + JD Play", "Telefone Fixo Ilimitado", "Wi-Fi 6"],
    price: "139", cents: "90", popular: true,
  },
  {
    name: "COMBO PREMIUM", speed: "1 Giga", tier: "Premium",
    includes: ["Internet Fibra 1 Giga", "JD Music + JD Play + JD TV", "Telefone Fixo + Móvel 5G", "Wi-Fi 6 + Roteador Premium"],
    price: "189", cents: "90", popular: false,
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

      {/* HERO */}
      <section className="relative pt-[128px] sm:pt-[132px] md:pt-[176px] lg:pt-[184px] pb-16 sm:pb-24 overflow-hidden">
        <GlowingOrbs />
        <ParticleField />
        <CyberGrid />
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
                {[{ icon: Check, label: "Sem Fidelidade" }, { icon: Check, label: "Tudo Incluso" }, { icon: Check, label: "Melhor Preço" }].map((item) => (
                  <span key={item.label} className="flex items-center gap-1.5"><item.icon className="w-4 h-4 text-primary" /> {item.label}</span>
                ))}
              </div>
            </motion.div>

            <motion.div className="flex justify-center lg:justify-end" initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 1, delay: 0.3 }}>
              <div className="relative">
                <motion.div className="absolute inset-[-20%] border border-primary/10 rounded-full" animate={{ rotate: 360 }} transition={{ duration: 30, repeat: Infinity, ease: "linear" }} />
                <div className="absolute inset-0 bg-primary/20 blur-[80px] rounded-full" />
                <div className="relative w-64 sm:w-80 lg:w-96 h-64 sm:h-80 lg:h-96 flex items-center justify-center">
                  <div className="grid grid-cols-2 gap-3">
                    {[
                      { icon: Wifi, label: "Internet" },
                      { icon: Tv, label: "TV" },
                      { icon: Music, label: "Música" },
                      { icon: Smartphone, label: "Móvel" },
                    ].map((item, i) => (
                      <motion.div key={item.label}
                        className="w-28 h-28 sm:w-36 sm:h-36 rounded-2xl bg-white/[0.05] border border-white/[0.1] backdrop-blur-sm flex flex-col items-center justify-center gap-2"
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.5 + i * 0.15, duration: 0.5 }}
                        whileHover={{ scale: 1.05, borderColor: "hsl(24 95% 50% / 0.4)" }}
                      >
                        <item.icon className="w-8 h-8 text-primary" />
                        <span className="text-xs font-bold text-white/70">{item.label}</span>
                      </motion.div>
                    ))}
                  </div>
                  <motion.div
                    className="absolute -top-2 -right-2 sm:-top-4 sm:-right-4 bg-gradient-to-br from-primary to-orange-600 text-primary-foreground text-sm sm:text-base font-black px-3 py-1.5 rounded-xl shadow-glow-lg"
                    animate={{ y: [0, -8, 0] }}
                    transition={{ duration: 3, repeat: Infinity }}
                  >COMBO</motion.div>
                </div>
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
              <Sparkles className="w-4 h-4" /> Entretenimento
            </span>
            <h2 className="font-display text-2xl sm:text-4xl font-bold mb-3">Serviços inclusos nos combos</h2>
            <p className="text-white/50 text-sm sm:text-base max-w-md mx-auto">Os melhores serviços de entretenimento para combinar com sua internet</p>
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {entertainmentServices.map((svc) => (
              <div key={svc.name} className="relative bg-white/[0.04] border border-white/[0.08] rounded-2xl p-5 sm:p-6 hover:border-primary/30 transition-all duration-300 group overflow-hidden">
                <div className={`absolute inset-0 bg-gradient-to-br ${svc.color} opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />
                <div className="relative z-10">
                  <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                    <svc.icon className="w-5 h-5 text-primary" />
                  </div>
                  <h3 className="font-display text-sm sm:text-base font-bold mb-2">{svc.name}</h3>
                  <p className="text-xs sm:text-sm text-white/50 leading-relaxed">{svc.desc}</p>
                </div>
              </div>
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
              <Package className="w-4 h-4" /> Combos Exclusivos
            </span>
            <h2 className="font-display text-2xl sm:text-4xl lg:text-5xl font-bold mb-4">Nossos Combos</h2>
            <p className="text-white/50 text-sm sm:text-base max-w-md mx-auto">Internet + telefonia + entretenimento em um único pacote</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-5 max-w-5xl mx-auto">
            {comboPlans.map((plan) => (
              <div key={plan.name} className="relative h-full">
                {plan.popular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 z-10 bg-primary text-primary-foreground text-[10px] font-bold px-3 py-1 rounded-full whitespace-nowrap">
                    ⭐ MAIS POPULAR
                  </div>
                )}
                <div className={`rounded-2xl overflow-hidden h-full flex flex-col border transition-all backdrop-blur-sm ${plan.popular ? "border-primary shadow-glow-lg bg-white/[0.06]" : "border-white/[0.08] bg-white/[0.03] hover:border-white/15"}`}>
                  <div className={`px-4 py-2 flex items-center gap-2 ${plan.tier === "Premium" ? "bg-gradient-to-r from-primary/20 to-orange-500/10" : plan.tier === "Plus" ? "bg-gradient-to-r from-primary/15 to-blue-500/10" : "bg-white/[0.03]"}`}>
                    <Package className="w-3.5 h-3.5 text-primary" />
                    <span className="text-[10px] font-bold text-primary tracking-wider uppercase">{plan.tier}</span>
                    {plan.tier === "Premium" && <span className="text-[10px]">👑</span>}
                  </div>
                  <div className="p-5 flex-1 flex flex-col">
                    <h3 className="font-display text-xs sm:text-sm font-bold mb-2 text-white/90">{plan.name}</h3>
                    <div className="flex items-center gap-2.5 mb-4">
                      <Wifi className="w-4 h-4 text-primary shrink-0" />
                      <div>
                        <span className="text-lg font-bold">{plan.speed}</span>
                        <span className="text-[10px] text-white/40 ml-1.5">FIBRA</span>
                      </div>
                    </div>
                    {plan.includes.map((item, i) => (
                      <div key={i} className="flex items-center gap-2 mb-2">
                        <Check className="w-3.5 h-3.5 text-primary shrink-0" />
                        <span className="text-xs text-white/60">{item}</span>
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
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* WHY CHOOSE */}
      <section className="py-16 sm:py-24 border-y border-white/5 relative">
        <GlowingOrbs />
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center mb-10 sm:mb-14">
            <h2 className="font-display text-2xl sm:text-4xl font-bold mb-3">Por que escolher um <span className="text-primary">Combo JD</span>?</h2>
            <p className="text-white/50 text-sm sm:text-base max-w-md mx-auto">Tudo que você precisa em um único pacote</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 max-w-4xl mx-auto">
            {[
              { icon: Zap, title: "Economia Real", desc: "Pague menos combinando internet, telefonia e entretenimento.", color: "from-primary/20 to-yellow-500/10" },
              { icon: Shield, title: "Sem Fidelidade", desc: "Cancele ou altere quando quiser, sem multas ou burocracia.", color: "from-blue-500/20 to-primary/10" },
              { icon: Headphones, title: "Suporte Total", desc: "Atendimento humano 24h para todos os serviços do combo.", color: "from-green-500/20 to-primary/10" },
            ].map((item) => (
              <div key={item.title} className="relative bg-white/[0.04] border border-white/[0.08] rounded-2xl p-6 text-center hover:border-primary/30 transition-all overflow-hidden group">
                <div className={`absolute inset-0 bg-gradient-to-br ${item.color} opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />
                <div className="relative z-10">
                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
                    <item.icon className="w-6 h-6 text-primary" />
                  </div>
                  <h3 className="font-display text-sm sm:text-base font-bold mb-2">{item.title}</h3>
                  <p className="text-xs sm:text-sm text-white/50 leading-relaxed">{item.desc}</p>
                </div>
              </div>
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
