import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  LogOut, Plus, Pencil, Trash2, Loader2, Package, Check, X,
} from "lucide-react";
import logo from "@/assets/logo.png";
import { toast } from "sonner";

interface Item {
  id: string;
  title: string;
  created_at: string;
}

const SubscriberItems = () => {
  const { user, isAuthenticated, loading: authLoading, logout } = useAuth();
  const navigate = useNavigate();
  const [items, setItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(true);
  const [newTitle, setNewTitle] = useState("");
  const [adding, setAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState("");

  useEffect(() => {
    if (!authLoading && !isAuthenticated) navigate("/assinante", { replace: true });
  }, [isAuthenticated, authLoading, navigate]);

  const fetchItems = useCallback(async () => {
    if (!user) return;
    setLoading(true);
    const { data, error } = await supabase
      .from("items")
      .select("id, title, created_at")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false });
    if (error) {
      toast.error("Erro ao carregar itens: " + error.message);
    } else {
      setItems(data || []);
    }
    setLoading(false);
  }, [user]);

  useEffect(() => {
    if (user) fetchItems();
  }, [user, fetchItems]);

  const handleAdd = async () => {
    if (!newTitle.trim() || !user) return;
    setAdding(true);
    const { error } = await supabase
      .from("items")
      .insert({ title: newTitle.trim(), user_id: user.id });
    if (error) {
      toast.error("Erro ao adicionar: " + error.message);
    } else {
      toast.success("Item adicionado!");
      setNewTitle("");
      await fetchItems();
    }
    setAdding(false);
  };

  const handleUpdate = async (id: string) => {
    if (!editTitle.trim()) return;
    const { error } = await supabase
      .from("items")
      .update({ title: editTitle.trim() })
      .eq("id", id);
    if (error) {
      toast.error("Erro ao atualizar: " + error.message);
    } else {
      toast.success("Item atualizado!");
      setEditingId(null);
      await fetchItems();
    }
  };

  const handleDelete = async (id: string) => {
    const { error } = await supabase.from("items").delete().eq("id", id);
    if (error) {
      toast.error("Erro ao deletar: " + error.message);
    } else {
      toast.success("Item removido!");
      await fetchItems();
    }
  };

  const handleLogout = async () => {
    await logout();
    navigate("/assinante", { replace: true });
  };

  if (authLoading) {
    return (
      <div className="min-h-screen bg-[hsl(var(--dark-section))] flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
      </div>
    );
  }

  if (!isAuthenticated) return null;

  return (
    <div className="min-h-screen bg-[hsl(var(--dark-section))]">
      {/* Header */}
      <header className="bg-[hsl(var(--dark-section-card))] border-b border-[hsl(var(--dark-section-border))] sticky top-0 z-40">
        <div className="container mx-auto px-4 sm:px-5 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <a href="/"><img src={logo} alt="JD Telecom" className="h-8 brightness-0 invert" /></a>
            <span className="hidden sm:inline text-xs text-[hsl(var(--dark-section-muted))]">|</span>
            <span className="hidden sm:inline text-xs font-medium text-primary">Meus Itens</span>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" onClick={() => navigate("/assinante/dashboard")}
              className="text-[hsl(var(--dark-section-muted))] hover:text-primary rounded-xl text-xs">
              Dashboard
            </Button>
            <Button variant="ghost" size="sm" onClick={handleLogout}
              className="text-[hsl(var(--dark-section-muted))] hover:text-destructive hover:bg-destructive/10 rounded-xl">
              <LogOut className="w-4 h-4 sm:mr-1" />
              <span className="hidden sm:inline">Sair</span>
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 sm:px-5 md:px-6 py-8 max-w-2xl">
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-1">
            <Package className="w-5 h-5 text-primary" />
            <h1 className="font-display text-2xl font-bold text-[hsl(var(--dark-section-fg))]">Meus Itens</h1>
          </div>
          <p className="text-sm text-[hsl(var(--dark-section-muted))]">Gerencie seus itens no banco de dados</p>
        </div>

        {/* Add item */}
        <div className="bg-[hsl(var(--dark-section-card))] border border-[hsl(var(--dark-section-border))] rounded-2xl p-4 mb-6">
          <form onSubmit={(e) => { e.preventDefault(); handleAdd(); }} className="flex gap-2">
            <Input
              placeholder="Nome do novo item..."
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              className="bg-[hsl(var(--dark-section))] border-[hsl(var(--dark-section-border))] text-[hsl(var(--dark-section-fg))] placeholder:text-[hsl(var(--dark-section-muted))] h-11 rounded-xl flex-1"
            />
            <Button type="submit" disabled={adding || !newTitle.trim()}
              className="bg-primary text-primary-foreground hover:bg-primary/90 rounded-xl h-11 px-4 font-bold">
              {adding ? <Loader2 className="w-4 h-4 animate-spin" /> : <><Plus className="w-4 h-4 mr-1" />Adicionar</>}
            </Button>
          </form>
        </div>

        {/* Items list */}
        <div className="space-y-2">
          {loading ? (
            <div className="flex justify-center py-12">
              <Loader2 className="w-6 h-6 animate-spin text-primary" />
            </div>
          ) : items.length === 0 ? (
            <div className="text-center py-12">
              <Package className="w-12 h-12 text-[hsl(var(--dark-section-muted))] mx-auto mb-3 opacity-40" />
              <p className="text-[hsl(var(--dark-section-muted))] text-sm">Nenhum item ainda. Adicione o primeiro!</p>
            </div>
          ) : (
            items.map((item) => (
              <div key={item.id}
                className="bg-[hsl(var(--dark-section-card))] border border-[hsl(var(--dark-section-border))] rounded-xl p-4 flex items-center gap-3 group hover:border-primary/30 transition-colors">
                {editingId === item.id ? (
                  <>
                    <Input value={editTitle} onChange={(e) => setEditTitle(e.target.value)}
                      className="bg-[hsl(var(--dark-section))] border-[hsl(var(--dark-section-border))] text-[hsl(var(--dark-section-fg))] h-9 rounded-lg flex-1"
                      autoFocus onKeyDown={(e) => e.key === "Enter" && handleUpdate(item.id)} />
                    <Button size="icon" variant="ghost" onClick={() => handleUpdate(item.id)}
                      className="text-emerald-400 hover:bg-emerald-500/10 h-8 w-8 rounded-lg">
                      <Check className="w-4 h-4" />
                    </Button>
                    <Button size="icon" variant="ghost" onClick={() => setEditingId(null)}
                      className="text-[hsl(var(--dark-section-muted))] hover:bg-[hsl(var(--dark-section))] h-8 w-8 rounded-lg">
                      <X className="w-4 h-4" />
                    </Button>
                  </>
                ) : (
                  <>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-[hsl(var(--dark-section-fg))] truncate">{item.title}</p>
                      <p className="text-xs text-[hsl(var(--dark-section-muted))]">
                        {new Date(item.created_at).toLocaleDateString("pt-BR", { day: "2-digit", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" })}
                      </p>
                    </div>
                    <Button size="icon" variant="ghost"
                      onClick={() => { setEditingId(item.id); setEditTitle(item.title); }}
                      className="text-[hsl(var(--dark-section-muted))] hover:text-primary hover:bg-primary/10 h-8 w-8 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity">
                      <Pencil className="w-3.5 h-3.5" />
                    </Button>
                    <Button size="icon" variant="ghost" onClick={() => handleDelete(item.id)}
                      className="text-[hsl(var(--dark-section-muted))] hover:text-destructive hover:bg-destructive/10 h-8 w-8 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity">
                      <Trash2 className="w-3.5 h-3.5" />
                    </Button>
                  </>
                )}
              </div>
            ))
          )}
        </div>

        {items.length > 0 && (
          <p className="text-xs text-[hsl(var(--dark-section-muted))] text-center mt-6">
            {items.length} {items.length === 1 ? "item" : "itens"} no total
          </p>
        )}
      </main>
    </div>
  );
};

export default SubscriberItems;
