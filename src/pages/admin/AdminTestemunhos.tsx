import { useState } from "react";
import { Plus, Edit2, Trash2, X, Check, Loader2, Eye, EyeOff, MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useTestemunhos, type DbTestemunho } from "@/hooks/useSupabaseData";

const FILTER_OPTIONS = [
  { value: "todos", label: "Todos" },
  { value: "geral", label: "Geral" },
  { value: "fibra", label: "Fibra" },
  { value: "fwa5g", label: "FWA 5G" },
  { value: "combos", label: "Combos" },
];

const PRODUTO_OPTIONS = [
  { value: "geral", label: "Geral (Home)" },
  { value: "fibra", label: "Fibra Óptica" },
  { value: "fwa5g", label: "FWA 5G" },
  { value: "combos", label: "Combos" },
];

const AdminTestemunhos = () => {
  const { testemunhos, loading, create, update, remove } = useTestemunhos();
  const [editing, setEditing] = useState<DbTestemunho | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [form, setForm] = useState({ nome: "", mensagem: "", ativo: true, produto: "geral" });
  const [filtro, setFiltro] = useState("todos");

  const filtered = filtro === "todos" ? testemunhos : testemunhos.filter(t => (t.produto || "geral") === filtro);
  const openCreate = () => { setForm({ nome: "", mensagem: "", ativo: true, produto: "geral" }); setIsCreating(true); setEditing(null); };
  const openEdit = (t: DbTestemunho) => { setForm({ nome: t.nome, mensagem: t.mensagem, ativo: t.ativo, produto: t.produto || "geral" }); setEditing(t); setIsCreating(false); };

  const handleSave = async () => {
    if (!form.nome || !form.mensagem) return;
    // Try saving with produto field, fallback to without if column doesn't exist
    const payload: any = { nome: form.nome, mensagem: form.mensagem, ativo: form.ativo };
    try {
      payload.produto = form.produto;
      if (editing) await update(editing.id, payload);
      else await create(payload);
    } catch {
      delete payload.produto;
      if (editing) await update(editing.id, payload);
      else await create(payload);
    }
    setEditing(null); setIsCreating(false);
  };

  const showForm = isCreating || editing;
  const produtoLabel = (p: string) => PRODUTO_OPTIONS.find(o => o.value === p)?.label || p;

  if (loading) return <div className="admin-page flex items-center justify-center min-h-[400px]"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>;

  return (
    <div className="admin-page space-y-6 w-full overflow-hidden p-4 md:p-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="font-display text-2xl md:text-3xl font-bold text-[hsl(var(--dark-section-fg))]">Testemunhos</h1>
          <p className="text-sm text-[hsl(var(--dark-section-muted))] mt-1">{testemunhos.length} testemunhos cadastrados</p>
        </div>
        <Button onClick={openCreate} className="w-full sm:w-auto bg-primary text-primary-foreground hover:bg-primary/90 rounded-xl font-bold">
          <Plus className="w-4 h-4 mr-1" /> Novo Testemunho
        </Button>
      </div>

      {showForm && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4" onClick={() => { setEditing(null); setIsCreating(false); }}>
          <div className="bg-[hsl(var(--dark-section-card))] border border-[hsl(var(--dark-section-border))] rounded-2xl w-full max-w-md p-6" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-display text-lg font-bold text-[hsl(var(--dark-section-fg))]">{editing ? "Editar Testemunho" : "Novo Testemunho"}</h3>
              <button onClick={() => { setEditing(null); setIsCreating(false); }} className="text-[hsl(var(--dark-section-muted))]"><X className="w-5 h-5" /></button>
            </div>
            <div className="space-y-4">
              <div>
                <Label className="text-xs text-[hsl(var(--dark-section-muted))]">Nome</Label>
                <Input value={form.nome} onChange={e => setForm({ ...form, nome: e.target.value })} placeholder="Nome do cliente"
                  className="bg-[hsl(var(--dark-section))] border-[hsl(var(--dark-section-border))] text-[hsl(var(--dark-section-fg))] h-10 rounded-xl mt-1" />
              </div>
              <div>
                <Label className="text-xs text-[hsl(var(--dark-section-muted))]">Mensagem</Label>
                <Textarea value={form.mensagem} onChange={e => setForm({ ...form, mensagem: e.target.value })} placeholder="Depoimento do cliente"
                  className="bg-[hsl(var(--dark-section))] border-[hsl(var(--dark-section-border))] text-[hsl(var(--dark-section-fg))] rounded-xl mt-1 min-h-[80px]" />
              </div>
              <div>
                <Label className="text-xs text-[hsl(var(--dark-section-muted))]">Produto</Label>
                <select
                  value={form.produto}
                  onChange={e => setForm({ ...form, produto: e.target.value })}
                  className="w-full h-10 mt-1 px-3 rounded-xl bg-[hsl(var(--dark-section))] border border-[hsl(var(--dark-section-border))] text-[hsl(var(--dark-section-fg))] text-sm"
                >
                  {PRODUTO_OPTIONS.map(o => (
                    <option key={o.value} value={o.value}>{o.label}</option>
                  ))}
                </select>
              </div>
              <div className="flex items-center gap-2">
                <input type="checkbox" checked={form.ativo} onChange={e => setForm({ ...form, ativo: e.target.checked })} className="rounded" />
                <Label className="text-xs text-[hsl(var(--dark-section-muted))]">Ativo</Label>
              </div>
              <Button onClick={handleSave} className="w-full bg-primary text-primary-foreground hover:bg-primary/90 rounded-xl font-bold h-10">
                <Check className="w-4 h-4 mr-1" /> Salvar
              </Button>
            </div>
          </div>
        </div>
      )}

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {testemunhos.map(t => (
          <div key={t.id} className="bg-[hsl(var(--dark-section-card))] border border-[hsl(var(--dark-section-border))] rounded-2xl p-5">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <MessageSquare className="w-4 h-4 text-primary" />
                <h3 className="font-display font-bold text-[hsl(var(--dark-section-fg))]">{t.nome}</h3>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-primary/10 text-primary font-medium">
                  {produtoLabel(t.produto || "geral")}
                </span>
                {t.ativo ? <Eye className="w-4 h-4 text-emerald-400" /> : <EyeOff className="w-4 h-4 text-red-400" />}
              </div>
            </div>
            <p className="text-xs text-[hsl(var(--dark-section-muted))] mb-4 line-clamp-3">"{t.mensagem}"</p>
            <div className="flex gap-2">
              <Button size="sm" variant="ghost" onClick={() => openEdit(t)} className="text-primary hover:bg-primary/10 rounded-lg text-xs flex-1">
                <Edit2 className="w-3 h-3 mr-1" /> Editar
              </Button>
              <Button size="sm" variant="ghost" onClick={() => remove(t.id)} className="text-destructive hover:bg-destructive/10 rounded-lg text-xs">
                <Trash2 className="w-3 h-3" />
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminTestemunhos;
