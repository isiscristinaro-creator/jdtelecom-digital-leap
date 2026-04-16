import { motion } from "framer-motion";
import { Wifi, Headphones, Monitor, ArrowRight, FileText, Phone, MapPin, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import WhatsAppButton from "@/components/WhatsAppButton";

const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  visible: (i: number = 0) => ({
    opacity: 1, y: 0,
    transition: { duration: 0.7, delay: i * 0.15, ease: [0.22, 1, 0.36, 1] as const }
  }),
};

const stagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.12 } },
};

const scaleIn = {
  hidden: { opacity: 0, scale: 0.9 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.5 } },
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
  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Hero */}
      <section className="relative pt-40 pb-20 md:pt-48 md:pb-28 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/90 via-primary to-primary/80" />
        <div className="absolute inset-0 opacity-10">
          <motion.div
            className="absolute top-20 left-10 w-72 h-72 rounded-full bg-white/20 blur-3xl"
            animate={{ scale: [1, 1.2, 1], x: [0, 20, 0] }}
            transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          />
          <motion.div
            className="absolute bottom-10 right-20 w-96 h-96 rounded-full bg-white/10 blur-3xl"
            animate={{ scale: [1, 1.15, 1], y: [0, -20, 0] }}
            transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
          />
        </div>
        <motion.div
          className="container mx-auto px-4 relative z-10"
          initial="hidden"
          animate="visible"
          variants={stagger}
        >
          <motion.p variants={fadeUp} custom={0} className="text-white/70 text-sm font-semibold uppercase tracking-widest mb-3">
            Ofertas de Internet
          </motion.p>
          <motion.h1 variants={fadeUp} custom={1} className="text-4xl md:text-6xl font-extrabold text-white leading-tight mb-4">
            Internet Fibra Óptica
          </motion.h1>
          <motion.p variants={fadeUp} custom={2} className="text-lg md:text-xl text-white/80 max-w-lg mb-8">
            Mais conexão. Mais satisfação. A melhor experiência de internet para sua casa e empresa.
          </motion.p>
          <motion.div variants={fadeUp} custom={3}>
            <Button
              size="lg"
              className="bg-white text-primary font-bold rounded-full px-8 py-6 text-base hover:bg-white/90 transition-all shadow-xl"
              onClick={() => document.getElementById("fibra-planos")?.scrollIntoView({ behavior: "smooth" })}
            >
              Conheça Agora
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
          </motion.div>
        </motion.div>
      </section>

      {/* Benefits */}
      <motion.section
        className="py-16 md:py-24 bg-background"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
        variants={stagger}
      >
        <div className="container mx-auto px-4">
          <motion.h2 variants={fadeUp} className="text-2xl md:text-3xl font-bold text-foreground text-center mb-4">
            Com a internet fibra óptica JD Telecom você pode tudo
          </motion.h2>
          <motion.p variants={fadeUp} className="text-muted-foreground text-center max-w-2xl mx-auto mb-12">
            Navegue, trabalhe, estude e se divirta com a melhor conexão de fibra óptica da região.
          </motion.p>
          <div className="grid md:grid-cols-3 gap-8">
            {benefits.map((b, i) => (
              <motion.div
                key={i}
                variants={scaleIn}
                whileHover={{ y: -8, transition: { duration: 0.3 } }}
                className="group text-center p-8 rounded-2xl border border-border bg-card hover:border-primary/40 hover:shadow-lg transition-colors duration-300"
              >
                <div className="w-16 h-16 rounded-xl bg-primary/10 flex items-center justify-center mx-auto mb-5 group-hover:bg-primary/20 transition-colors">
                  <b.icon className="w-8 h-8 text-primary" />
                </div>
                <h3 className="text-lg font-bold text-foreground mb-2">{b.title}</h3>
                <p className="text-muted-foreground text-sm">{b.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* Plans CTA */}
      <motion.section
        id="fibra-planos"
        className="py-16 md:py-24 bg-muted/30"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
        variants={stagger}
      >
        <div className="container mx-auto px-4 text-center">
          <motion.h2 variants={fadeUp} className="text-2xl md:text-3xl font-bold text-foreground mb-4">
            Escolha o plano ideal para você
          </motion.h2>
          <motion.p variants={fadeUp} className="text-muted-foreground max-w-xl mx-auto mb-8">
            Planos de internet fibra óptica com velocidades de até 1 Gbps. Instalação rápida e sem burocracia.
          </motion.p>
          <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            {[
              { speed: "400", price: "99", label: "Mega" },
              { speed: "600", price: "119", label: "Mega", popular: true },
              { speed: "1000", price: "149", label: "Mega" },
            ].map((plan, i) => (
              <motion.div
                key={i}
                variants={scaleIn}
                whileHover={{ y: -6, transition: { duration: 0.3 } }}
                className={`relative rounded-2xl p-8 border transition-colors duration-300 ${plan.popular ? "border-primary bg-primary/5 shadow-xl scale-105" : "border-border bg-card hover:border-primary/40"}`}
              >
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
                  <a href="https://wa.me/558005945678" target="_blank" rel="noopener noreferrer">Assine já</a>
                </Button>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* Self-service */}
      <motion.section
        className="py-16 md:py-24 bg-background"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
        variants={stagger}
      >
        <div className="container mx-auto px-4">
          <motion.h2 variants={fadeUp} className="text-2xl md:text-3xl font-bold text-foreground text-center mb-12">
            Autoatendimento para clientes
          </motion.h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {selfServiceItems.map((item, i) => (
              <motion.a
                key={i}
                href={item.href}
                target={item.href.startsWith("http") ? "_blank" : undefined}
                rel={item.href.startsWith("http") ? "noopener noreferrer" : undefined}
                variants={fadeUp}
                custom={i}
                whileHover={{ y: -6, transition: { duration: 0.3 } }}
                className="group flex flex-col p-6 rounded-2xl border border-border bg-card hover:border-primary/40 hover:shadow-lg transition-colors duration-300"
              >
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                  <item.icon className="w-6 h-6 text-primary" />
                </div>
                <h3 className="font-bold text-foreground mb-1">{item.title}</h3>
                <p className="text-sm text-muted-foreground mb-4 flex-1">{item.desc}</p>
                <span className="text-primary text-sm font-semibold flex items-center gap-1 group-hover:gap-2 transition-all">
                  Acessar <ArrowRight className="w-4 h-4" />
                </span>
              </motion.a>
            ))}
          </div>
        </div>
      </motion.section>

      <Footer />
      <WhatsAppButton />
    </div>
  );
};

export default InternetFibra;
