import { useState } from "react";
import { useClients, useServiceRecords } from "@/hooks/useSupabaseData";
import { Search, Plus, PhoneCall, Mail, MessageSquare, Wrench, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";

const typeIcons: Record<string, any> = {
  "Ligação": PhoneCall,
  "E-mail": Mail,
  "WhatsApp": MessageSquare,
  "Técnico": Wrench,
  "Outro": FileText,
};

const AdminAtendimentos = () => {
  const { clients, loading: loadingClients } = useClients();
  const [selectedClientId, setSelectedClientId] = useState<string | null>(null);
  const { records, loading: loadingRecords, create } = useServiceRecords(selectedClientId);
  const [search, setSearch] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [form, setForm] = useState({ agent: "", type: "Ligação", description: "" });

  const filteredClients = clients.filter(
    (c) => c.name.toLowerCase().includes(search.toLowerCase()) || c.email.toLowerCase().includes(search.toLowerCase())
  );

  const selectedClient = clients.find((c) => c.id === selectedClientId);

  const handleCreate = async () => {
    if (!selectedClientId || !form.agent || !form.description) {
      toast.error("Preencha todos os campos.");
      return;
    }
    const ok = await create({
      client_id: selectedClientId,
      agent: form.agent,
      type: form.type,
      description: form.description,
    });
    if (ok) {
      setDialogOpen(false);
      setForm({ agent: "", type: "Ligação", description: "" });
    }
  };

  return (
    <div className="p-4 md:p-8 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[hsl(var(--dark-section-fg))]">Atendimentos</h1>
          <p className="text-sm text-[hsl(var(--dark-section-muted))]">Histórico de atendimentos por cliente</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Client list */}
        <div className="lg:col-span-1 space-y-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[hsl(var(--dark-section-muted))]" />
            <Input
              placeholder="Buscar cliente..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10 bg-[hsl(var(--dark-section-card))] border-[hsl(var(--dark-section-border))] text-[hsl(var(--dark-section-fg))]"
            />
          </div>
          <div className="max-h-[60vh] overflow-y-auto space-y-1">
            {loadingClients ? (
              <p className="text-sm text-[hsl(var(--dark-section-muted))] p-4">Carregando...</p>
            ) : filteredClients.length === 0 ? (
              <p className="text-sm text-[hsl(var(--dark-section-muted))] p-4">Nenhum cliente encontrado.</p>
            ) : (
              filteredClients.map((c) => (
                <button
                  key={c.id}
                  onClick={() => setSelectedClientId(c.id)}
                  className={`w-full text-left px-4 py-3 rounded-xl transition-colors ${
                    selectedClientId === c.id
                      ? "bg-primary/20 border border-primary/40"
                      : "bg-[hsl(var(--dark-section-card))] border border-[hsl(var(--dark-section-border))] hover:border-primary/30"
                  }`}
                >
                  <p className="font-medium text-sm text-[hsl(var(--dark-section-fg))]">{c.name}</p>
                  <p className="text-xs text-[hsl(var(--dark-section-muted))]">{c.email}</p>
                </button>
              ))
            )}
          </div>
        </div>

        {/* Records */}
        <div className="lg:col-span-2 space-y-4">
          {selectedClient ? (
            <>
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-semibold text-[hsl(var(--dark-section-fg))]">{selectedClient.name}</h2>
                  <p className="text-xs text-[hsl(var(--dark-section-muted))]">{selectedClient.plan_name} • {selectedClient.status}</p>
                </div>
                <Button onClick={() => setDialogOpen(true)} size="sm" className="gap-2">
                  <Plus className="w-4 h-4" /> Novo Atendimento
                </Button>
              </div>

              {loadingRecords ? (
                <p className="text-sm text-[hsl(var(--dark-section-muted))]">Carregando...</p>
              ) : records.length === 0 ? (
                <div className="text-center py-12 text-[hsl(var(--dark-section-muted))]">
                  <FileText className="w-12 h-12 mx-auto mb-3 opacity-30" />
                  <p>Nenhum atendimento registrado.</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {records.map((r) => {
                    const Icon = typeIcons[r.type] || FileText;
                    return (
                      <div
                        key={r.id}
                        className="bg-[hsl(var(--dark-section-card))] border border-[hsl(var(--dark-section-border))] rounded-xl p-4"
                      >
                        <div className="flex items-start gap-3">
                          <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                            <Icon className="w-4 h-4 text-primary" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between">
                              <span className="text-sm font-medium text-[hsl(var(--dark-section-fg))]">{r.type}</span>
                              <span className="text-xs text-[hsl(var(--dark-section-muted))]">
                                {new Date(r.created_at).toLocaleDateString("pt-BR")} {new Date(r.created_at).toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" })}
                              </span>
                            </div>
                            <p className="text-sm text-[hsl(var(--dark-section-muted))] mt-1">{r.description}</p>
                            <p className="text-xs text-primary/70 mt-2">Agente: {r.agent}</p>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </>
          ) : (
            <div className="text-center py-20 text-[hsl(var(--dark-section-muted))]">
              <PhoneCall className="w-16 h-16 mx-auto mb-4 opacity-20" />
              <p className="text-lg font-medium">Selecione um cliente</p>
              <p className="text-sm">Escolha um cliente na lista para ver o histórico de atendimentos.</p>
            </div>
          )}
        </div>
      </div>

      {/* New record dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="bg-[hsl(var(--dark-section-card))] border-[hsl(var(--dark-section-border))] text-[hsl(var(--dark-section-fg))]">
          <DialogHeader>
            <DialogTitle>Novo Atendimento</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <label className="text-sm text-[hsl(var(--dark-section-muted))]">Agente</label>
              <Input
                value={form.agent}
                onChange={(e) => setForm({ ...form, agent: e.target.value })}
                placeholder="Nome do atendente"
                className="bg-[hsl(var(--dark-section))] border-[hsl(var(--dark-section-border))]"
              />
            </div>
            <div>
              <label className="text-sm text-[hsl(var(--dark-section-muted))]">Tipo</label>
              <Select value={form.type} onValueChange={(v) => setForm({ ...form, type: v })}>
                <SelectTrigger className="bg-[hsl(var(--dark-section))] border-[hsl(var(--dark-section-border))]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {Object.keys(typeIcons).map((t) => (
                    <SelectItem key={t} value={t}>{t}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="text-sm text-[hsl(var(--dark-section-muted))]">Descrição</label>
              <Textarea
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                placeholder="Descreva o atendimento..."
                className="bg-[hsl(var(--dark-section))] border-[hsl(var(--dark-section-border))]"
                rows={4}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>Cancelar</Button>
            <Button onClick={handleCreate}>Registrar</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminAtendimentos;
