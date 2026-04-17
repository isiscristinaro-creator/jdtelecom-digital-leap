import { useState, useEffect, useRef } from "react";
import { Search, X, Users, CreditCard, ClipboardList } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import type { DbClient, DbPayment, DbPedido } from "@/hooks/supabase/types";

interface SearchResult {
  id: string;
  type: "client" | "payment" | "pedido";
  title: string;
  subtitle: string;
  route: string;
}

type ClientSearchRow = Pick<DbClient, "id" | "name" | "email" | "status">;
type PaymentSearchRow = Pick<DbPayment, "id" | "description" | "amount" | "status">;
type PedidoSearchRow = Pick<DbPedido, "id" | "cliente_email" | "valor" | "status">;

const typeConfig = {
  client: { icon: Users, label: "Cliente", color: "text-blue-400" },
  payment: { icon: CreditCard, label: "Pagamento", color: "text-emerald-400" },
  pedido: { icon: ClipboardList, label: "Pedido", color: "text-amber-400" },
};

const AdminGlobalSearch = () => {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setOpen(true);
        setTimeout(() => inputRef.current?.focus(), 50);
      }
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, []);

  useEffect(() => {
    if (!open) return;
    const handler = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [open]);

  useEffect(() => {
    if (!query.trim() || query.length < 2) { setResults([]); return; }
    const timer = setTimeout(async () => {
      setLoading(true);
      const q = query.toLowerCase();
      const items: SearchResult[] = [];

      const [clientsRes, paymentsRes, pedidosRes] = await Promise.all([
        supabase.from("clients").select("id, name, email, status").ilike("name", `%${q}%`).limit(5),
        supabase.from("payments").select("id, description, amount, status").or(`description.ilike.%${q}%`).limit(5),
        supabase.from("pedidos").select("id, cliente_email, valor, status").ilike("cliente_email", `%${q}%`).limit(5),
      ]);

      if (clientsRes.data) {
        items.push(...(clientsRes.data as ClientSearchRow[]).map((c) => ({
          id: c.id,
          type: "client" as const,
          title: c.name,
          subtitle: `${c.email} • ${c.status}`,
          route: "/admin/clientes",
        })));
      }
      if (paymentsRes.data) {
        items.push(...(paymentsRes.data as PaymentSearchRow[]).map((p) => ({
          id: p.id,
          type: "payment" as const,
          title: p.description,
          subtitle: `R$ ${p.amount.toFixed(2)} • ${p.status}`,
          route: "/admin/pagamentos",
        })));
      }
      if (pedidosRes.data) {
        items.push(...(pedidosRes.data as PedidoSearchRow[]).map((p) => ({
          id: p.id,
          type: "pedido" as const,
          title: p.cliente_email,
          subtitle: `R$ ${p.valor.toFixed(2)} • ${p.status}`,
          route: "/admin/pedidos",
        })));
      }

      setResults(items);
      setLoading(false);
    }, 300);
    return () => clearTimeout(timer);
  }, [query]);

  const goTo = (r: SearchResult) => {
    navigate(r.route);
    setOpen(false);
    setQuery("");
  };

  if (!open) {
    return (
      <button onClick={() => { setOpen(true); setTimeout(() => inputRef.current?.focus(), 50); }}
        className="flex items-center gap-2 px-3 py-2 rounded-xl bg-[hsl(var(--dark-section-card))] border border-[hsl(var(--dark-section-border))] text-[hsl(var(--dark-section-muted))] hover:text-[hsl(var(--dark-section-fg))] transition-colors text-xs w-full sm:w-64">
        <Search className="w-4 h-4 shrink-0" />
        <span className="flex-1 text-left">Busca global...</span>
        <kbd className="hidden sm:inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded bg-[hsl(var(--dark-section))]/50 text-[10px] font-mono">⌘K</kbd>
      </button>
    );
  }

  return (
    <div className="fixed inset-0 z-[60] bg-black/60 flex items-start justify-center pt-[15vh]" onClick={() => setOpen(false)}>
      <div ref={containerRef} className="w-full max-w-lg mx-4 bg-[hsl(var(--dark-section-card))] border border-[hsl(var(--dark-section-border))] rounded-2xl shadow-2xl overflow-hidden"
        onClick={e => e.stopPropagation()}>
        <div className="flex items-center gap-3 px-4 py-3 border-b border-[hsl(var(--dark-section-border))]">
          <Search className="w-5 h-5 text-[hsl(var(--dark-section-muted))] shrink-0" />
          <input ref={inputRef} value={query} onChange={e => setQuery(e.target.value)} placeholder="Buscar clientes, pagamentos, pedidos..."
            className="flex-1 bg-transparent text-sm text-[hsl(var(--dark-section-fg))] placeholder:text-[hsl(var(--dark-section-muted))] outline-none" autoFocus />
          <button onClick={() => setOpen(false)} className="text-[hsl(var(--dark-section-muted))] hover:text-[hsl(var(--dark-section-fg))]">
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="max-h-80 overflow-y-auto">
          {loading && <p className="px-4 py-6 text-center text-xs text-[hsl(var(--dark-section-muted))]">Buscando...</p>}
          {!loading && query.length >= 2 && results.length === 0 && (
            <p className="px-4 py-6 text-center text-xs text-[hsl(var(--dark-section-muted))]">Nenhum resultado para "{query}"</p>
          )}
          {!loading && results.length > 0 && results.map(r => {
            const cfg = typeConfig[r.type];
            return (
              <button key={`${r.type}-${r.id}`} onClick={() => goTo(r)}
                className="w-full flex items-center gap-3 px-4 py-3 hover:bg-[hsl(var(--dark-section))]/30 transition-colors text-left border-b border-[hsl(var(--dark-section-border))]/30">
                <cfg.icon className={`w-4 h-4 shrink-0 ${cfg.color}`} />
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-[hsl(var(--dark-section-fg))] truncate">{r.title}</p>
                  <p className="text-[11px] text-[hsl(var(--dark-section-muted))] truncate">{r.subtitle}</p>
                </div>
                <span className={`text-[10px] font-semibold ${cfg.color}`}>{cfg.label}</span>
              </button>
            );
          })}
          {!loading && query.length < 2 && (
            <div className="px-4 py-6 text-center text-xs text-[hsl(var(--dark-section-muted))]">
              Digite pelo menos 2 caracteres para buscar
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminGlobalSearch;