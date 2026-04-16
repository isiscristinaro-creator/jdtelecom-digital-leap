import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import type { DbProduto } from "./types";

export function useProdutos() {
  const [produtos, setProdutos] = useState<DbProduto[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchData = useCallback(async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("produtos")
      .select("*")
      .order("ordem", { ascending: true, nullsFirst: false })
      .order("created_at", { ascending: false });
    if (error) toast.error("Erro ao carregar produtos: " + error.message);
    else setProdutos(data || []);
    setLoading(false);
  }, []);

  useEffect(() => { fetchData(); }, [fetchData]);

  const create = async (p: Omit<DbProduto, "id" | "created_at">) => {
    const { error } = await supabase.from("produtos").insert(p);
    if (error) { toast.error(error.message); return false; }
    toast.success("Produto criado!"); await fetchData(); return true;
  };

  const update = async (id: string, data: Partial<DbProduto>) => {
    const { error } = await supabase.from("produtos").update(data).eq("id", id);
    if (error) { toast.error(error.message); return false; }
    toast.success("Produto atualizado!"); await fetchData(); return true;
  };

  const remove = async (id: string) => {
    const { error } = await supabase.from("produtos").delete().eq("id", id);
    if (error) { toast.error(error.message); return false; }
    toast.success("Produto removido!"); await fetchData(); return true;
  };

  /**
   * Persiste a nova ordem na coluna dedicada `ordem` (inteiro asc).
   */
  const reorder = async (orderedIds: string[]) => {
    if (orderedIds.length === 0) return true;
    setProdutos((prev) => {
      const map = new Map(prev.map((p) => [p.id, p]));
      return orderedIds.map((id) => map.get(id)).filter(Boolean) as DbProduto[];
    });
    const updates = orderedIds.map((id, idx) =>
      supabase.from("produtos").update({ ordem: idx } as any).eq("id", id)
    );
    const results = await Promise.all(updates);
    const firstError = results.find((r) => r.error)?.error;
    if (firstError) {
      toast.error("Erro ao reordenar: " + firstError.message);
      await fetchData();
      return false;
    }
    return true;
  };

  return { produtos, loading, refetch: fetchData, create, update, remove, reorder };
}
