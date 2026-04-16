import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import type { DbClient } from "./types";

export function useClients() {
  const [clients, setClients] = useState<DbClient[]>([]);
  const [loading, setLoading] = useState(true);

  const fetch = useCallback(async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("clients")
      .select("*, plans(name, speed, price)")
      .order("name", { ascending: true });
    if (error) {
      toast.error("Erro ao carregar clientes: " + error.message);
      setClients([]);
    } else {
      setClients((data || []).map((c: any) => ({
        ...c,
        plan_name: c.plans?.name || "",
        plan_speed: c.plans?.speed || "",
        plan_price: c.plans?.price || 0,
      })));
    }
    setLoading(false);
  }, []);

  useEffect(() => { fetch(); }, [fetch]);
  return { clients, loading, refetch: fetch };
}
