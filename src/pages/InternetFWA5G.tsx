import { motion } from "framer-motion";
import { Signal, Zap, Monitor, Smartphone, Wifi, ArrowRight, Home, Router } from "lucide-react";
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

const benefits = [
  { icon: Signal, title: "Grandes velocidades", desc: "Ampla cobertura e baixíssima latência para suas atividades" },
  { icon: Zap, title: "Instalação sem cabos", desc: "Sem quebradeira, sem furos na parede. Conecte e use." },
  { icon: Monitor, title: "Múltiplas conexões", desc: "Rede segura e estável para todos os seus dispositivos" },
];

const useCases = [
  { icon: Home, title: "Home office", desc: "Alta velocidade e conexão constante e segura para trabalho remoto" },
  { icon: Monitor, title: "Streaming", desc: "Assista filmes e séries com ótima resolução e sem interrupções" },
  { icon: Smartphone, title: "Múltiplos dispositivos", desc: "Conecte TVs, smartphones, notebooks e mais!" },
  { icon: Router, title: "Portabilidade", desc: "Leve o roteador para onde quiser, sem precisar de cabos" },
];

const InternetFWA5G = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Hero */}
      <section className="relative pt-40 pb-20 md:pt-48 md:pb-28 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary via-primary/90 to-orange-600" />
        <div className="absolute inset-0 opacity-10">
          <motion.div
            className="absolute top-10 right-10 w-80 h-80 rounded-full bg-white/20 blur-3xl"
            animate={{ scale: [1, 1.2, 1], x: [0, -20, 0] }}
            transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          />
        </div>
        <motion.div
          className="container mx-auto px-4 relative z-10 flex flex-col md:flex-row items-center gap-10"
          initial="hidden"
          animate="visible"
          variants={stagger}
        >
          <div className="flex-1">
            <motion.p variants={fadeUp} custom={0} className="text-white/70 text-sm font-semibold uppercase tracking-widest mb-3">
              Nova tecnologia
            </motion.p>
            <motion.h1 variants={fadeUp} custom={1} className="text-4xl md:text-6xl font-extrabold text-white leading-tight mb-4">
              Internet FWA 5G
            </motion.h1>
            <motion.p variants={fadeUp} custom={2} className="text-lg md:text-xl text-white/80 max-w-lg mb-8">
              Internet residencial livre de cabos. Ultravelocidade e Wi-Fi 6 para toda sua casa.
            </motion.p>
            <motion.div variants={fadeUp} custom={3}>
              <Button
                size="lg"
                className="bg-white text-primary font-bold rounded-full px-8 py-6 text-base hover:bg-white/90 transition-all shadow-xl"
                onClick={() => document.getElementById("fwa-planos")?.scrollIntoView({ behavior: "smooth" })}
              >
                Aproveitar oferta
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </motion.div>
          </div>
          <motion.div
            className="flex-1 flex justify-center"
            initial={{ opacity: 0, scale: 0.8, rotate: -10 }}
            animate={{ opacity: 1, scale: 1, rotate: 0 }}
            transition={{ duration: 0.8, delay: 0.4, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="relative">
              <motion.div
                className="w-48 h-48 md:w-64 md:h-64 rounded-full bg-white/10 flex items-center justify-center"
                animate={{ rotate: 360 }}
                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                style={{ border: "2px dashed rgba(255,255,255,0.15)" }}
              >
                <div className="w-36 h-36 md:w-48 md:h-48 rounded-full bg-white/15 flex items-center justify-center">
                  <Wifi className="w-20 h-20 md:w-28 md:h-28 text-white/80" />
                </div>
              </motion.div>
              <motion.div
                className="absolute -top-2 -right-2 bg-white text-primary font-extrabold rounded-xl px-4 py-2 text-lg shadow-lg"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.8, type: "spring", stiffness: 300 }}
              >
                5G
              </motion.div>
            </div>
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
            Com a internet FWA 5G da JD Telecom você pode tudo
          </motion.h2>
          <motion.p variants={fadeUp} className="text-muted-foreground text-center max-w-2xl mx-auto mb-12">
            Tecnologia de ponta sem necessidade de cabeamento. Conexão rápida e estável.
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

      {/* Elevate section */}
      <motion.section
        className="py-16 md:py-24 bg-muted/30"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
        variants={stagger}
      >
        <div className="container mx-auto px-4">
          <motion.h2 variants={fadeUp} className="text-2xl md:text-3xl font-bold text-foreground text-center mb-4">
            Eleve a sua conexão a outro nível
          </motion.h2>
          <motion.p variants={fadeUp} className="text-muted-foreground text-center max-w-2xl mx-auto mb-12">
            Potencialize as suas tarefas do dia a dia com a Internet FWA 5G da JD Telecom.
          </motion.p>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {useCases.map((uc, i) => (
              <motion.div
                key={i}
                variants={fadeUp}
                custom={i}
                whileHover={{ y: -6, transition: { duration: 0.3 } }}
                className="group p-6 rounded-2xl border border-border bg-card hover:border-primary/40 hover:shadow-lg transition-colors duration-300"
              >
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                  <uc.icon className="w-6 h-6 text-primary" />
                </div>
                <h3 className="font-bold text-foreground mb-1">{uc.title}</h3>
                <p className="text-sm text-muted-foreground">{uc.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* Portable section */}
      <motion.section
        className="py-16 md:py-24 bg-background"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
      >
        <div className="container mx-auto px-4">
          <motion.div
            variants={scaleIn}
            className="max-w-4xl mx-auto bg-gradient-to-br from-primary/10 via-primary/5 to-transparent rounded-3xl p-10 md:p-16 border border-primary/20"
          >
            <div className="flex flex-col md:flex-row items-center gap-10">
              <div className="flex-1">
                <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-4">
                  Internet onde você quiser
                </h2>
                <p className="text-muted-foreground mb-6">
                  Leve o roteador para onde quiser, sem precisar de cabos para instalação. Utilize em outras áreas da sua casa e mantenha o sinal sempre intenso e estável.
                </p>
                <ul className="space-y-3">
                  {[
                    { icon: Wifi, text: "Wi-Fi 6 de última geração" },
                    { icon: Signal, text: "Sinal estável em todos os cômodos" },
                    { icon: Zap, text: "Instalação em minutos" },
                  ].map((item, i) => (
                    <li key={i} className="flex items-start gap-3 text-sm text-foreground">
                      <item.icon className="w-5 h-5 text-primary mt-0.5 shrink-0" />
                      {item.text}
                    </li>
                  ))}
                </ul>
              </div>
              <motion.div
                className="flex-shrink-0"
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              >
                <div className="w-40 h-40 rounded-full bg-primary/10 flex items-center justify-center">
                  <Router className="w-20 h-20 text-primary/60" />
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </motion.section>

      {/* Plans */}
      <motion.section
        id="fwa-planos"
        className="py-16 md:py-24 bg-muted/30"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
        variants={stagger}
      >
        <div className="container mx-auto px-4 text-center">
          <motion.h2 variants={fadeUp} className="text-2xl md:text-3xl font-bold text-foreground mb-4">
            Planos FWA 5G
          </motion.h2>
          <motion.p variants={fadeUp} className="text-muted-foreground max-w-xl mx-auto mb-8">
            Internet sem fio de alta velocidade. Escolha o plano que mais combina com você.
          </motion.p>
          <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            {[
              { speed: "200", price: "89", label: "Mega" },
              { speed: "400", price: "109", label: "Mega", popular: true },
              { speed: "500", price: "129", label: "Mega" },
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
                <div className="flex items-center justify-center gap-1 mb-1">
                  <p className="text-4xl font-extrabold text-primary">{plan.speed}</p>
                  <Signal className="w-5 h-5 text-primary" />
                </div>
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

      <Footer />
      <WhatsAppButton />
    </div>
  );
};

export default InternetFWA5G;
