import { useRef, useEffect } from "react";
import { Wifi, Headphones, Monitor, ArrowRight, FileText, Phone, MapPin, MessageCircle } from "lucide-react";
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

const benefits = [
  { icon: Wifi, title: "Internet fibra óptica", desc: "Ultra velocidade garantida para toda a sua casa" },
  { icon: Monitor, title: "Aplicativos inclusos", desc: "Acesso a apps parceiros sem custos adicionais" },
  { icon: Headphones, title: "Atendimento 24h", desc: "Suporte por telefone e WhatsApp a qualquer hora" },
];

const selfServiceItems = [
  { title: "2ª via da fatura", desc: "Baixe sua fatura pelo portal do assinante", icon: FileText, href: "/assinante" },
  { title: "Ligamos para você", desc: "Informe seus dados que entraremos em contato", icon: Phone, href: "#contato" },
  { title: "Cobertura", desc: "Verifique se há cobertura JD Telecom na sua cidade", icon: MapPin, href: "#cobertura" },
  { title: "Suporte via WhatsApp", desc: "Atendimento rápido e fácil pelo WhatsApp", icon: MessageCircle, href: "https://wa.me/558005945678" },
];

const InternetFibra = () => {
  const heroRef = useFadeUp();
  const benefitsRef = useFadeUp();
  const selfServiceRef = useFadeUp();
  const ctaRef = useFadeUp();

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Hero */}
      <section className="relative pt-40 pb-20 md:pt-48 md:pb-28 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/90 via-primary to-primary/80" />
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 left-10 w-72 h-72 rounded-full bg-white/20 blur-3xl" />
          <div className="absolute bottom-10 right-20 w-96 h-96 rounded-full bg-white/10 blur-3xl" />
        </div>
        <div ref={heroRef} className="container mx-auto px-4 relative z-10">
          <p className="text-white/70 text-sm font-semibold uppercase tracking-widest mb-3">Ofertas de Internet</p>
          <h1 className="text-4xl md:text-6xl font-extrabold text-white leading-tight mb-4">
            Internet Fibra Óptica
          </h1>
          <p className="text-lg md:text-xl text-white/80 max-w-lg mb-8">
            Mais conexão. Mais satisfação. A melhor experiência de internet para sua casa e empresa.
          </p>
          <Button
            size="lg"
            className="bg-white text-primary font-bold rounded-full px-8 py-6 text-base hover:bg-white/90 transition-all shadow-xl"
            onClick={() => {
              const el = document.getElementById("fibra-planos");
              el?.scrollIntoView({ behavior: "smooth" });
            }}
          >
            Conheça Agora
            <ArrowRight className="w-5 h-5 ml-2" />
          </Button>
        </div>
      </section>

      {/* Benefits */}
      <section ref={benefitsRef} className="py-16 md:py-24 bg-background">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl md:text-3xl font-bold text-foreground text-center mb-4">
            Com a internet fibra óptica JD Telecom você pode tudo
          </h2>
          <p className="text-muted-foreground text-center max-w-2xl mx-auto mb-12">
            Navegue, trabalhe, estude e se divirta com a melhor conexão de fibra óptica da região.
          </p>
          <div className="grid md:grid-cols-3 gap-8">
            {benefits.map((b, i) => (
              <div key={i} className="group text-center p-8 rounded-2xl border border-border bg-card hover:border-primary/40 hover:shadow-lg transition-all duration-300">
                <div className="w-16 h-16 rounded-xl bg-primary/10 flex items-center justify-center mx-auto mb-5 group-hover:bg-primary/20 transition-colors">
                  <b.icon className="w-8 h-8 text-primary" />
                </div>
                <h3 className="text-lg font-bold text-foreground mb-2">{b.title}</h3>
                <p className="text-muted-foreground text-sm">{b.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Plans CTA */}
      <section id="fibra-planos" ref={ctaRef} className="py-16 md:py-24 bg-muted/30">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-4">
            Escolha o plano ideal para você
          </h2>
          <p className="text-muted-foreground max-w-xl mx-auto mb-8">
            Planos de internet fibra óptica com velocidades de até 1 Gbps. Instalação rápida e sem burocracia.
          </p>
          <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            {[
              { speed: "400", price: "99", label: "Mega" },
              { speed: "600", price: "119", label: "Mega", popular: true },
              { speed: "1000", price: "149", label: "Mega" },
            ].map((plan, i) => (
              <div key={i} className={`relative rounded-2xl p-8 border transition-all duration-300 ${plan.popular ? "border-primary bg-primary/5 shadow-xl scale-105" : "border-border bg-card hover:border-primary/40"}`}>
                {plan.popular && (
                  <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-primary text-primary-foreground text-xs font-bold px-4 py-1 rounded-full">
                    Mais Popular
                  </span>
                )}
                <p className="text-4xl font-extrabold text-primary mb-1">{plan.speed}</p>
                <p className="text-sm text-muted-foreground mb-4">{plan.label}</p>
                <p className="text-3xl font-bold text-foreground mb-1">
                  R$ <span className="text-4xl">{plan.price}</span><span className="text-lg">,90</span>
                </p>
                <p className="text-xs text-muted-foreground mb-6">/mês</p>
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

      {/* Self-service */}
      <section ref={selfServiceRef} className="py-16 md:py-24 bg-background">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl md:text-3xl font-bold text-foreground text-center mb-12">
            Autoatendimento para clientes
          </h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {selfServiceItems.map((item, i) => (
              <a
                key={i}
                href={item.href}
                target={item.href.startsWith("http") ? "_blank" : undefined}
                rel={item.href.startsWith("http") ? "noopener noreferrer" : undefined}
                className="group flex flex-col p-6 rounded-2xl border border-border bg-card hover:border-primary/40 hover:shadow-lg transition-all duration-300"
              >
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                  <item.icon className="w-6 h-6 text-primary" />
                </div>
                <h3 className="font-bold text-foreground mb-1">{item.title}</h3>
                <p className="text-sm text-muted-foreground mb-4 flex-1">{item.desc}</p>
                <span className="text-primary text-sm font-semibold flex items-center gap-1 group-hover:gap-2 transition-all">
                  Acessar <ArrowRight className="w-4 h-4" />
                </span>
              </a>
            ))}
          </div>
        </div>
      </section>

      <Footer />
      <WhatsAppButton />
    </div>
  );
};

export default InternetFibra;
