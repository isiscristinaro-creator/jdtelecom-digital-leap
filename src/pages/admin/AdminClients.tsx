import { useState, useMemo } from "react";
import { Search, X, Edit2, UserX as UserXIcon, UserCheck, FileSpreadsheet, MessageCircle, Plus, Headphones } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { mockClients, mockPlans, type Client } from "@/data/adminMockData";
import { exportToExcel } from "@/utils/exportUtils";
import { generateServiceHistory, type ServiceRecord } from "@/data/adminServiceHistoryData";
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
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("Todos");
  const [planFilter, setPlanFilter] = useState("Todos");
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  const [activeTab, setActiveTab] = useState<"dados" | "pagamentos" | "atendimentos">("dados");
  const [serviceHistory, setServiceHistory] = useState<ServiceRecord[]>([]);
  const [showNewService, setShowNewService] = useState(false);
  const [newServiceType, setNewServiceType] = useState<ServiceRecord["type"]>("Suporte Técnico");
  const [newServiceDesc, setNewServiceDesc] = useState("");
  const [page, setPage] = useState(0);
  const perPage = 20;

  const filtered = useMemo(() => {
    return mockClients.filter((c) => {
      const matchSearch = !search || c.name.toLowerCase().includes(search.toLowerCase()) || c.email.toLowerCase().includes(search.toLowerCase());
      const matchStatus = statusFilter === "Todos" || c.status === statusFilter;
      const matchPlan = planFilter === "Todos" || c.plan === planFilter;
      return matchSearch && matchStatus && matchPlan;
    });
  }, [search, statusFilter, planFilter]);

  const paginated = filtered.slice(page * perPage, (page + 1) * perPage);
  const totalPages = Math.ceil(filtered.length / perPage);

  const openClient = (c: Client) => {
    setSelectedClient(c);
    setActiveTab("dados");
    setServiceHistory(generateServiceHistory(c.id));
    setShowNewService(false);
  };

  const handleExportClients = () => {
    const exportData = filtered.map((client) => ({
      Nome: client.name,
      Email: client.email,
      Plano: client.plan,
      Status: client.status,
      "Valor (R$)": client.price,
      Data: client.joinDate,
      Telefone: client.phone,
      Endereço: client.address,
      Velocidade: client.speed,
    }));

    if (!exportData.length) {
      toast.error("Nenhum dado disponível para exportação");
      return;
    }

    exportToExcel(exportData, `clientes_jdtelecom${statusFilter !== "Todos" ? `_${statusFilter.toLowerCase()}` : ""}`);
    toast.success(`${exportData.length} clientes exportados com sucesso`);
  };

  const handleExportPayments = () => {
    if (!selectedClient) return;
    const exportData = selectedClient.payments.map((payment) => ({
      Nome: selectedClient.name,
      Email: selectedClient.email,
      Plano: selectedClient.plan,
      Status: payment.status,
      "Valor (R$)": payment.amount,
      Data: payment.date,
      Descrição: payment.description,
    }));

    if (!exportData.length) {
      toast.error("Nenhum dado disponível para exportação");
      return;
    }

    exportToExcel(exportData, `pagamentos_${selectedClient.name.replace(/ /g, "_")}`);
    toast.success(`${exportData.length} pagamentos exportados com sucesso`);
  };

  const handleWhatsApp = (client: Client) => {
    const phone = "08005945678";
    const msg = encodeURIComponent(`Atendimento ao cliente: ${client.name} - ${client.plan}`);
    window.open(`https://wa.me/${phone}?text=${msg}`, "_blank");
  };

  const handleAddService = () => {
    if (!selectedClient || !newServiceDesc.trim()) return;
    const newRecord: ServiceRecord = {
      id: `srv-new-${Date.now()}`,
      clientId: selectedClient.id,
      date: new Date().toLocaleDateString("pt-BR"),
      agent: "Admin Master",
      type: newServiceType,
      description: newServiceDesc,
    };
    setServiceHistory(prev => [newRecord, ...prev]);
    setNewServiceDesc("");
    setShowNewService(false);
  };

  return (
    <div className="p-4 md:p-6 lg:p-8 space-y-6 max-w-[1400px]">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="font-display text-2xl md:text-3xl font-bold text-[hsl(var(--dark-section-fg))]">Clientes</h1>
          <p className="text-sm text-[hsl(var(--dark-section-muted))] mt-1">{filtered.length} clientes encontrados</p>
        </div>
        <Button onClick={handleExportClients} disabled={!filtered.length} className="bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold text-sm disabled:opacity-60">
          <FileSpreadsheet className="w-4 h-4 mr-2" /> Exportar Excel
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
                statusFilter === s ? "bg-primary text-primary-foreground border-primary" : "bg-[hsl(var(--dark-section-card))] text-[hsl(var(--dark-section-muted))] border-[hsl(var(--dark-section-border))]"
              }`}>{s}</button>
          ))}
        </div>
        <select value={planFilter} onChange={e => { setPlanFilter(e.target.value); setPage(0); }}
          className="bg-[hsl(var(--dark-section-card))] border border-[hsl(var(--dark-section-border))] text-[hsl(var(--dark-section-fg))] px-4 h-10 rounded-xl text-xs font-semibold appearance-none cursor-pointer">
          <option value="Todos">Todos os planos</option>
          {mockPlans.map(p => <option key={p.id} value={p.name}>{p.name}</option>)}
        </select>
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
        <div className="flex items-center justify-between px-4 py-3 border-t border-[hsl(var(--dark-section-border))]">
          <p className="text-xs text-[hsl(var(--dark-section-muted))]">Página {page + 1} de {totalPages}</p>
          <div className="flex gap-2">
            <Button size="sm" variant="ghost" disabled={page === 0} onClick={() => setPage(page - 1)} className="text-[hsl(var(--dark-section-muted))] rounded-lg">Anterior</Button>
            <Button size="sm" variant="ghost" disabled={page >= totalPages - 1} onClick={() => setPage(page + 1)} className="text-[hsl(var(--dark-section-muted))] rounded-lg">Próxima</Button>
          </div>
        </div>
      </div>

      {/* Client Detail Modal */}
      {selectedClient && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4" onClick={() => setSelectedClient(null)}>
          <div className="bg-[hsl(var(--dark-section-card))] border border-[hsl(var(--dark-section-border))] rounded-2xl w-full max-w-2xl max-h-[85vh] overflow-y-auto p-6"
            onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-display text-lg font-bold text-[hsl(var(--dark-section-fg))]">{selectedClient.name}</h3>
              <div className="flex items-center gap-2">
                <Button size="sm" onClick={() => handleWhatsApp(selectedClient)} className="bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs">
                  <MessageCircle className="w-3 h-3 mr-1" /> Atender via WhatsApp
                </Button>
                <button onClick={() => setSelectedClient(null)} className="text-[hsl(var(--dark-section-muted))] hover:text-[hsl(var(--dark-section-fg))]">
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Tabs */}
            <div className="flex gap-2 mb-4 border-b border-[hsl(var(--dark-section-border))] pb-3">
              {([["dados", "Dados"], ["pagamentos", "Pagamentos"], ["atendimentos", "Atendimentos"]] as const).map(([id, label]) => (
                <button key={id} onClick={() => setActiveTab(id)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all ${activeTab === id ? "bg-primary text-primary-foreground border-primary" : "text-[hsl(var(--dark-section-muted))] border-transparent"}`}>
                  {label}
                </button>
              ))}
            </div>

            {activeTab === "dados" && (
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
                <div className="flex flex-wrap gap-2 pt-2 border-t border-[hsl(var(--dark-section-border))]">
                  <Button size="sm" className="bg-primary text-primary-foreground hover:bg-primary/90 rounded-xl text-xs"><Edit2 className="w-3 h-3 mr-1" /> Editar</Button>
                  <Button size="sm" variant="outline" className="border-[hsl(var(--dark-section-border))] text-[hsl(var(--dark-section-fg))] rounded-xl text-xs"><UserCheck className="w-3 h-3 mr-1" /> Alterar Status</Button>
                  <Button size="sm" variant="outline" className="border-destructive/30 text-destructive hover:bg-destructive/10 rounded-xl text-xs"><UserXIcon className="w-3 h-3 mr-1" /> Cancelar</Button>
                </div>
              </div>
            )}

            {activeTab === "pagamentos" && (
              <div>
                <div className="flex items-center justify-between mb-3">
                  <p className="text-xs uppercase text-[hsl(var(--dark-section-muted))] font-semibold tracking-wider">Histórico de Pagamentos</p>
                  <button onClick={handleExportPayments} disabled={!selectedClient.payments.length} className="text-[10px] text-emerald-400 hover:text-emerald-300 disabled:opacity-60 font-semibold flex items-center gap-1">
                    <FileSpreadsheet className="w-3 h-3" /> Exportar Excel
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
            )}

            {activeTab === "atendimentos" && (
              <div>
                <div className="flex items-center justify-between mb-3">
                  <p className="text-xs uppercase text-[hsl(var(--dark-section-muted))] font-semibold tracking-wider">Histórico de Atendimento</p>
                  <Button size="sm" onClick={() => setShowNewService(!showNewService)} className="bg-primary text-primary-foreground hover:bg-primary/90 rounded-xl text-xs">
                    <Plus className="w-3 h-3 mr-1" /> Novo Atendimento
                  </Button>
                </div>

                {showNewService && (
                  <div className="bg-[hsl(var(--dark-section))]/50 rounded-xl p-4 mb-4 space-y-3 border border-[hsl(var(--dark-section-border))]">
                    <div className="flex gap-2 flex-wrap">
                      {(["Suporte Técnico", "Financeiro", "Comercial"] as const).map(t => (
                        <button key={t} onClick={() => setNewServiceType(t)}
                          className={`px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all ${newServiceType === t ? "bg-primary text-primary-foreground border-primary" : "text-[hsl(var(--dark-section-muted))] border-[hsl(var(--dark-section-border))]"}`}>
                          {t}
                        </button>
                      ))}
                    </div>
                    <textarea value={newServiceDesc} onChange={e => setNewServiceDesc(e.target.value)}
                      placeholder="Descreva o atendimento..."
                      className="w-full bg-[hsl(var(--dark-section-card))] border border-[hsl(var(--dark-section-border))] text-[hsl(var(--dark-section-fg))] rounded-xl p-3 text-xs min-h-[80px] resize-none" />
                    <div className="flex gap-2">
                      <Button size="sm" onClick={handleAddService} className="bg-primary text-primary-foreground rounded-xl text-xs">Salvar</Button>
                      <Button size="sm" variant="ghost" onClick={() => setShowNewService(false)} className="text-[hsl(var(--dark-section-muted))] rounded-xl text-xs">Cancelar</Button>
                    </div>
                  </div>
                )}

                <div className="space-y-2">
                  {serviceHistory.map(s => (
                    <div key={s.id} className="bg-[hsl(var(--dark-section))]/50 rounded-xl p-3 border border-[hsl(var(--dark-section-border))]/50">
                      <div className="flex items-center justify-between mb-1.5">
                        <div className="flex items-center gap-2">
                          <span className={`px-2 py-0.5 rounded-full border text-[10px] font-semibold ${serviceTypeColors[s.type]}`}>{s.type}</span>
                          <span className="text-[10px] text-[hsl(var(--dark-section-muted))]">{s.date}</span>
                        </div>
                        <span className="text-[10px] text-[hsl(var(--dark-section-muted))] flex items-center gap-1">
                          <Headphones className="w-3 h-3" /> {s.agent}
                        </span>
                      </div>
                      <p className="text-xs text-[hsl(var(--dark-section-fg))]">{s.description}</p>
                    </div>
                  ))}
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
