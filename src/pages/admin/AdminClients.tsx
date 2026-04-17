import { useState, useMemo } from "react";
import { Search, X, Edit2, UserX as UserXIcon, UserCheck, FileSpreadsheet, MessageCircle, Plus, Loader2, Users } from "lucide-react";
import AdminPagination from "@/components/admin/AdminPagination";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useClients, usePlans, useServiceRecords, type DbClient } from "@/hooks/useSupabaseData";
import { exportToExcel } from "@/utils/exportUtils";
import { AdminErrorCard, AdminEmptyCard } from "@/components/admin/AdminStateCards";
import { toast } from "sonner";

const statusColors = {
  Ativo: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
  Inadimplente: "bg-amber-500/10 text-amber-400 border-amber-500/20",
  Cancelado: "bg-red-500/10 text-red-400 border-red-500/20",
};

const serviceTypeColors = {
  "Suporte Técnico": "bg-blue-500/10 text-blue-400 border-blue-500/20",
  Financeiro: "bg-amber-500/10 text-amber-400 border-amber-500/20",
  Comercial: "bg-purple-500/10 text-purple-400 border-purple-500/20",
};

const AdminClients = () => {
  const { clients, loading, error, refetch } = useClients();
  const { plans } = usePlans();
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("Todos");
  const [planFilter, setPlanFilter] = useState("Todos");
  const [selectedClient, setSelectedClient] = useState<DbClient | null>(null);
  const [activeTab, setActiveTab] = useState<"dados" | "atendimentos">("dados");
  const [showNewService, setShowNewService] = useState(false);
  const [newServiceType, setNewServiceType] = useState<string>("Suporte Técnico");
  const [newServiceDesc, setNewServiceDesc] = useState("");
  const [page, setPage] = useState(0);
  const perPage = 20;

  const { records: serviceHistory, create: createService } = useServiceRecords(selectedClient?.id || null);

  const filtered = useMemo(() => {
    return clients.filter((c) => {
      const matchSearch = !search || c.name.toLowerCase().includes(search.toLowerCase()) || c.email.toLowerCase().includes(search.toLowerCase());
      const matchStatus = statusFilter === "Todos" || c.status === statusFilter;
      const matchPlan = planFilter === "Todos" || c.plan_name === planFilter;
      return matchSearch && matchStatus && matchPlan;
    });
  }, [clients, search, statusFilter, planFilter]);

  const paginated = filtered.slice(page * perPage, (page + 1) * perPage);
  const totalPages = Math.max(1, Math.ceil(filtered.length / perPage));

  const openClient = (c: DbClient) => {
    setSelectedClient(c);
    setActiveTab("dados");
    setShowNewService(false);
  };

  const handleExportClients = () => {
    const exportData = filtered.map((c) => ({
      Nome: c.name, Email: c.email, Plano: c.plan_name || "", Status: c.status,
      "Valor (R$)": c.plan_price || 0, Data: c.join_date, Telefone: c.phone, Endereço: c.address, Velocidade: c.plan_speed || "",
    }));
    if (!exportData.length) { toast.error("Nenhum dado disponível"); return; }
    exportToExcel(exportData, `clientes-jdtelecom-${new Date().toISOString().slice(0, 10)}`, { reportTitle: "JD Telecom", reportSubtitle: "Relatório de Clientes" });
    toast.success(`${exportData.length} clientes exportados`);
  };

  const handleWhatsApp = (client: DbClient) => {
    const phone = "08005945678";
    const msg = encodeURIComponent(`Atendimento ao cliente: ${client.name} - ${client.plan_name}`);
    window.open(`https://wa.me/${phone}?text=${msg}`, "_blank");
  };

  const handleAddService = async () => {
    if (!selectedClient || !newServiceDesc.trim()) return;
    await createService({ client_id: selectedClient.id, agent: "Admin", type: newServiceType, description: newServiceDesc });
    setNewServiceDesc("");
    setShowNewService(false);
  };

  if (loading) {
    return (
      <div className="admin-page flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="admin-page">
        <AdminErrorCard
          title="Não foi possível carregar os clientes"
          description="Houve um problema ao buscar a lista de clientes. Tente novamente."
          onRetry={() => refetch()}
        />
      </div>
    );
  }

  if (!clients.length) {
    return (
      <div className="admin-page">
        <AdminEmptyCard
          icon={Users}
          title="Nenhum cliente cadastrado"
          description="Quando novos clientes forem cadastrados, eles aparecerão aqui."
        />
      </div>
    );
  }

  return (
    <div className="admin-page space-y-6 w-full overflow-hidden">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="font-display text-2xl md:text-3xl font-bold text-[hsl(var(--dark-section-fg))]">Clientes</h1>
          <p className="text-sm text-[hsl(var(--dark-section-muted))] mt-1">{filtered.length} clientes encontrados</p>
        </div>
        <Button onClick={handleExportClients} disabled={!filtered.length} className="w-full sm:w-auto bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold text-sm disabled:opacity-60">
          <FileSpreadsheet className="w-4 h-4 mr-2" /> Exportar Excel
        </Button>
      </div>

      <div className="flex flex-col gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[hsl(var(--dark-section-muted))]" />
          <Input placeholder="Buscar por nome ou email..." value={search} onChange={(e) => { setSearch(e.target.value); setPage(0); }}
            className="bg-[hsl(var(--dark-section-card))] border-[hsl(var(--dark-section-border))] text-[hsl(var(--dark-section-fg))] pl-10 h-10 rounded-xl" />
        </div>
        <div className="grid grid-cols-2 sm:flex gap-2">
          {["Todos", "Ativo", "Inadimplente", "Cancelado"].map((s) => (
            <button key={s} onClick={() => { setStatusFilter(s); setPage(0); }}
              className={`w-full sm:w-auto text-center px-3 py-2 rounded-xl text-xs font-semibold transition-all border ${
                statusFilter === s ? "bg-primary text-primary-foreground border-primary" : "bg-[hsl(var(--dark-section-card))] text-[hsl(var(--dark-section-muted))] border-[hsl(var(--dark-section-border))]"
              }`}>{s}</button>
          ))}
        </div>
        <select value={planFilter} onChange={e => { setPlanFilter(e.target.value); setPage(0); }}
          className="bg-[hsl(var(--dark-section-card))] border border-[hsl(var(--dark-section-border))] text-[hsl(var(--dark-section-fg))] px-4 h-10 rounded-xl text-xs font-semibold appearance-none cursor-pointer w-full sm:w-auto">
          <option value="Todos">Todos os planos</option>
          {plans.map(p => <option key={p.id} value={p.name}>{p.name}</option>)}
        </select>
      </div>

      <div className="bg-[hsl(var(--dark-section-card))] border border-[hsl(var(--dark-section-border))] rounded-2xl overflow-hidden">
        <div className="overflow-x-auto [-webkit-overflow-scrolling:touch]">
          <table className="w-full min-w-[680px] text-sm">
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
                  <td className="py-3 px-4 text-[hsl(var(--dark-section-fg))] hidden lg:table-cell">{c.plan_name}</td>
                  <td className="py-3 px-4">
                    <span className={`inline-flex px-2.5 py-1 rounded-full border text-xs font-semibold ${statusColors[c.status]}`}>{c.status}</span>
                  </td>
                  <td className="py-3 px-4 text-right">
                    <div className="flex items-center justify-end gap-1">
                      <Button size="sm" variant="ghost" onClick={() => handleWhatsApp(c)}
                        className="text-emerald-400 hover:bg-emerald-500/10 rounded-lg text-xs p-2" title="WhatsApp">
                        <MessageCircle className="w-4 h-4" />
                      </Button>
                      <Button size="sm" variant="ghost" onClick={() => openClient(c)}
                        className="text-primary hover:bg-primary/10 rounded-lg text-xs">
                        Detalhes
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <AdminPagination currentPage={page + 1} totalPages={totalPages} totalItems={filtered.length} perPage={perPage} onPageChange={(p) => setPage(p - 1)} />
      </div>

      {selectedClient && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4" onClick={() => setSelectedClient(null)}>
          <div className="bg-[hsl(var(--dark-section-card))] border border-[hsl(var(--dark-section-border))] rounded-2xl w-full max-w-2xl max-h-[85vh] overflow-y-auto p-4 sm:p-6"
            onClick={(e) => e.stopPropagation()}>
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4">
              <h3 className="font-display text-lg font-bold text-[hsl(var(--dark-section-fg))] break-words">{selectedClient.name}</h3>
              <div className="flex items-center gap-2 w-full sm:w-auto">
                <Button size="sm" onClick={() => handleWhatsApp(selectedClient)} className="bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs w-full sm:w-auto">
                  <MessageCircle className="w-3 h-3 mr-1" /> WhatsApp
                </Button>
                <button onClick={() => setSelectedClient(null)} className="text-[hsl(var(--dark-section-muted))] hover:text-[hsl(var(--dark-section-fg))]">
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            <div className="flex gap-2 mb-4 border-b border-[hsl(var(--dark-section-border))] pb-3 overflow-x-auto">
              {([["dados", "Dados"], ["atendimentos", "Atendimentos"]] as const).map(([id, label]) => (
                <button key={id} onClick={() => setActiveTab(id)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all whitespace-nowrap ${activeTab === id ? "bg-primary text-primary-foreground border-primary" : "text-[hsl(var(--dark-section-muted))] border-transparent"}`}>
                  {label}
                </button>
              ))}
            </div>

            {activeTab === "dados" && (
              <div className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {[
                    { label: "Nome", value: selectedClient.name },
                    { label: "Email", value: selectedClient.email },
                    { label: "Telefone", value: selectedClient.phone },
                    { label: "Endereço", value: selectedClient.address },
                    { label: "Plano", value: selectedClient.plan_name || "" },
                    { label: "Velocidade", value: selectedClient.plan_speed || "" },
                    { label: "Valor", value: `R$ ${(selectedClient.plan_price || 0).toFixed(2)}` },
                    { label: "Cliente desde", value: selectedClient.join_date },
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
              </div>
            )}

            {activeTab === "atendimentos" && (
              <div>
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-3">
                  <p className="text-xs uppercase text-[hsl(var(--dark-section-muted))] font-semibold tracking-wider">Histórico de Atendimento</p>
                  <Button size="sm" onClick={() => setShowNewService(!showNewService)} className="bg-primary text-primary-foreground hover:bg-primary/90 rounded-xl text-xs w-full sm:w-auto">
                    <Plus className="w-3 h-3 mr-1" /> Novo Atendimento
                  </Button>
                </div>

                {showNewService && (
                  <div className="bg-[hsl(var(--dark-section))]/50 rounded-xl p-4 mb-4 space-y-3 border border-[hsl(var(--dark-section-border))]">
                    <div className="flex gap-2 flex-wrap">
                      {["Suporte Técnico", "Financeiro", "Comercial"].map(t => (
                        <button key={t} onClick={() => setNewServiceType(t)}
                          className={`px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all ${newServiceType === t ? "bg-primary text-primary-foreground border-primary" : "text-[hsl(var(--dark-section-muted))] border-[hsl(var(--dark-section-border))]"}`}>
                          {t}
                        </button>
                      ))}
                    </div>
                    <textarea value={newServiceDesc} onChange={e => setNewServiceDesc(e.target.value)}
                      placeholder="Descreva o atendimento..." rows={3}
                      className="w-full bg-[hsl(var(--dark-section))] border border-[hsl(var(--dark-section-border))] text-[hsl(var(--dark-section-fg))] rounded-xl p-3 text-sm placeholder:text-[hsl(var(--dark-section-muted))] resize-none" />
                    <Button size="sm" onClick={handleAddService} disabled={!newServiceDesc.trim()} className="bg-primary text-primary-foreground hover:bg-primary/90 rounded-xl text-xs">
                      Registrar Atendimento
                    </Button>
                  </div>
                )}

                <div className="space-y-2">
                  {serviceHistory.map(r => (
                    <div key={r.id} className="bg-[hsl(var(--dark-section))]/50 rounded-xl p-3 border border-[hsl(var(--dark-section-border))]">
                      <div className="flex flex-wrap items-center gap-2 mb-1">
                        <span className={`inline-flex px-2 py-0.5 rounded-full border text-[10px] font-semibold ${serviceTypeColors[r.type as keyof typeof serviceTypeColors] || "bg-slate-500/10 text-slate-400 border-slate-500/20"}`}>{r.type}</span>
                        <span className="text-[10px] text-[hsl(var(--dark-section-muted))]">{new Date(r.created_at).toLocaleDateString("pt-BR")}</span>
                        <span className="text-[10px] text-[hsl(var(--dark-section-muted))]">• {r.agent}</span>
                      </div>
                      <p className="text-xs text-[hsl(var(--dark-section-fg))]">{r.description}</p>
                    </div>
                  ))}
                  {serviceHistory.length === 0 && (
                    <p className="text-xs text-[hsl(var(--dark-section-muted))] text-center py-4">Nenhum atendimento registrado</p>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminClients;
