import { AlertTriangle, Inbox, RefreshCw, type LucideIcon } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ErrorCardProps {
  title?: string;
  description?: string;
  onRetry?: () => void;
  retryLabel?: string;
}

/**
 * Card padrão de erro para listagens administrativas.
 * Usar quando a query do React Query falha (error !== null).
 */
export const AdminErrorCard = ({
  title = "Não foi possível carregar os dados",
  description = "Tivemos um problema ao buscar as informações. Tente novamente em instantes.",
  onRetry,
  retryLabel = "Tentar novamente",
}: ErrorCardProps) => (
  <div
    role="alert"
    className="max-w-md mx-auto text-center bg-[hsl(var(--dark-section-card))] border border-destructive/30 rounded-3xl p-8 md:p-10 my-12"
  >
    <div className="w-14 h-14 rounded-2xl bg-destructive/10 border border-destructive/20 flex items-center justify-center mx-auto mb-5">
      <AlertTriangle className="w-7 h-7 text-destructive" aria-hidden="true" />
    </div>
    <h2 className="font-display text-xl md:text-2xl font-bold text-[hsl(var(--dark-section-fg))] mb-2">
      {title}
    </h2>
    <p className="text-sm text-[hsl(var(--dark-section-muted))] mb-6">{description}</p>
    {onRetry && (
      <Button
        onClick={onRetry}
        className="bg-primary text-primary-foreground hover:bg-primary/90 font-bold rounded-2xl px-6"
      >
        <RefreshCw className="w-4 h-4 mr-2" />
        {retryLabel}
      </Button>
    )}
  </div>
);

interface EmptyCardProps {
  title?: string;
  description?: string;
  icon?: LucideIcon;
  action?: React.ReactNode;
}

/**
 * Card padrão de estado vazio para listagens administrativas.
 * Usar quando a query retorna sucesso porém sem registros.
 */
export const AdminEmptyCard = ({
  title = "Nenhum registro encontrado",
  description = "Ainda não há dados cadastrados para exibir.",
  icon: Icon = Inbox,
  action,
}: EmptyCardProps) => (
  <div className="max-w-md mx-auto text-center bg-[hsl(var(--dark-section-card))] border border-[hsl(var(--dark-section-border))] rounded-3xl p-8 md:p-10 my-12">
    <div className="w-14 h-14 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center mx-auto mb-5">
      <Icon className="w-7 h-7 text-primary" aria-hidden="true" />
    </div>
    <h2 className="font-display text-xl md:text-2xl font-bold text-[hsl(var(--dark-section-fg))] mb-2">
      {title}
    </h2>
    <p className="text-sm text-[hsl(var(--dark-section-muted))] mb-4">{description}</p>
    {action}
  </div>
);
