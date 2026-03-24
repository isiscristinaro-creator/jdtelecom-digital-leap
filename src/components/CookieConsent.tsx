import { useState, useEffect } from "react";
import { X, Cookie } from "lucide-react";
import { Button } from "@/components/ui/button";

const COOKIE_KEY = "jd-cookie-consent";

const CookieConsent = () => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem(COOKIE_KEY);
    if (!consent) {
      const timer = setTimeout(() => setVisible(true), 1500);
      return () => clearTimeout(timer);
    }
  }, []);

  const accept = () => {
    localStorage.setItem(COOKIE_KEY, "accepted");
    setVisible(false);
  };

  const decline = () => {
    localStorage.setItem(COOKIE_KEY, "declined");
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-[60] p-4 md:p-6 animate-fade-in">
      <div className="max-w-4xl mx-auto bg-[hsl(var(--dark-section))] border border-[hsl(var(--dark-section-border))] rounded-2xl p-5 md:p-6 shadow-2xl">
        <div className="flex items-start gap-4">
          <div className="w-10 h-10 rounded-xl bg-primary/15 flex items-center justify-center shrink-0 mt-0.5">
            <Cookie className="w-5 h-5 text-primary" />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="font-display font-semibold text-[hsl(var(--dark-section-fg))] text-sm mb-1">
              Utilizamos cookies
            </h3>
            <p className="text-xs text-[hsl(var(--dark-section-muted))] leading-relaxed mb-4">
              Nós utilizamos cookies e tecnologias semelhantes para melhorar sua experiência de navegação, 
              personalizar conteúdo e analisar o tráfego do site. Ao continuar navegando, você concorda com 
              nossa política de privacidade e uso de cookies.
            </p>
            <div className="flex flex-wrap gap-3">
              <Button
                onClick={accept}
                className="bg-primary text-primary-foreground hover:bg-primary/90 text-xs font-bold px-6 py-2 rounded-lg"
              >
                Aceitar todos
              </Button>
              <Button
                onClick={decline}
                variant="outline"
                className="border-[hsl(var(--dark-section-border))] text-[hsl(var(--dark-section-fg))] hover:bg-[hsl(var(--dark-section-card))] text-xs px-6 py-2 rounded-lg"
              >
                Apenas necessários
              </Button>
            </div>
          </div>
          <button
            onClick={decline}
            className="text-[hsl(var(--dark-section-muted))] hover:text-[hsl(var(--dark-section-fg))] transition-colors shrink-0"
            aria-label="Fechar"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default CookieConsent;
