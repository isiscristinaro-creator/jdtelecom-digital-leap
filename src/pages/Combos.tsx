import { motion } from "framer-motion";
import { Tv, Music, Film, Smartphone, Wifi, ArrowRight, Sparkles, Package } from "lucide-react";
import { Button } from "@/components/ui/button";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import WhatsAppButton from "@/components/WhatsAppButton";

const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  visible: (i: number = 0) => ({
    opacity: 1, y: 0,
    transition: { duration: 0.7, delay: i * 0.15, ease: [0.22, 1, 0.36, 1] }
  }),
};

const stagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.12 } },
};

const scaleIn = {
  hidden: { opacity: 0, scale: 0.9 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.5, ease: "easeOut" } },
};

const entertainmentServices = [
  { icon: Music, name: "JD Music", desc: "Conecta você às melhores músicas com streaming ilimitado." },
  { icon: Film, name: "JD Play", desc: "Filmes, séries e canais ao vivo em um único lugar." },
  { icon: Tv, name: "JD TV", desc: "Canais ao vivo e conteúdo on-demand para toda a família." },
  { icon: Smartphone, name: "JD Móvel", desc: "Internet móvel 5G com WhatsApp ilimitado incluso." },
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
  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Hero */}
      <section className="relative pt-40 pb-20 md:pt-48 md:pb-28 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary via-orange-500 to-primary/80" />
        <div className="absolute inset-0 opacity-10">
          <motion.div
            className="absolute top-20 right-20 w-80 h-80 rounded-full bg-white/20 blur-3xl"
            animate={{ scale: [1, 1.15, 1] }}
            transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          />
          <motion.div
            className="absolute bottom-10 left-10 w-64 h-64 rounded-full bg-white/15 blur-3xl"
            animate={{ scale: [1, 1.2, 1], y: [0, -15, 0] }}
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
            Ofertas Especiais
          </motion.p>
          <motion.h1 variants={fadeUp} custom={1} className="text-4xl md:text-6xl font-extrabold text-white leading-tight mb-4">
            Combos de Internet,<br />Telefonia e mais
          </motion.h1>
          <motion.p variants={fadeUp} custom={2} className="text-lg md:text-xl text-white/80 max-w-lg mb-8">
            Não perca a oportunidade de aproveitar nossas ofertas de combo com os melhores serviços.
          </motion.p>
          <motion.div variants={fadeUp} custom={3}>
            <Button
              size="lg"
              className="bg-white text-primary font-bold rounded-full px-8 py-6 text-base hover:bg-white/90 transition-all shadow-xl"
              onClick={() => document.getElementById("combo-planos")?.scrollIntoView({ behavior: "smooth" })}
            >
              Ver Combos
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
          </motion.div>
        </motion.div>
      </section>

      {/* Entertainment Services */}
      <motion.section
        className="py-16 md:py-24 bg-background"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
        variants={stagger}
      >
        <div className="container mx-auto px-4">
          <motion.h2 variants={fadeUp} className="text-2xl md:text-3xl font-bold text-foreground text-center mb-4">
            Serviços de entretenimento inclusos
          </motion.h2>
          <motion.p variants={fadeUp} className="text-muted-foreground text-center max-w-2xl mx-auto mb-12">
            Na JD Telecom você encontra os melhores serviços de entretenimento para combinar com sua internet.
          </motion.p>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {entertainmentServices.map((svc, i) => (
              <motion.div
                key={i}
                variants={fadeUp}
                custom={i}
                whileHover={{ y: -8, transition: { duration: 0.3 } }}
                className="group relative overflow-hidden rounded-2xl border border-border bg-card hover:border-primary/40 hover:shadow-lg transition-colors duration-300"
              >
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
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* Combo Plans */}
      <motion.section
        id="combo-planos"
        className="py-16 md:py-24 bg-muted/30"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
        variants={stagger}
      >
        <div className="container mx-auto px-4 text-center">
          <motion.div variants={fadeUp} className="flex items-center justify-center gap-2 mb-4">
            <Package className="w-6 h-6 text-primary" />
            <h2 className="text-2xl md:text-3xl font-bold text-foreground">Nossos Combos</h2>
          </motion.div>
          <motion.p variants={fadeUp} className="text-muted-foreground max-w-xl mx-auto mb-10">
            Combine internet, telefonia e entretenimento em um único pacote com preço especial.
          </motion.p>
          <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {comboPlans.map((plan, i) => (
              <motion.div
                key={i}
                variants={scaleIn}
                whileHover={{ y: -6, transition: { duration: 0.3 } }}
                className={`relative rounded-2xl p-8 border text-left transition-colors duration-300 ${plan.popular ? "border-primary bg-primary/5 shadow-xl scale-105" : "border-border bg-card hover:border-primary/40"}`}
              >
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
                  <a href="https://wa.me/558005945678" target="_blank" rel="noopener noreferrer">Assine já</a>
                </Button>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* CTA */}
      <motion.section
        className="py-16 md:py-24 bg-background"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.3 }}
      >
        <div className="container mx-auto px-4">
          <motion.div
            variants={scaleIn}
            className="max-w-3xl mx-auto text-center bg-gradient-to-br from-primary/10 to-primary/5 rounded-3xl p-10 md:p-16 border border-primary/20"
          >
            <motion.div
              animate={{ rotate: [0, 10, -10, 0] }}
              transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
            >
              <Sparkles className="w-10 h-10 text-primary mx-auto mb-4" />
            </motion.div>
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
          </motion.div>
        </div>
      </motion.section>

      <Footer />
      <WhatsAppButton />
    </div>
  );
};

export default Combos;
