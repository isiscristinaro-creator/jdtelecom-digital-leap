import { MessageCircle } from "lucide-react";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

const WhatsAppButton = () => {
  const [showTooltip, setShowTooltip] = useState(false);
  const [hasScrolled, setHasScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      if (window.scrollY > 300 && !hasScrolled) setHasScrolled(true);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [hasScrolled]);

  // Show tooltip after 5 seconds
  useEffect(() => {
    const timer = setTimeout(() => setShowTooltip(true), 5000);
    const hideTimer = setTimeout(() => setShowTooltip(false), 10000);
    return () => { clearTimeout(timer); clearTimeout(hideTimer); };
  }, []);

  return (
    <div className="fixed right-3 sm:right-4 md:right-6 z-50 bottom-[calc(0.75rem+env(safe-area-inset-bottom))] sm:bottom-[calc(1rem+env(safe-area-inset-bottom))]">
      <AnimatePresence>
        {showTooltip && (
          <motion.div
            initial={{ opacity: 0, x: 10, scale: 0.9 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: 10, scale: 0.9 }}
            className="absolute right-full mr-3 top-1/2 -translate-y-1/2 bg-[hsl(var(--dark-section-card))] text-[hsl(var(--dark-section-fg))] text-xs font-medium px-3 py-2 rounded-lg shadow-elevated whitespace-nowrap border border-[hsl(var(--dark-section-border))]"
          >
            Precisa de ajuda? 💬
            <div className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1 w-2 h-2 bg-[hsl(var(--dark-section-card))] rotate-45 border-r border-t border-[hsl(var(--dark-section-border))]" />
          </motion.div>
        )}
      </AnimatePresence>

      <motion.a
        href="https://wa.me/558005945678"
        target="_blank"
        rel="noopener noreferrer"
        className="relative w-11 h-11 sm:w-12 sm:h-12 md:w-14 md:h-14 rounded-full bg-[hsl(var(--whatsapp))] text-[hsl(var(--whatsapp-foreground))] flex items-center justify-center shadow-elevated transition-transform hover:scale-105 hover:brightness-95 focus-visible:ring-2 focus-visible:ring-[hsl(var(--whatsapp))] focus-visible:ring-offset-2"
        aria-label="Falar no WhatsApp"
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 1, type: "spring", stiffness: 200 }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        onHoverStart={() => setShowTooltip(false)}
      >
        {/* Pulse ring */}
        <span className="absolute inset-0 rounded-full bg-[hsl(var(--whatsapp))] animate-ping opacity-20" />
        <MessageCircle className="w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7 relative z-10" />
      </motion.a>
    </div>
  );
};

export default WhatsAppButton;
