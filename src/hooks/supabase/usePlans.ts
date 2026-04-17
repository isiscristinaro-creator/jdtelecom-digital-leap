import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import type { DbPlan } from "./types";

export function usePlans() {
  const [plans, setPlans] = useState<DbPlan[]>([]);
  const [loading, setLoading] = useState(true);

  const fetch = useCallback(async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("plans")
      .select("*")
      .order("ordem", { ascending: true, nullsFirst: false })
      .order("created_at", { ascending: false });
    if (error) toast.error("Erro ao carregar planos: " + error.message);
    else setPlans(data || []);
    setLoading(false);
  }, []);

  useEffect(() => { fetch(); }, [fetch]);

  const create = async (plan: Omit<DbPlan, "id" | "created_at" | "active_clients">) => {
    const { error } = await supabase.from("plans").insert(plan);
    if (error) { toast.error(error.message); return false; }
    toast.success("Plano criado!"); await fetch(); return true;
  };

  const update = async (id: string, data: Partial<DbPlan>) => {
    const { error } = await supabase.from("plans").update(data).eq("id", id);
    if (error) { toast.error(error.message); return false; }
    toast.success("Plano atualizado!"); await fetch(); return true;
  };

  const remove = async (id: string) => {
    const { error } = await supabase.from("plans").delete().eq("id", id);
    if (error) { toast.error(error.message); return false; }
    toast.success("Plano removido!"); await fetch(); return true;
  };

  const reorder = async (orderedIds: string[]) => {
    if (orderedIds.length === 0) return true;
    setPlans((prev) => {
      const map = new Map(prev.map((p) => [p.id, p]));
      return orderedIds.map((id) => map.get(id)).filter(Boolean) as DbPlan[];
    });
    const updates = orderedIds.map((id, idx) =>
      supabase.from("plans").update({ ordem: idx }).eq("id", id)
    );
    const results = await Promise.all(updates);
    const firstError = results.find((r) => r.error)?.error;
    if (firstError) {
      toast.error("Erro ao reordenar: " + firstError.message);
      await fetch();
      return false;
    }
    return true;
  };

  return { plans, loading, refetch: fetch, create, update, remove, reorder };
}