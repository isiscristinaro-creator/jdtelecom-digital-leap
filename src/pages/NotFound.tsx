import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import { Home, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
  }, [location.pathname]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-[hsl(var(--dark-section))] px-4">
      <div className="text-center max-w-md">
        <p className="text-8xl font-extrabold font-display text-primary mb-4">404</p>
        <h1 className="text-2xl font-bold text-[hsl(var(--dark-section-fg))] mb-2">
          Página não encontrada
        </h1>
        <p className="text-sm text-[hsl(var(--dark-section-muted))] mb-8">
          A página que você está procurando não existe ou foi movida.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Button asChild className="bg-primary text-primary-foreground hover:bg-primary/90 rounded-xl font-bold">
            <a href="/">
              <Home className="w-4 h-4 mr-2" />
              Voltar ao Início
            </a>
          </Button>
          <Button
            variant="outline"
            className="border-[hsl(var(--dark-section-border))] text-[hsl(var(--dark-section-fg))] hover:bg-[hsl(var(--dark-section-card))] rounded-xl font-bold"
            onClick={() => window.history.back()}
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Voltar
          </Button>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
