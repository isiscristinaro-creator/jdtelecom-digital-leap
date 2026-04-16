import { useRef, useEffect } from "react";
import { Tv, Music, Film, Smartphone, Wifi, ArrowRight, Sparkles, Package } from "lucide-react";
import { Button } from "@/components/ui/button";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import WhatsAppButton from "@/components/WhatsAppButton";

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
          el.style.transition = "opacity 0.7s ease, transform 0.7s ease";
          el.style.opacity = "1";
          el.style.transform = "translateY(0)";
          obs.disconnect();
        }
      },
      { threshold: 0.05 }
    );
    obs.observe(el);
    const safety = setTimeout(() => { el.style.opacity = "1"; el.style.transform = "translateY(0)"; obs.disconnect(); }, 2000);
    return () => { obs.disconnect(); clearTimeout(safety); };
  }, []);
  return ref;
};

const entertainmentServices = [
  {
    icon: Music,
    name: "JD Music",
    desc: "Conecta você às melhores músicas com streaming ilimitado.",
    color: "from-purple-500/20 to-purple-600/10",
  },
  {
    icon: Film,
    name: "JD Play",
    desc: "Filmes, séries e canais ao vivo em um único lugar.",
    color: "from-red-500/20 to-red-600/10",
  },
  {
    icon: Tv,
    name: "JD TV",
    desc: "Canais ao vivo e conteúdo on-demand para toda a família.",
    color: "from-blue-500/20 to-blue-600/10",
  },
  {
    icon: Smartphone,
    name: "JD Móvel",
    desc: "Internet móvel 5G com WhatsApp ilimitado incluso.",
    color: "from-green-500/20 to-green-600/10",
  },
];

const comboPlans = [
  {
    name: "Combo Start",
    speed: "400 Mega",
    includes: ["Internet Fibra 400 Mega", "JD Music", "WhatsApp ilimitado"],
    price: "109",
    cents: "90",
  },
  {
    name: "Combo Plus",
    speed: "600 Mega",
    includes: ["Internet Fibra 600 Mega", "JD Music + JD Play", "Telefone fixo ilimitado"],
    price: "139",
    cents: "90",
    popular: true,
  },
  {
    name: "Combo Premium",
    speed: "1 Giga",
    includes: ["Internet Fibra 1 Giga", "JD Music + JD Play + JD TV", "Telefone fixo + Móvel 5G"],
    price: "189",
    cents: "90",
  },
];

