import { useState } from "react";
import { Plus, Edit2, Trash2, X, Check, Loader2, Upload, Eye, EyeOff, Star, Link as LinkIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useBanners, uploadImage, type DbBanner } from "@/hooks/useSupabaseData";
import { toast } from "sonner";
import {
  parseBannerTitulo,
  buildBannerTitulo,
  validateBannerLink,
} from "@/lib/bannerMeta";

const AdminBanners = () => {
  const { banners, loading, create, update, remove } = useBanners();
  const [editing, setEditing] = useState<DbBanner | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [form, setForm] = useState({
    titulo: "",
    imagem_url: "",
    ativo: true,
    destaque: false,
    link: "",
  });
  const [linkError, setLinkError] = useState<string>("");

  const openCreate = () => {
    setForm({ titulo: "", imagem_url: "", ativo: true, destaque: false, link: "" });
    setLinkError("");
    setIsCreating(true);
    setEditing(null);
  };
  const openEdit = (b: DbBanner) => {
    const meta = parseBannerTitulo(b.titulo);
    setForm({
      titulo: meta.titulo,
      imagem_url: b.imagem_url || "",
      ativo: b.ativo,
      destaque: meta.destaque,
      link: meta.link,
    });
    setLinkError("");
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

  const handleLinkChange = (val: string) => {
    setForm({ ...form, link: val });
    if (!val.trim()) {
      setLinkError("");
      return;
    }
    const result = validateBannerLink(val);
    if (result.ok) setLinkError("");
    else setLinkError(result.error);
  };

  const handleSave = async () => {
    if (!form.titulo.trim()) {
      toast.error("Informe um título");
      return;
    }
    // Valida link antes de salvar
    if (form.link.trim()) {
      const result = validateBannerLink(form.link);
      if (!result.ok) {
        setLinkError(result.error);
        toast.error(result.error);
        return;
      }
    }

    const finalTitulo = buildBannerTitulo({
      titulo: form.titulo,
      destaque: form.destaque,
      link: form.link,
    });
    const payload = { titulo: finalTitulo, imagem_url: form.imagem_url, ativo: form.ativo };

    // Se este banner está sendo marcado como destaque, remove o destaque dos outros
    if (form.destaque) {
      const outros = banners.filter((b) => b.id !== editing?.id && parseBannerTitulo(b.titulo).destaque);
      for (const b of outros) {
        const meta = parseBannerTitulo(b.titulo);
        await update(b.id, {
          titulo: buildBannerTitulo({ ...meta, destaque: false }),
        });
      }
    }

    if (editing) await update(editing.id, payload);
    else await create(payload);

    if (form.destaque) toast.success("Banner definido como destaque principal");
    setEditing(null);
    setIsCreating(false);
  };

  const toggleDestaque = async (b: DbBanner) => {
    const meta = parseBannerTitulo(b.titulo);
    const willBeDestaque = !meta.destaque;
    if (willBeDestaque) {
      const outros = banners.filter((x) => x.id !== b.id && parseBannerTitulo(x.titulo).destaque);
      for (const o of outros) {
        const om = parseBannerTitulo(o.titulo);
        await update(o.id, { titulo: buildBannerTitulo({ ...om, destaque: false }) });
      }
      await update(b.id, { titulo: buildBannerTitulo({ ...meta, destaque: true }) });
      toast.success("Banner definido como destaque principal");
    } else {
      await update(b.id, { titulo: buildBannerTitulo({ ...meta, destaque: false }) });
      toast.success("Destaque removido");
    }
  };

  const showForm = isCreating || editing;

  if (loading)
    return (
      <div className="admin-page flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );

  return (
    <div className="admin-page space-y-6 w-full overflow-hidden p-4 md:p-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="font-display text-2xl md:text-3xl font-bold text-[hsl(var(--dark-section-fg))]">Banners</h1>
          <p className="text-sm text-[hsl(var(--dark-section-muted))] mt-1">
            {banners.length} banners cadastrados • Apenas 1 pode ser destaque
          </p>
        </div>
        <Button
          onClick={openCreate}
          className="w-full sm:w-auto bg-primary text-primary-foreground hover:bg-primary/90 rounded-xl font-bold"
        >
          <Plus className="w-4 h-4 mr-1" /> Novo Banner
        </Button>
      </div>

      {showForm && (
        <div
          className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4"
          onClick={() => {
            setEditing(null);
            setIsCreating(false);
          }}
        >
          <div
            className="bg-[hsl(var(--dark-section-card))] border border-[hsl(var(--dark-section-border))] rounded-2xl w-full max-w-md p-6 max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-display text-lg font-bold text-[hsl(var(--dark-section-fg))]">
                {editing ? "Editar Banner" : "Novo Banner"}
              </h3>
              <button
                onClick={() => {
                  setEditing(null);
                  setIsCreating(false);
                }}
                className="text-[hsl(var(--dark-section-muted))]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <Label className="text-xs text-[hsl(var(--dark-section-muted))]">Título</Label>
                <Input
                  value={form.titulo}
                  onChange={(e) => setForm({ ...form, titulo: e.target.value })}
                  placeholder="Título do banner"
                  maxLength={120}
                  className="bg-[hsl(var(--dark-section))] border-[hsl(var(--dark-section-border))] text-[hsl(var(--dark-section-fg))] h-10 rounded-xl mt-1"
                />
              </div>

              <div>
                <Label className="text-xs text-[hsl(var(--dark-section-muted))] flex items-center gap-1.5">
                  <LinkIcon className="w-3 h-3" />
                  URL de destino (opcional)
                </Label>
                <Input
                  value={form.link}
                  onChange={(e) => handleLinkChange(e.target.value)}
                  placeholder="https://... ou /pagina ou #secao"
                  maxLength={500}
                  className={`bg-[hsl(var(--dark-section))] text-[hsl(var(--dark-section-fg))] h-10 rounded-xl mt-1 ${
                    linkError ? "border-destructive" : "border-[hsl(var(--dark-section-border))]"
                  }`}
                />
                {linkError ? (
                  <p className="text-[10px] text-destructive mt-1">{linkError}</p>
                ) : (
                  <p className="text-[10px] text-[hsl(var(--dark-section-muted))] mt-1">
                    Para onde o botão "Aproveitar" leva. Vazio = vai para #planos
                  </p>
                )}
              </div>

              <div>
                <Label className="text-xs text-[hsl(var(--dark-section-muted))]">Imagem</Label>
                <div className="flex gap-2 mt-1">
                  <Input
                    value={form.imagem_url}
                    onChange={(e) => setForm({ ...form, imagem_url: e.target.value })}
                    placeholder="URL da imagem"
                    className="bg-[hsl(var(--dark-section))] border-[hsl(var(--dark-section-border))] text-[hsl(var(--dark-section-fg))] h-10 rounded-xl flex-1"
                  />
                  <label className="flex items-center gap-1 px-3 h-10 rounded-xl bg-primary/10 text-primary text-xs font-bold cursor-pointer hover:bg-primary/20">
                    {uploading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />}
                    <input type="file" accept="image/*" className="hidden" onChange={handleUpload} />
                  </label>
                </div>
                {form.imagem_url && (
                  <img src={form.imagem_url} alt="" className="mt-2 h-20 rounded-lg object-cover w-full" />
                )}
              </div>

              <label className="flex items-center gap-3 p-3 rounded-xl bg-primary/5 border border-primary/20 cursor-pointer hover:bg-primary/10 transition-colors">
                <input
                  type="checkbox"
                  checked={form.destaque}
                  onChange={(e) => setForm({ ...form, destaque: e.target.checked })}
                  className="rounded"
                />
                <Star className={`w-4 h-4 ${form.destaque ? "text-primary fill-primary" : "text-[hsl(var(--dark-section-muted))]"}`} />
                <div className="flex-1">
                  <span className="text-sm font-bold text-[hsl(var(--dark-section-fg))]">Destaque principal</span>
                  <p className="text-[10px] text-[hsl(var(--dark-section-muted))]">
                    Aparece em tamanho grande na seção Ofertas Especiais
                  </p>
                </div>
              </label>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={form.ativo}
                  onChange={(e) => setForm({ ...form, ativo: e.target.checked })}
                  className="rounded"
                />
                <Label className="text-xs text-[hsl(var(--dark-section-muted))]">Ativo</Label>
              </div>
              <Button
                onClick={handleSave}
                disabled={!!linkError}
                className="w-full bg-primary text-primary-foreground hover:bg-primary/90 rounded-xl font-bold h-10 disabled:opacity-50"
              >
                <Check className="w-4 h-4 mr-1" /> Salvar
              </Button>
            </div>
          </div>
        </div>
      )}

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {banners.map((b) => {
          const meta = parseBannerTitulo(b.titulo);
          return (
            <div
              key={b.id}
              className={`bg-[hsl(var(--dark-section-card))] border rounded-2xl overflow-hidden transition-all ${
                meta.destaque ? "border-primary shadow-glow" : "border-[hsl(var(--dark-section-border))]"
              }`}
            >
              {b.imagem_url && (
                <div className="relative">
                  <img src={b.imagem_url} alt={meta.titulo} className="w-full h-40 object-cover" />
                  {meta.destaque && (
                    <div className="absolute top-2 left-2 inline-flex items-center gap-1 px-2 py-1 bg-primary text-primary-foreground text-[10px] font-bold uppercase tracking-wider rounded-full shadow-glow">
                      <Star className="w-3 h-3 fill-current" /> Destaque
                    </div>
                  )}
                </div>
              )}
              <div className="p-4">
                <div className="flex items-center justify-between mb-1">
                  <h3 className="font-display font-bold text-[hsl(var(--dark-section-fg))] truncate">{meta.titulo}</h3>
                  {b.ativo ? (
                    <Eye className="w-4 h-4 text-emerald-400 shrink-0" />
                  ) : (
                    <EyeOff className="w-4 h-4 text-red-400 shrink-0" />
                  )}
                </div>
                {meta.link && (
                  <p className="text-[10px] text-[hsl(var(--dark-section-muted))] truncate mb-2 flex items-center gap-1">
                    <LinkIcon className="w-3 h-3 shrink-0" />
                    <span className="truncate">{meta.link}</span>
                  </p>
                )}
                <div className="flex gap-1.5 mt-2">
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => toggleDestaque(b)}
                    className={`rounded-lg text-xs flex-1 ${meta.destaque ? "text-primary bg-primary/10 hover:bg-primary/20" : "text-[hsl(var(--dark-section-muted))] hover:bg-primary/5 hover:text-primary"}`}
                    title={meta.destaque ? "Remover destaque" : "Marcar como destaque"}
                  >
                    <Star className={`w-3 h-3 ${meta.destaque ? "fill-current" : ""}`} />
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => openEdit(b)}
                    className="text-primary hover:bg-primary/10 rounded-lg text-xs flex-1"
                  >
                    <Edit2 className="w-3 h-3 mr-1" /> Editar
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => remove(b.id)}
                    className="text-destructive hover:bg-destructive/10 rounded-lg text-xs"
                  >
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
