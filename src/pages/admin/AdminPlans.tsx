import { useState } from "react";
import { Plus, Edit2, Trash2, X, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { mockPlans, type Plan } from "@/data/adminMockData";

const AdminPlans = () => {
  const [plans, setPlans] = useState<Plan[]>(mockPlans);
  const [editingPlan, setEditingPlan] = useState<Plan | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [form, setForm] = useState({ name: "", speed: "", price: "", benefits: "" });

  const openCreate = () => {
    setForm({ name: "", speed: "", price: "", benefits: "" });
    setIsCreating(true);
    setEditingPlan(null);
  };

  const openEdit = (plan: Plan) => {
    setForm({ name: plan.name, speed: plan.speed, price: plan.price.toString(), benefits: plan.benefits.join(", ") });
    setEditingPlan(plan);
    setIsCreating(false);
  };

  const handleSave = () => {
    if (!form.name || !form.speed || !form.price) return;
    const planData: Plan = {
      id: editingPlan?.id || `plan-${Date.now()}`,
      name: form.name,
      speed: form.speed,
      price: parseFloat(form.price),
      benefits: form.benefits.split(",").map((b) => b.trim()).filter(Boolean),
      activeClients: editingPlan?.activeClients || 0,
    };
    if (editingPlan) {
      setPlans(plans.map((p) => p.id === editingPlan.id ? planData : p));
    } else {
      setPlans([...plans, planData]);
    }
    setEditingPlan(null);
    setIsCreating(false);
  };

  const handleDelete = (id: string) => {
    setPlans(plans.filter((p) => p.id !== id));
  };

  const showForm = isCreating || editingPlan;

  return (
    <div className="p-4 md:p-6 lg:p-8 pt-12 md:pt-6 space-y-6 max-w-[1400px] w-full overflow-hidden mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="font-display text-2xl md:text-3xl font-bold text-[hsl(var(--dark-section-fg))]">Planos</h1>
          <p className="text-sm text-[hsl(var(--dark-section-muted))] mt-1">{plans.length} planos cadastrados</p>
        </div>
        <Button onClick={openCreate} className="w-full sm:w-auto bg-primary text-primary-foreground hover:bg-primary/90 rounded-xl font-bold">
          <Plus className="w-4 h-4 mr-1" /> Novo Plano
        </Button>
      </div>

      {/* Plan form modal */}
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
              <div className="grid grid-cols-2 gap-3">
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

      {/* Plans grid */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {plans.map((plan) => (
          <div key={plan.id} className="bg-[hsl(var(--dark-section-card))] border border-[hsl(var(--dark-section-border))] rounded-2xl p-5">
            <div className="flex items-start justify-between mb-3">
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
            <p className="text-xs text-[hsl(var(--dark-section-muted))] mb-3">{plan.activeClients} clientes ativos</p>
            <div className="flex gap-2">
              <Button size="sm" variant="ghost" onClick={() => openEdit(plan)} className="text-primary hover:bg-primary/10 rounded-lg text-xs flex-1">
                <Edit2 className="w-3 h-3 mr-1" /> Editar
              </Button>
              <Button size="sm" variant="ghost" onClick={() => handleDelete(plan.id)} className="text-destructive hover:bg-destructive/10 rounded-lg text-xs">
                <Trash2 className="w-3 h-3" />
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminPlans;