const Combos = () => {
  const heroRef = useFadeUp();
  const servicesRef = useFadeUp();
  const plansRef = useFadeUp();
  const ctaRef = useFadeUp();

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Hero */}
      <section className="relative pt-40 pb-20 md:pt-48 md:pb-28 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary via-orange-500 to-primary/80" />
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 right-20 w-80 h-80 rounded-full bg-white/20 blur-3xl" />
          <div className="absolute bottom-10 left-10 w-64 h-64 rounded-full bg-white/15 blur-3xl" />
        </div>
        <div ref={heroRef} className="container mx-auto px-4 relative z-10">
          <p className="text-white/70 text-sm font-semibold uppercase tracking-widest mb-3">Ofertas Especiais</p>
          <h1 className="text-4xl md:text-6xl font-extrabold text-white leading-tight mb-4">
            Combos de Internet,<br />Telefonia e mais
          </h1>
          <p className="text-lg md:text-xl text-white/80 max-w-lg mb-8">
            Não perca a oportunidade de aproveitar nossas ofertas de combo com os melhores serviços.
          </p>
          <Button
            size="lg"
            className="bg-white text-primary font-bold rounded-full px-8 py-6 text-base hover:bg-white/90 transition-all shadow-xl"
            onClick={() => {
              const el = document.getElementById("combo-planos");
              el?.scrollIntoView({ behavior: "smooth" });
            }}
          >
            Ver Combos
            <ArrowRight className="w-5 h-5 ml-2" />
          </Button>
        </div>
      </section>

      {/* Entertainment Services */}
      <section ref={servicesRef} className="py-16 md:py-24 bg-background">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl md:text-3xl font-bold text-foreground text-center mb-4">
            Serviços de entretenimento inclusos
          </h2>
          <p className="text-muted-foreground text-center max-w-2xl mx-auto mb-12">
            Na JD Telecom você encontra os melhores serviços de entretenimento para combinar com sua internet.
          </p>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {entertainmentServices.map((svc, i) => (
              <div key={i} className="group relative overflow-hidden rounded-2xl border border-border bg-card hover:border-primary/40 hover:shadow-lg transition-all duration-300">
                <div className={`absolute inset-0 bg-gradient-to-br ${svc.color} opacity-0 group-hover:opacity-100 transition-opacity`} />
                <div className="relative p-6">
                  <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                    <svc.icon className="w-7 h-7 text-primary" />
                  </div>
                  <h3 className="font-bold text-foreground text-lg mb-2">{svc.name}</h3>
                  <p className="text-sm text-muted-foreground mb-4">{svc.desc}</p>
                  <span className="text-primary text-sm font-semibold flex items-center gap-1 group-hover:gap-2 transition-all">
                    Saiba mais <ArrowRight className="w-4 h-4" />
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Combo Plans */}
      <section id="combo-planos" ref={plansRef} className="py-16 md:py-24 bg-muted/30">
        <div className="container mx-auto px-4 text-center">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Package className="w-6 h-6 text-primary" />
            <h2 className="text-2xl md:text-3xl font-bold text-foreground">
              Nossos Combos
            </h2>
          </div>
          <p className="text-muted-foreground max-w-xl mx-auto mb-10">
            Combine internet, telefonia e entretenimento em um único pacote com preço especial.
          </p>
          <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {comboPlans.map((plan, i) => (
              <div key={i} className={`relative rounded-2xl p-8 border text-left transition-all duration-300 ${plan.popular ? "border-primary bg-primary/5 shadow-xl scale-105" : "border-border bg-card hover:border-primary/40"}`}>
                {plan.popular && (
                  <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-primary text-primary-foreground text-xs font-bold px-4 py-1 rounded-full flex items-center gap-1">
                    <Sparkles className="w-3 h-3" /> Mais Popular
                  </span>
                )}
                <h3 className="text-xl font-bold text-foreground mb-1">{plan.name}</h3>
                <p className="text-primary font-bold text-lg mb-4">{plan.speed}</p>
                <ul className="space-y-2 mb-6">
                  {plan.includes.map((item, j) => (
                    <li key={j} className="flex items-start gap-2 text-sm text-muted-foreground">
                      <Wifi className="w-4 h-4 text-primary mt-0.5 shrink-0" />
                      {item}
                    </li>
                  ))}
                </ul>
                <div className="mb-6">
                  <p className="text-3xl font-bold text-foreground">
                    R$ <span className="text-4xl">{plan.price}</span><span className="text-lg">,{plan.cents}</span>
                  </p>
                  <p className="text-xs text-muted-foreground">/mês</p>
                </div>
                <Button className="w-full rounded-full bg-primary text-primary-foreground font-bold" asChild>
                  <a href="https://wa.me/558005945678" target="_blank" rel="noopener noreferrer">
                    Assine já
                  </a>
                </Button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section ref={ctaRef} className="py-16 md:py-24 bg-background">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center bg-gradient-to-br from-primary/10 to-primary/5 rounded-3xl p-10 md:p-16 border border-primary/20">
            <Sparkles className="w-10 h-10 text-primary mx-auto mb-4" />
            <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-4">
              Monte seu combo personalizado
            </h2>
            <p className="text-muted-foreground mb-8 max-w-lg mx-auto">
              Fale com nossos consultores pelo WhatsApp e monte o combo ideal para você e sua família.
            </p>
            <Button size="lg" className="rounded-full bg-primary text-primary-foreground font-bold px-8 py-6" asChild>
              <a href="https://wa.me/558005945678" target="_blank" rel="noopener noreferrer">
                Falar com consultor
                <ArrowRight className="w-5 h-5 ml-2" />
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
