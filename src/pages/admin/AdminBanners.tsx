import { useState } from "react";
import { Plus, Edit2, Trash2, X, Check, Loader2, Upload, Eye, EyeOff, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useBanners, uploadImage, type DbBanner } from "@/hooks/useSupabaseData";
import { toast } from "sonner";

const DESTAQUE_PREFIX = "★ ";

const isDestaque = (titulo: string) => titulo.startsWith(DESTAQUE_PREFIX);
const cleanTitulo = (titulo: string) => titulo.replace(DESTAQUE_PREFIX, "");

const AdminBanners = () => {
  const { banners, loading, create, update, remove } = useBanners();
  const [editing, setEditing] = useState<DbBanner | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [form, setForm] = useState({ titulo: "", imagem_url: "", ativo: true, destaque: false });

  const openCreate = () => { setForm({ titulo: "", imagem_url: "", ativo: true, destaque: false }); setIsCreating(true); setEditing(null); };
  const openEdit = (b: DbBanner) => {
    setForm({ titulo: cleanTitulo(b.titulo), imagem_url: b.imagem_url || "", ativo: b.ativo, destaque: isDestaque(b.titulo) });
    setEditing(b);
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
    if (!form.titulo) return;
    const finalTitulo = (form.destaque ? DESTAQUE_PREFIX : "") + form.titulo.trim();
    const payload = { titulo: finalTitulo, imagem_url: form.imagem_url, ativo: form.ativo };

    // Se este banner está sendo marcado como destaque, remove o destaque dos outros
    if (form.destaque) {
      const outros = banners.filter(b => b.id !== editing?.id && isDestaque(b.titulo));
      for (const b of outros) {
        await update(b.id, { titulo: cleanTitulo(b.titulo) });
      }
    }

    if (editing) await update(editing.id, payload);
    else await create(payload);

    if (form.destaque) toast.success("Banner definido como destaque principal");
    setEditing(null); setIsCreating(false);
  };

  const toggleDestaque = async (b: DbBanner) => {
    const willBeDestaque = !isDestaque(b.titulo);
    if (willBeDestaque) {
      // Remove destaque dos outros
      const outros = banners.filter(x => x.id !== b.id && isDestaque(x.titulo));
      for (const o of outros) {
        await update(o.id, { titulo: cleanTitulo(o.titulo) });
      }
      await update(b.id, { titulo: DESTAQUE_PREFIX + cleanTitulo(b.titulo) });
      toast.success("Banner definido como destaque principal");
    } else {
      await update(b.id, { titulo: cleanTitulo(b.titulo) });
      toast.success("Destaque removido");
    }
  };

  const showForm = isCreating || editing;

  if (loading) return <div className="admin-page flex items-center justify-center min-h-[400px]"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>;

  return (
    <div className="admin-page space-y-6 w-full overflow-hidden p-4 md:p-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="font-display text-2xl md:text-3xl font-bold text-[hsl(var(--dark-section-fg))]">Banners</h1>
          <p className="text-sm text-[hsl(var(--dark-section-muted))] mt-1">{banners.length} banners cadastrados • Apenas 1 pode ser destaque</p>
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

              <label className="flex items-center gap-3 p-3 rounded-xl bg-primary/5 border border-primary/20 cursor-pointer hover:bg-primary/10 transition-colors">
                <input
                  type="checkbox"
                  checked={form.destaque}
                  onChange={e => setForm({ ...form, destaque: e.target.checked })}
                  className="rounded"
                />
                <Star className={`w-4 h-4 ${form.destaque ? "text-primary fill-primary" : "text-[hsl(var(--dark-section-muted))]"}`} />
                <div className="flex-1">
                  <span className="text-sm font-bold text-[hsl(var(--dark-section-fg))]">Destaque principal</span>
                  <p className="text-[10px] text-[hsl(var(--dark-section-muted))]">Aparece em tamanho grande na seção Ofertas Especiais</p>
                </div>
              </label>

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
        {banners.map(b => {
          const destaque = isDestaque(b.titulo);
          return (
            <div
              key={b.id}
              className={`bg-[hsl(var(--dark-section-card))] border rounded-2xl overflow-hidden transition-all ${
                destaque ? "border-primary shadow-glow" : "border-[hsl(var(--dark-section-border))]"
              }`}
            >
              {b.imagem_url && (
                <div className="relative">
                  <img src={b.imagem_url} alt={cleanTitulo(b.titulo)} className="w-full h-40 object-cover" />
                  {destaque && (
                    <div className="absolute top-2 left-2 inline-flex items-center gap-1 px-2 py-1 bg-primary text-primary-foreground text-[10px] font-bold uppercase tracking-wider rounded-full shadow-glow">
                      <Star className="w-3 h-3 fill-current" /> Destaque
                    </div>
                  )}
                </div>
              )}
              <div className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-display font-bold text-[hsl(var(--dark-section-fg))] truncate">{cleanTitulo(b.titulo)}</h3>
                  {b.ativo ? <Eye className="w-4 h-4 text-emerald-400 shrink-0" /> : <EyeOff className="w-4 h-4 text-red-400 shrink-0" />}
                </div>
                <div className="flex gap-1.5">
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => toggleDestaque(b)}
                    className={`rounded-lg text-xs flex-1 ${destaque ? "text-primary bg-primary/10 hover:bg-primary/20" : "text-[hsl(var(--dark-section-muted))] hover:bg-primary/5 hover:text-primary"}`}
                    title={destaque ? "Remover destaque" : "Marcar como destaque"}
                  >
                    <Star className={`w-3 h-3 ${destaque ? "fill-current" : ""}`} />
                  </Button>
                  <Button size="sm" variant="ghost" onClick={() => openEdit(b)} className="text-primary hover:bg-primary/10 rounded-lg text-xs flex-1">
                    <Edit2 className="w-3 h-3 mr-1" /> Editar
                  </Button>
                  <Button size="sm" variant="ghost" onClick={() => remove(b.id)} className="text-destructive hover:bg-destructive/10 rounded-lg text-xs">
                    <Trash2 className="w-3 h-3" />
                  </Button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default AdminBanners;
