import { useState } from "react";
import { Loader2, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { usePedidos } from "@/hooks/useSupabaseData";

const statusColors: Record<string, string> = {
  pendente: "bg-amber-500/10 text-amber-400",
  pago: "bg-emerald-500/10 text-emerald-400",
  cancelado: "bg-red-500/10 text-red-400",
};

const AdminPedidos = () => {
  const { pedidos, loading, updateStatus } = usePedidos();

  if (loading) return <div className="admin-page flex items-center justify-center min-h-[400px]"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>;

  return (
    <div className="admin-page space-y-6 w-full overflow-hidden p-4 md:p-6">
      <div>
        <h1 className="font-display text-2xl md:text-3xl font-bold text-[hsl(var(--dark-section-fg))]">Pedidos</h1>
        <p className="text-sm text-[hsl(var(--dark-section-muted))] mt-1">{pedidos.length} pedidos registrados</p>
      </div>

      <div className="bg-[hsl(var(--dark-section-card))] border border-[hsl(var(--dark-section-border))] rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-[hsl(var(--dark-section-border))]">
                <th className="text-left px-4 py-3 text-xs text-[hsl(var(--dark-section-muted))] font-semibold">Email</th>
                <th className="text-left px-4 py-3 text-xs text-[hsl(var(--dark-section-muted))] font-semibold">Valor</th>
                <th className="text-left px-4 py-3 text-xs text-[hsl(var(--dark-section-muted))] font-semibold">Status</th>
                <th className="text-left px-4 py-3 text-xs text-[hsl(var(--dark-section-muted))] font-semibold">Data</th>
                <th className="text-right px-4 py-3 text-xs text-[hsl(var(--dark-section-muted))] font-semibold">Ações</th>
              </tr>
            </thead>
            <tbody>
              {pedidos.map(p => (
                <tr key={p.id} className="border-b border-[hsl(var(--dark-section-border))]/50 hover:bg-[hsl(var(--dark-section))]/30">
                  <td className="px-4 py-3 text-[hsl(var(--dark-section-fg))]">{p.cliente_email}</td>
                  <td className="px-4 py-3 font-bold text-primary">R$ {p.valor.toFixed(2)}</td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-1 rounded-full text-xs font-bold ${statusColors[p.status] || "bg-gray-500/10 text-gray-400"}`}>
                      {p.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-[hsl(var(--dark-section-muted))] text-xs">{new Date(p.created_at).toLocaleDateString("pt-BR")}</td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex gap-1 justify-end">
                      {p.status === "pendente" && (
                        <>
                          <Button size="sm" variant="ghost" onClick={() => updateStatus(p.id, "pago")} className="text-emerald-400 hover:bg-emerald-500/10 rounded-lg text-xs">Pago</Button>
                          <Button size="sm" variant="ghost" onClick={() => updateStatus(p.id, "cancelado")} className="text-red-400 hover:bg-red-500/10 rounded-lg text-xs">Cancelar</Button>
                        </>
                      )}
                      {p.status === "cancelado" && (
                        <Button size="sm" variant="ghost" onClick={() => updateStatus(p.id, "pendente")} className="text-amber-400 hover:bg-amber-500/10 rounded-lg text-xs">Reabrir</Button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
              {pedidos.length === 0 && (
                <tr><td colSpan={5} className="px-4 py-8 text-center text-[hsl(var(--dark-section-muted))]">Nenhum pedido encontrado</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminPedidos;