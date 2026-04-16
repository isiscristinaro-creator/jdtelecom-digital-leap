import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import type { DbBanner } from "./types";

export function useBanners() {
  const [banners, setBanners] = useState<DbBanner[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchData = useCallback(async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("banners")
      .select("*")
      .order("ordem", { ascending: true, nullsFirst: false })
      .order("created_at", { ascending: false });
    if (error) toast.error("Erro ao carregar banners: " + error.message);
    else setBanners(data || []);
    setLoading(false);
  }, []);

  useEffect(() => { fetchData(); }, [fetchData]);

  const create = async (b: Omit<DbBanner, "id" | "created_at">) => {
    const { error } = await supabase.from("banners").insert(b);
    if (error) { toast.error(error.message); return false; }
    toast.success("Banner criado!"); await fetchData(); return true;
  };

  const update = async (id: string, data: Partial<DbBanner>) => {
    const { error } = await supabase.from("banners").update(data).eq("id", id);
    if (error) { toast.error(error.message); return false; }
    toast.success("Banner atualizado!"); await fetchData(); return true;
  };

  const remove = async (id: string) => {
    const { error } = await supabase.from("banners").delete().eq("id", id);
    if (error) { toast.error(error.message); return false; }
    toast.success("Banner removido!"); await fetchData(); return true;
  };

  /**
   * Persiste a nova ordem na coluna dedicada `ordem` (inteiro asc).
   */
  const reorder = async (orderedIds: string[]) => {
    if (orderedIds.length === 0) return true;
    setBanners((prev) => {
      const map = new Map(prev.map((b) => [b.id, b]));
      return orderedIds.map((id) => map.get(id)).filter(Boolean) as DbBanner[];
    });
    const updates = orderedIds.map((id, idx) =>
      supabase.from("banners").update({ ordem: idx } as any).eq("id", id)
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

  return { banners, loading, refetch: fetchData, create, update, remove, reorder };
}
