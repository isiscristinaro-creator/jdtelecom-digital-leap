import { Smartphone, UserPlus, ClipboardList, CreditCard } from "lucide-react";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import personaPhone from "@/assets/persona-female-phone.png";

const steps = [
  { icon: Smartphone, num: "1", title: "Baixe nosso app", desc: "Disponível para Android e iOS" },
  { icon: UserPlus, num: "2", title: 'Clique em "Se cadastrar"', desc: "Ao abrir o app, faça seu cadastro" },
  { icon: ClipboardList, num: "3", title: "Preencha os campos", desc: "Preencha os campos solicitados e prossiga" },
  { icon: CreditCard, num: "4", title: "Escolha seu plano", desc: "Escolha seu plano e pague a fatura gerada" },
];

const ChipInstructionsSection = () => {
  const { ref, isVisible } = useScrollAnimation();

  return (
    <section className="py-20 md:py-28 bg-gradient-to-br from-primary to-[hsl(15,85%,42%)] relative overflow-hidden">
      {/* Background pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0" style={{
          backgroundImage: "radial-gradient(circle at 20% 50%, rgba(255,255,255,0.3) 0%, transparent 50%)"
        }} />
      </div>

      <div className="container mx-auto px-4 relative z-10" ref={ref}>
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left - content */}
          <div>
            <div
              className={`transition-all duration-700 ${isVisible ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-12"}`}
            >
              <span className="inline-block bg-primary-foreground/20 backdrop-blur-sm text-primary-foreground text-xs font-bold px-4 py-1.5 rounded-full mb-4">
                REDE MÓVEL 4G • 5G
              </span>
              <h2 className="font-display text-3xl md:text-4xl lg:text-5xl font-bold text-primary-foreground mb-4">
                Ative seu chip seguindo nossas instruções
              </h2>
              <p className="text-primary-foreground/80 text-lg mb-2">
                Com a <strong>JD MÓVEL</strong> você não tem fronteiras!
              </p>
            </div>

            <div className="grid sm:grid-cols-2 gap-4 mt-8">
              {steps.map((step, i) => (
                <div
                  key={step.num}
                  className={`flex gap-4 p-5 rounded-xl bg-primary-foreground/10 backdrop-blur-sm border border-primary-foreground/20 transition-all duration-500 hover:bg-primary-foreground/20 ${
                    isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
                  }`}
                  style={{ transitionDelay: isVisible ? `${i * 100 + 200}ms` : "0ms" }}
                >
                  <div className="w-10 h-10 rounded-full bg-primary-foreground text-primary flex items-center justify-center font-bold text-lg shrink-0">
                    {step.num}
                  </div>
                  <div>
                    <h3 className="font-display font-semibold text-primary-foreground text-sm">{step.title}</h3>
                    <p className="text-primary-foreground/70 text-xs mt-1">{step.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right - persona */}
          <div
            className={`hidden lg:flex justify-center transition-all duration-700 delay-300 ${
              isVisible ? "opacity-100 translate-x-0 scale-100" : "opacity-0 translate-x-12 scale-95"
            }`}
          >
            <img
              src={personaPhone}
              alt="Mascote JD Telecom com celular"
              className="h-[500px] object-contain drop-shadow-2xl"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default ChipInstructionsSection;
