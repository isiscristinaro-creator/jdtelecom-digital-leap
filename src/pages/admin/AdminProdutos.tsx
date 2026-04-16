import { useState } from "react";
import { Plus, Edit2, Trash2, X, Check, Loader2, Upload, Eye, EyeOff, GripVertical } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useProdutos, uploadImage, type DbProduto } from "@/hooks/useSupabaseData";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core";
import {
  SortableContext,
  arrayMove,
  rectSortingStrategy,
  sortableKeyboardCoordinates,
  useSortable,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

interface SortableProdutoProps {
  p: DbProduto;
  children: React.ReactNode;
}

const SortableProduto = ({ p, children }: SortableProdutoProps) => {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: p.id });
  const style: React.CSSProperties = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
    zIndex: isDragging ? 50 : "auto",
  };
  return (
    <div ref={setNodeRef} style={style} className="relative">
      <button
        type="button"
        {...attributes}
        {...listeners}
        aria-label="Arrastar para reordenar"
        className="absolute top-2 right-2 z-10 p-1.5 rounded-lg bg-[hsl(var(--dark-section))]/80 backdrop-blur-sm border border-[hsl(var(--dark-section-border))] text-[hsl(var(--dark-section-muted))] hover:text-primary hover:border-primary/40 cursor-grab active:cursor-grabbing transition-colors"
      >
        <GripVertical className="w-4 h-4" />
      </button>
      {children}
    </div>
  );
};

