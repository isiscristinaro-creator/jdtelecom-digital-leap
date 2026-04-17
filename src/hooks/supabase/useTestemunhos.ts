import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import type { DbTestemunho } from "./types";

export function useTestemunhos() {
  const [testemunhos, setTestemunhos] = useState<DbTestemunho[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchData = useCallback(async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("testemunhos")
      .select("*")
      .order("ordem", { ascending: true, nullsFirst: false })
      .order("created_at", { ascending: false });
    if (error) toast.error("Erro ao carregar testemunhos: " + error.message);
    else setTestemunhos(data || []);
    setLoading(false);
  }, []);

  useEffect(() => { fetchData(); }, [fetchData]);

  const create = async (t: Omit<DbTestemunho, "id" | "created_at">) => {
    const { error } = await supabase.from("testemunhos").insert(t);
    if (error) { toast.error(error.message); return false; }
    toast.success("Testemunho criado!"); await fetchData(); return true;
  };

  const update = async (id: string, data: Partial<DbTestemunho>) => {
    const { error } = await supabase.from("testemunhos").update(data).eq("id", id);
    if (error) { toast.error(error.message); return false; }
    toast.success("Testemunho atualizado!"); await fetchData(); return true;
  };

  const remove = async (id: string) => {
    const { error } = await supabase.from("testemunhos").delete().eq("id", id);
    if (error) { toast.error(error.message); return false; }
    toast.success("Testemunho removido!"); await fetchData(); return true;
  };

  const reorder = async (orderedIds: string[]) => {
    if (orderedIds.length === 0) return true;
    setTestemunhos((prev) => {
      const map = new Map(prev.map((t) => [t.id, t]));
      return orderedIds.map((id) => map.get(id)).filter(Boolean) as DbTestemunho[];
    });
    const updates = orderedIds.map((id, idx) =>
      supabase.from("testemunhos").update({ ordem: idx }).eq("id", id)
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

  return { testemunhos, loading, refetch: fetchData, create, update, remove, reorder };
}