import { MessageCircle } from "lucide-react";

const WhatsAppButton = () => {
  return (
    <a
      href="https://wa.me/558005945678"
      target="_blank"
      rel="noopener noreferrer"
      className="fixed right-4 md:right-6 z-50 w-12 h-12 md:w-14 md:h-14 rounded-full bg-[hsl(var(--whatsapp))] text-[hsl(var(--whatsapp-foreground))] flex items-center justify-center shadow-elevated transition-transform hover:scale-105 hover:brightness-95 bottom-[calc(1rem+env(safe-area-inset-bottom))]"
      aria-label="Falar no WhatsApp"
    >
      <MessageCircle className="w-6 h-6 md:w-7 md:h-7" />
    </a>
  );
};

export default WhatsAppButton;
