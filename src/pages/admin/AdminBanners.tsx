import { useState } from "react";
import { Plus, Edit2, Trash2, X, Check, Loader2, Upload, Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useBanners, uploadImage, type DbBanner } from "@/hooks/useSupabaseData";

const AdminBanners = () => {
  const { banners, loading, create, update, remove } = useBanners();
  const [editing, setEditing] = useState<DbBanner | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [form, setForm] = useState({ titulo: "", imagem_url: "", ativo: true });

  const openCreate = () => { setForm({ titulo: "", imagem_url: "", ativo: true }); setIsCreating(true); setEditing(null); };
  const openEdit = (b: DbBanner) => { setForm({ titulo: b.titulo, imagem_url: b.imagem_url || "", ativo: b.ativo }); setEditing(b); setIsCreating(false); };

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    const url = await uploadImage("imagens", file);
    if (url) setForm({ ...form, imagem_url: url });
    setUploading(false);
  };

  const handleSave = async () => {
    if (!form.titulo) return;
    if (editing) await update(editing.id, form);
    else await create(form);
    setEditing(null); setIsCreating(false);
  };

  const showForm = isCreating || editing;

  if (loading) return <div className="admin-page flex items-center justify-center min-h-[400px]"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>;

  return (
    <div className="admin-page space-y-6 w-full overflow-hidden p-4 md:p-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="font-display text-2xl md:text-3xl font-bold text-[hsl(var(--dark-section-fg))]">Banners</h1>
          <p className="text-sm text-[hsl(var(--dark-section-muted))] mt-1">{banners.length} banners cadastrados</p>
        </div>
        <Button onClick={openCreate} className="w-full sm:w-auto bg-primary text-primary-foreground hover:bg-primary/90 rounded-xl font-bold">
          <Plus className="w-4 h-4 mr-1" /> Novo Banner
        </Button>
      </div>

      {showForm && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4" onClick={() => { setEditing(null); setIsCreating(false); }}>
          <div className="bg-[hsl(var(--dark-section-card))] border border-[hsl(var(--dark-section-border))] rounded-2xl w-full max-w-md p-6" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-display text-lg font-bold text-[hsl(var(--dark-section-fg))]">{editing ? "Editar Banner" : "Novo Banner"}</h3>
              <button onClick={() => { setEditing(null); setIsCreating(false); }} className="text-[hsl(var(--dark-section-muted))]"><X className="w-5 h-5" /></button>
            </div>
            <div className="space-y-4">
              <div>
                <Label className="text-xs text-[hsl(var(--dark-section-muted))]">Título</Label>
                <Input value={form.titulo} onChange={e => setForm({ ...form, titulo: e.target.value })} placeholder="Título do banner"
                  className="bg-[hsl(var(--dark-section))] border-[hsl(var(--dark-section-border))] text-[hsl(var(--dark-section-fg))] h-10 rounded-xl mt-1" />
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
                {form.imagem_url && <img src={form.imagem_url} alt="" className="mt-2 h-20 rounded-lg object-cover w-full" />}
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
        {banners.map(b => (
          <div key={b.id} className="bg-[hsl(var(--dark-section-card))] border border-[hsl(var(--dark-section-border))] rounded-2xl overflow-hidden">
            {b.imagem_url && <img src={b.imagem_url} alt={b.titulo} className="w-full h-40 object-cover" />}
            <div className="p-4">
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-display font-bold text-[hsl(var(--dark-section-fg))]">{b.titulo}</h3>
                {b.ativo ? <Eye className="w-4 h-4 text-emerald-400" /> : <EyeOff className="w-4 h-4 text-red-400" />}
              </div>
              <div className="flex gap-2">
                <Button size="sm" variant="ghost" onClick={() => openEdit(b)} className="text-primary hover:bg-primary/10 rounded-lg text-xs flex-1">
                  <Edit2 className="w-3 h-3 mr-1" /> Editar
                </Button>
                <Button size="sm" variant="ghost" onClick={() => remove(b.id)} className="text-destructive hover:bg-destructive/10 rounded-lg text-xs">
                  <Trash2 className="w-3 h-3" />
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminBanners;