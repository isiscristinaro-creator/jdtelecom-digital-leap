import { useCallback, useEffect, useState } from "react";

export function useScrollAnimation(threshold = 0.15) {
  const [node, setNode] = useState<HTMLElement | null>(null);
  const [isVisible, setIsVisible] = useState(false);

  const ref = useCallback((el: HTMLElement | null) => {
    setNode(el);
  }, []);

  useEffect(() => {
    const el = node;
    if (!el || isVisible) return;

    // Respeita prefers-reduced-motion: usuários com essa preferência veem
    // o conteúdo imediatamente, sem animações condicionais à viewport.
    const prefersReducedMotion =
      typeof window !== "undefined" &&
      window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
    if (prefersReducedMotion) {
      setIsVisible(true);
      return;
    }

    // Verificação imediata: se o elemento já está na viewport (ex: deep-link
    // direto para #planos, ou seção acima da dobra), marca como visível.
    const rect = el.getBoundingClientRect();
    const viewportH = window.innerHeight || document.documentElement.clientHeight;
    const isInViewport = rect.top < viewportH && rect.bottom > 0;
    if (isInViewport) {
      setIsVisible(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.unobserve(el);
        }
      },
      { threshold }
    );
    observer.observe(el);

    // Fallback de segurança: garante que o conteúdo aparece mesmo se o
    // observer não disparar (ex: conteúdo carregado assincronamente).
    const fallback = window.setTimeout(() => setIsVisible(true), 800);

    return () => {
      observer.disconnect();
      window.clearTimeout(fallback);
    };
  }, [node, threshold, isVisible]);

  return { ref, isVisible };
}
