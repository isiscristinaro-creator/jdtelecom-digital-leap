import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export interface KpiGoal {
  key: string;
  label: string;
  target_value: number;
}

const DEFAULT_GOALS: KpiGoal[] = [
  { key: "meta_receita", label: "Meta Receita Mensal", target_value: 50000 },
  { key: "meta_clientes", label: "Meta Clientes Total", target_value: 100 },
  { key: "meta_novos_30d", label: "Novos Clientes (30 dias)", target_value: 10 },
];

const STORAGE_KEY = "jd_kpi_goals";

export function useKpiGoals() {
  const [goals, setGoals] = useState<KpiGoal[]>(DEFAULT_GOALS);
  const [loading, setLoading] = useState(true);
  const [dbAvailable, setDbAvailable] = useState(false);

  const fetchGoals = useCallback(async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("kpi_goals")
        .select("key, label, target_value")
        .order("key");

      if (!error && data && data.length > 0) {
        setGoals(data);
        setDbAvailable(true);
        setLoading(false);
        return;
      }
    } catch {
      // Table doesn't exist yet
    }

    // Fallback to localStorage
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setGoals(parsed);
        }
      }
    } catch {}
    setDbAvailable(false);
    setLoading(false);
  }, []);

  useEffect(() => { fetchGoals(); }, [fetchGoals]);

  const updateGoal = useCallback(async (key: string, target_value: number) => {
    // Optimistic update
    setGoals(prev => prev.map(g => g.key === key ? { ...g, target_value } : g));

    if (dbAvailable) {
      const { error } = await supabase
        .from("kpi_goals")
        .update({ target_value, updated_at: new Date().toISOString() })
        .eq("key", key);

      if (error) {
        toast.error("Erro ao salvar meta: " + error.message);
        await fetchGoals();
        return false;
      }
    }

    // Always save to localStorage as backup
    const updated = goals.map(g => g.key === key ? { ...g, target_value } : g);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    toast.success("Meta atualizada!");
    return true;
  }, [dbAvailable, goals, fetchGoals]);

  const getGoal = useCallback((key: string) => {
    return goals.find(g => g.key === key)?.target_value ?? DEFAULT_GOALS.find(g => g.key === key)?.target_value ?? 0;
  }, [goals]);

  return { goals, loading, updateGoal, getGoal, dbAvailable };
}