const AdminProdutos = () => {
  const { produtos, loading, create, update, remove, reorder } = useProdutos();
  const [editing, setEditing] = useState<DbProduto | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [form, setForm] = useState({ nome: "", descricao: "", preco: "", categoria: "", imagem_url: "", ativo: true });

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 6 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  const handleDragEnd = (e: DragEndEvent) => {
    const { active, over } = e;
    if (!over || active.id === over.id) return;
    const oldIndex = produtos.findIndex(p => p.id === active.id);
    const newIndex = produtos.findIndex(p => p.id === over.id);
    if (oldIndex < 0 || newIndex < 0) return;
    const newOrder = arrayMove(produtos, oldIndex, newIndex).map(p => p.id);
    reorder(newOrder);
  };

  const openCreate = () => {
    setForm({ nome: "", descricao: "", preco: "", categoria: "", imagem_url: "", ativo: true });
    setIsCreating(true);
    setEditing(null);
  };

  const openEdit = (p: DbProduto) => {
    setForm({ nome: p.nome, descricao: p.descricao || "", preco: p.preco.toString(), categoria: p.categoria || "", imagem_url: p.imagem_url || "", ativo: p.ativo });
    setEditing(p);
    setIsCreating(false);
  };

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    const url = await uploadImage("imagens", file);
    if (url) setForm({ ...form, imagem_url: url });
    setUploading(false);
  };

  const handleSave = async () => {
    if (!form.nome || !form.preco) return;
    const payload = { nome: form.nome, descricao: form.descricao, preco: parseFloat(form.preco), categoria: form.categoria, imagem_url: form.imagem_url, ativo: form.ativo };
    if (editing) await update(editing.id, payload);
    else await create(payload);
    setEditing(null);
    setIsCreating(false);
  };

  const showForm = isCreating || editing;

  if (loading) return <div className="admin-page flex items-center justify-center min-h-[400px]"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>;

  return (
    <div className="admin-page space-y-6 w-full overflow-hidden p-4 md:p-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="font-display text-2xl md:text-3xl font-bold text-[hsl(var(--dark-section-fg))]">Produtos</h1>
          <p className="text-sm text-[hsl(var(--dark-section-muted))] mt-1">
            {produtos.length} produtos cadastrados • Arraste pelo ícone <GripVertical className="inline w-3 h-3 align-text-top" /> para reordenar
          </p>
        </div>
        <Button onClick={openCreate} className="w-full sm:w-auto bg-primary text-primary-foreground hover:bg-primary/90 rounded-xl font-bold">
          <Plus className="w-4 h-4 mr-1" /> Novo Produto
        </Button>
      </div>

      {showForm && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4" onClick={() => { setEditing(null); setIsCreating(false); }}>
          <div className="bg-[hsl(var(--dark-section-card))] border border-[hsl(var(--dark-section-border))] rounded-2xl w-full max-w-md p-6 max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-display text-lg font-bold text-[hsl(var(--dark-section-fg))]">{editing ? "Editar Produto" : "Novo Produto"}</h3>
              <button onClick={() => { setEditing(null); setIsCreating(false); }} className="text-[hsl(var(--dark-section-muted))]"><X className="w-5 h-5" /></button>
            </div>
            <div className="space-y-4">
              <div>
                <Label className="text-xs text-[hsl(var(--dark-section-muted))]">Nome</Label>
                <Input value={form.nome} onChange={e => setForm({ ...form, nome: e.target.value })} placeholder="Nome do produto"
                  className="bg-[hsl(var(--dark-section))] border-[hsl(var(--dark-section-border))] text-[hsl(var(--dark-section-fg))] h-10 rounded-xl mt-1" />
              </div>
              <div>
                <Label className="text-xs text-[hsl(var(--dark-section-muted))]">Descrição</Label>
                <Input value={form.descricao} onChange={e => setForm({ ...form, descricao: e.target.value })} placeholder="Descrição"
                  className="bg-[hsl(var(--dark-section))] border-[hsl(var(--dark-section-border))] text-[hsl(var(--dark-section-fg))] h-10 rounded-xl mt-1" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label className="text-xs text-[hsl(var(--dark-section-muted))]">Preço (R$)</Label>
                  <Input type="number" step="0.01" value={form.preco} onChange={e => setForm({ ...form, preco: e.target.value })} placeholder="99.90"
                    className="bg-[hsl(var(--dark-section))] border-[hsl(var(--dark-section-border))] text-[hsl(var(--dark-section-fg))] h-10 rounded-xl mt-1" />
                </div>
                <div>
                  <Label className="text-xs text-[hsl(var(--dark-section-muted))]">Categoria</Label>
                  <Input value={form.categoria} onChange={e => setForm({ ...form, categoria: e.target.value })} placeholder="Ex: Internet"
                    className="bg-[hsl(var(--dark-section))] border-[hsl(var(--dark-section-border))] text-[hsl(var(--dark-section-fg))] h-10 rounded-xl mt-1" />
                </div>
              </div>
              <div>
                <Label className="text-xs text-[hsl(var(--dark-section-muted))]">Imagem</Label>
                <div className="flex gap-2 mt-1">
                  <Input value={form.imagem_url} onChange={e => setForm({ ...form, imagem_url: e.target.value })} placeholder="URL da imagem"
                    className="bg-[hsl(var(--dark-section))] border-[hsl(var(--dark-section-border))] text-[hsl(var(--dark-section-fg))] h-10 rounded-xl flex-1" />
                  <label className="flex items-center gap-1 px-3 h-10 rounded-xl bg-primary/10 text-primary text-xs font-bold cursor-pointer hover:bg-primary/20">
                    {uploading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />}
                    <input type="file" accept="image/*" className="hidden" onChange={handleUpload} />
                  </label>
                </div>
                {form.imagem_url && <img src={form.imagem_url} alt="" className="mt-2 h-20 rounded-lg object-cover" />}
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

      <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        <SortableContext items={produtos.map(p => p.id)} strategy={rectSortingStrategy}>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {produtos.map(p => (
              <SortableProduto key={p.id} p={p}>
                <div className="bg-[hsl(var(--dark-section-card))] border border-[hsl(var(--dark-section-border))] rounded-2xl p-5">
                  {p.imagem_url && <img src={p.imagem_url} alt={p.nome} className="w-full h-32 object-cover rounded-xl mb-3" />}
                  <div className="flex items-start justify-between mb-2 pr-10">
                    <div>
                      <h3 className="font-display font-bold text-[hsl(var(--dark-section-fg))]">{p.nome}</h3>
                      <p className="text-xs text-[hsl(var(--dark-section-muted))]">{p.categoria}</p>
                    </div>
                    <div className="flex items-center gap-1">
                      {p.ativo ? <Eye className="w-3 h-3 text-emerald-400" /> : <EyeOff className="w-3 h-3 text-red-400" />}
                      <p className="font-display text-lg font-extrabold text-primary">R$ {p.preco.toFixed(2)}</p>
                    </div>
                  </div>
                  {p.descricao && <p className="text-xs text-[hsl(var(--dark-section-muted))] mb-3 line-clamp-2">{p.descricao}</p>}
                  <div className="flex gap-2">
                    <Button size="sm" variant="ghost" onClick={() => openEdit(p)} className="text-primary hover:bg-primary/10 rounded-lg text-xs flex-1">
                      <Edit2 className="w-3 h-3 mr-1" /> Editar
                    </Button>
                    <Button size="sm" variant="ghost" onClick={() => remove(p.id)} className="text-destructive hover:bg-destructive/10 rounded-lg text-xs">
                      <Trash2 className="w-3 h-3" />
                    </Button>
                  </div>
                </div>
              </SortableProduto>
            ))}
          </div>
        </SortableContext>
      </DndContext>
    </div>
  );
};

export default AdminProdutos;
