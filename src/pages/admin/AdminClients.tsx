import { useState, useMemo } from "react";
import { Search, X, Edit2, UserX as UserXIcon, UserCheck, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { mockClients, type Client } from "@/data/adminMockData";
import { exportToCSV } from "@/utils/exportUtils";

const statusColors = {
  Ativo: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
  Inadimplente: "bg-amber-500/10 text-amber-400 border-amber-500/20",
  Cancelado: "bg-red-500/10 text-red-400 border-red-500/20",
};

const AdminClients = () => {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("Todos");
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  const [page, setPage] = useState(0);
  const perPage = 20;

  const filtered = useMemo(() => {
    return mockClients.filter((c) => {
      const matchSearch = !search || c.name.toLowerCase().includes(search.toLowerCase()) || c.email.toLowerCase().includes(search.toLowerCase());
      const matchStatus = statusFilter === "Todos" || c.status === statusFilter;
      return matchSearch && matchStatus;
    });
  }, [search, statusFilter]);

  const paginated = filtered.slice(page * perPage, (page + 1) * perPage);
  const totalPages = Math.ceil(filtered.length / perPage);

  const handleExportClients = () => {
    const data = filtered.map(c => ({
      Nome: c.name,
      Email: c.email,
      Telefone: c.phone,
      Endereço: c.address,
      Plano: c.plan,
      Velocidade: c.speed,
      "Valor (R$)": c.price.toFixed(2),
      Status: c.status,
      "Cliente desde": c.joinDate,
    }));
    const suffix = statusFilter !== "Todos" ? `_${statusFilter.toLowerCase()}` : "";
    exportToCSV(data, `clientes_jdtelecom${suffix}`);
  };

  const handleExportPayments = () => {
    if (!selectedClient) return;
    const data = selectedClient.payments.map(p => ({
      Descrição: p.description,
      Data: p.date,
      "Valor (R$)": p.amount.toFixed(2),
      Status: p.status,
    }));
    exportToCSV(data, `pagamentos_${selectedClient.name.replace(/ /g, "_")}`);
  };

  return (
    <div className="p-4 md:p-6 lg:p-8 space-y-6 max-w-[1400px]">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="font-display text-2xl md:text-3xl font-bold text-[hsl(var(--dark-section-fg))]">Clientes</h1>
          <p className="text-sm text-[hsl(var(--dark-section-muted))] mt-1">{filtered.length} clientes encontrados</p>
        </div>
        <Button onClick={handleExportClients} className="bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold text-sm">
          <Download className="w-4 h-4 mr-2" /> Exportar Planilha
        </Button>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[hsl(var(--dark-section-muted))]" />
          <Input placeholder="Buscar por nome ou email..." value={search} onChange={(e) => { setSearch(e.target.value); setPage(0); }}
            className="bg-[hsl(var(--dark-section-card))] border-[hsl(var(--dark-section-border))] text-[hsl(var(--dark-section-fg))] pl-10 h-10 rounded-xl" />
        </div>
        <div className="flex gap-2 flex-wrap">
          {["Todos", "Ativo", "Inadimplente", "Cancelado"].map((s) => (
            <button key={s} onClick={() => { setStatusFilter(s); setPage(0); }}
              className={`px-3 py-2 rounded-xl text-xs font-semibold transition-all border ${
                statusFilter === s ? "bg-primary text-primary-foreground border-primary" : "bg-[hsl(var(--dark-section-card))] text-[hsl(var(--dark-section-muted))] border-[hsl(var(--dark-section-border))] hover:border-primary/40"
              }`}>{s}</button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="bg-[hsl(var(--dark-section-card))] border border-[hsl(var(--dark-section-border))] rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-[hsl(var(--dark-section-border))]">
                <th className="text-left py-3 px-4 text-xs font-semibold text-[hsl(var(--dark-section-muted))] uppercase tracking-wider">Nome</th>
                <th className="text-left py-3 px-4 text-xs font-semibold text-[hsl(var(--dark-section-muted))] uppercase tracking-wider hidden md:table-cell">Email</th>
                <th className="text-left py-3 px-4 text-xs font-semibold text-[hsl(var(--dark-section-muted))] uppercase tracking-wider hidden lg:table-cell">Plano</th>
                <th className="text-left py-3 px-4 text-xs font-semibold text-[hsl(var(--dark-section-muted))] uppercase tracking-wider">Status</th>
                <th className="text-right py-3 px-4 text-xs font-semibold text-[hsl(var(--dark-section-muted))] uppercase tracking-wider">Ações</th>
              </tr>
            </thead>
            <tbody>
              {paginated.map((c) => (
                <tr key={c.id} className="border-b border-[hsl(var(--dark-section-border))]/50 hover:bg-[hsl(var(--dark-section))]/30 transition-colors">
                  <td className="py-3 px-4">
                    <p className="font-medium text-[hsl(var(--dark-section-fg))]">{c.name}</p>
                    <p className="text-xs text-[hsl(var(--dark-section-muted))] md:hidden">{c.email}</p>
                  </td>
                  <td className="py-3 px-4 text-[hsl(var(--dark-section-muted))] hidden md:table-cell">{c.email}</td>
                  <td className="py-3 px-4 text-[hsl(var(--dark-section-fg))] hidden lg:table-cell">{c.plan}</td>
                  <td className="py-3 px-4">
                    <span className={`inline-flex px-2.5 py-1 rounded-full border text-xs font-semibold ${statusColors[c.status]}`}>{c.status}</span>
                  </td>
                  <td className="py-3 px-4 text-right">
                    <Button size="sm" variant="ghost" onClick={() => setSelectedClient(c)}
                      className="text-primary hover:bg-primary/10 rounded-lg text-xs">
                      Detalhes
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-between px-4 py-3 border-t border-[hsl(var(--dark-section-border))]">
          <p className="text-xs text-[hsl(var(--dark-section-muted))]">Página {page + 1} de {totalPages}</p>
          <div className="flex gap-2">
            <Button size="sm" variant="ghost" disabled={page === 0} onClick={() => setPage(page - 1)}
              className="text-[hsl(var(--dark-section-muted))] rounded-lg">Anterior</Button>
            <Button size="sm" variant="ghost" disabled={page >= totalPages - 1} onClick={() => setPage(page + 1)}
              className="text-[hsl(var(--dark-section-muted))] rounded-lg">Próxima</Button>
          </div>
        </div>
      </div>

      {/* Client Detail Modal */}
      {selectedClient && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4" onClick={() => setSelectedClient(null)}>
          <div className="bg-[hsl(var(--dark-section-card))] border border-[hsl(var(--dark-section-border))] rounded-2xl w-full max-w-lg max-h-[80vh] overflow-y-auto p-6"
            onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-display text-lg font-bold text-[hsl(var(--dark-section-fg))]">Detalhes do Cliente</h3>
              <button onClick={() => setSelectedClient(null)} className="text-[hsl(var(--dark-section-muted))] hover:text-[hsl(var(--dark-section-fg))]">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                {[
                  { label: "Nome", value: selectedClient.name },
                  { label: "Email", value: selectedClient.email },
                  { label: "Telefone", value: selectedClient.phone },
                  { label: "Endereço", value: selectedClient.address },
                  { label: "Plano", value: selectedClient.plan },
                  { label: "Velocidade", value: selectedClient.speed },
                  { label: "Valor", value: `R$ ${selectedClient.price.toFixed(2)}` },
                  { label: "Cliente desde", value: selectedClient.joinDate },
                ].map((f) => (
                  <div key={f.label}>
                    <p className="text-[10px] uppercase text-[hsl(var(--dark-section-muted))] font-semibold tracking-wider">{f.label}</p>
                    <p className="text-sm text-[hsl(var(--dark-section-fg))] mt-0.5">{f.value}</p>
                  </div>
                ))}
              </div>

              <div className="flex items-center gap-2">
                <span className="text-xs text-[hsl(var(--dark-section-muted))]">Status:</span>
                <span className={`inline-flex px-2.5 py-1 rounded-full border text-xs font-semibold ${statusColors[selectedClient.status]}`}>{selectedClient.status}</span>
              </div>

              {/* Payment history */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <p className="text-xs uppercase text-[hsl(var(--dark-section-muted))] font-semibold tracking-wider">Histórico de Pagamentos</p>
                  <button onClick={handleExportPayments} className="text-[10px] text-emerald-400 hover:text-emerald-300 font-semibold flex items-center gap-1">
                    <Download className="w-3 h-3" /> Exportar
                  </button>
                </div>
                <div className="space-y-1.5">
                  {selectedClient.payments.map((p) => (
                    <div key={p.id} className="flex items-center justify-between text-xs bg-[hsl(var(--dark-section))]/50 rounded-lg px-3 py-2">
                      <span className="text-[hsl(var(--dark-section-fg))]">{p.description}</span>
                      <div className="flex items-center gap-3">
                        <span className="text-[hsl(var(--dark-section-muted))]">R$ {p.amount.toFixed(2)}</span>
                        <span className={`px-2 py-0.5 rounded-full border text-[10px] font-semibold ${
                          p.status === "Pago" ? statusColors.Ativo : p.status === "Pendente" ? statusColors.Inadimplente : statusColors.Cancelado
                        }`}>{p.status}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Actions */}
              <div className="flex flex-wrap gap-2 pt-2 border-t border-[hsl(var(--dark-section-border))]">
                <Button size="sm" className="bg-primary text-primary-foreground hover:bg-primary/90 rounded-xl text-xs">
                  <Edit2 className="w-3 h-3 mr-1" /> Editar
                </Button>
                <Button size="sm" variant="outline" className="border-[hsl(var(--dark-section-border))] text-[hsl(var(--dark-section-fg))] rounded-xl text-xs">
                  <UserCheck className="w-3 h-3 mr-1" /> Alterar Status
                </Button>
                <Button size="sm" variant="outline" className="border-destructive/30 text-destructive hover:bg-destructive/10 rounded-xl text-xs">
                  <UserXIcon className="w-3 h-3 mr-1" /> Cancelar
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminClients;
