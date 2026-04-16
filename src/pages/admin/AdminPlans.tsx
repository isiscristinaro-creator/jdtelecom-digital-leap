import { useState } from "react";
import { Plus, Edit2, Trash2, X, Check, Loader2, GripVertical } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { usePlans, type DbPlan } from "@/hooks/useSupabaseData";
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

interface SortablePlanProps {
  plan: DbPlan;
  children: React.ReactNode;
}

const SortablePlan = ({ plan, children }: SortablePlanProps) => {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: plan.id,
  });
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

const AdminPlans = () => {
  const { plans, loading, create, update, remove, reorder } = usePlans();
  const [editingPlan, setEditingPlan] = useState<DbPlan | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [form, setForm] = useState({ name: "", speed: "", price: "", benefits: "" });

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 6 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  const handleDragEnd = (e: DragEndEvent) => {
    const { active, over } = e;
    if (!over || active.id === over.id) return;
    const oldIndex = plans.findIndex((p) => p.id === active.id);
    const newIndex = plans.findIndex((p) => p.id === over.id);
    if (oldIndex < 0 || newIndex < 0) return;
    const newOrder = arrayMove(plans, oldIndex, newIndex).map((p) => p.id);
    reorder(newOrder);
  };

  const openCreate = () => {
    setForm({ name: "", speed: "", price: "", benefits: "" });
    setIsCreating(true);
    setEditingPlan(null);
  };

  const openEdit = (plan: DbPlan) => {
    setForm({ name: plan.name, speed: plan.speed, price: plan.price.toString(), benefits: plan.benefits.join(", ") });
    setEditingPlan(plan);
    setIsCreating(false);
  };

  const handleSave = async () => {
    if (!form.name || !form.speed || !form.price) return;
    const benefits = form.benefits.split(",").map(b => b.trim()).filter(Boolean);
    if (editingPlan) {
      await update(editingPlan.id, { name: form.name, speed: form.speed, price: parseFloat(form.price), benefits });
    } else {
      await create({ name: form.name, speed: form.speed, price: parseFloat(form.price), benefits });
    }
    setEditingPlan(null);
    setIsCreating(false);
  };

  const handleDelete = async (id: string) => {
    await remove(id);
  };

  const showForm = isCreating || editingPlan;

  if (loading) {
    return (
      <div className="admin-page flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="admin-page space-y-6 w-full overflow-hidden">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="font-display text-2xl md:text-3xl font-bold text-[hsl(var(--dark-section-fg))]">Planos</h1>
          <p className="text-sm text-[hsl(var(--dark-section-muted))] mt-1">
            {plans.length} planos cadastrados • Arraste pelo ícone <GripVertical className="inline w-3 h-3 align-text-top" /> para reordenar
          </p>
        </div>
        <Button onClick={openCreate} className="w-full sm:w-auto bg-primary text-primary-foreground hover:bg-primary/90 rounded-xl font-bold">
          <Plus className="w-4 h-4 mr-1" /> Novo Plano
        </Button>
      </div>

      {showForm && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4" onClick={() => { setEditingPlan(null); setIsCreating(false); }}>
          <div className="bg-[hsl(var(--dark-section-card))] border border-[hsl(var(--dark-section-border))] rounded-2xl w-full max-w-md p-6" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-display text-lg font-bold text-[hsl(var(--dark-section-fg))]">{editingPlan ? "Editar Plano" : "Novo Plano"}</h3>
              <button onClick={() => { setEditingPlan(null); setIsCreating(false); }} className="text-[hsl(var(--dark-section-muted))]"><X className="w-5 h-5" /></button>
            </div>
            <div className="space-y-4">
              <div>
                <Label className="text-xs text-[hsl(var(--dark-section-muted))]">Nome do Plano</Label>
                <Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Ex: Turbo Fibra 500"
                  className="bg-[hsl(var(--dark-section))] border-[hsl(var(--dark-section-border))] text-[hsl(var(--dark-section-fg))] h-10 rounded-xl mt-1" />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <Label className="text-xs text-[hsl(var(--dark-section-muted))]">Velocidade</Label>
                  <Input value={form.speed} onChange={(e) => setForm({ ...form, speed: e.target.value })} placeholder="Ex: 500MB"
                    className="bg-[hsl(var(--dark-section))] border-[hsl(var(--dark-section-border))] text-[hsl(var(--dark-section-fg))] h-10 rounded-xl mt-1" />
                </div>
                <div>
                  <Label className="text-xs text-[hsl(var(--dark-section-muted))]">Preço (R$)</Label>
                  <Input type="number" step="0.01" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} placeholder="179.90"
                    className="bg-[hsl(var(--dark-section))] border-[hsl(var(--dark-section-border))] text-[hsl(var(--dark-section-fg))] h-10 rounded-xl mt-1" />
                </div>
              </div>
              <div>
                <Label className="text-xs text-[hsl(var(--dark-section-muted))]">Benefícios (separados por vírgula)</Label>
                <Input value={form.benefits} onChange={(e) => setForm({ ...form, benefits: e.target.value })} placeholder="Internet Fibra, TV PLUS, Suporte 24/7"
                  className="bg-[hsl(var(--dark-section))] border-[hsl(var(--dark-section-border))] text-[hsl(var(--dark-section-fg))] h-10 rounded-xl mt-1" />
              </div>
              <Button onClick={handleSave} className="w-full bg-primary text-primary-foreground hover:bg-primary/90 rounded-xl font-bold h-10">
                <Check className="w-4 h-4 mr-1" /> Salvar
              </Button>
            </div>
          </div>
        </div>
      )}

      <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        <SortableContext items={plans.map((p) => p.id)} strategy={rectSortingStrategy}>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {plans.map((plan) => (
              <SortablePlan key={plan.id} plan={plan}>
                <div className="bg-[hsl(var(--dark-section-card))] border border-[hsl(var(--dark-section-border))] rounded-2xl p-5">
                  <div className="flex items-start justify-between mb-3 pr-10">
                    <div>
                      <h3 className="font-display font-bold text-[hsl(var(--dark-section-fg))]">{plan.name}</h3>
                      <p className="text-xs text-[hsl(var(--dark-section-muted))]">{plan.speed}</p>
                    </div>
                    <p className="font-display text-xl font-extrabold text-primary">R$ {plan.price.toFixed(2)}</p>
                  </div>
                  <div className="space-y-1 mb-4">
                    {plan.benefits.map((b) => (
                      <p key={b} className="text-xs text-[hsl(var(--dark-section-muted))] flex items-center gap-1.5">
                        <Check className="w-3 h-3 text-primary" /> {b}
                      </p>
                    ))}
                  </div>
                  <p className="text-xs text-[hsl(var(--dark-section-muted))] mb-3">{plan.active_clients} clientes ativos</p>
                  <div className="flex gap-2">
                    <Button size="sm" variant="ghost" onClick={() => openEdit(plan)} className="text-primary hover:bg-primary/10 rounded-lg text-xs flex-1">
                      <Edit2 className="w-3 h-3 mr-1" /> Editar
                    </Button>
                    <Button size="sm" variant="ghost" onClick={() => handleDelete(plan.id)} className="text-destructive hover:bg-destructive/10 rounded-lg text-xs">
                      <Trash2 className="w-3 h-3" />
                    </Button>
                  </div>
                </div>
              </SortablePlan>
            ))}
          </div>
        </SortableContext>
      </DndContext>
    </div>
  );
};

export default AdminPlans;
