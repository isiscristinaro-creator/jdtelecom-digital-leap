import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import type { DbPayment } from "./types";

export function usePayments() {
  const [payments, setPayments] = useState<DbPayment[]>([]);
  const [loading, setLoading] = useState(true);

  const fetch = useCallback(async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("payments")
      .select("*, clients(name, email, plan_id, plans(name))")
      .order("due_date", { ascending: false });
    if (error) {
      toast.error("Erro ao carregar pagamentos: " + error.message);
      setPayments([]);
    } else {
      setPayments((data || []).map((p: any) => ({
        ...p,
        client_name: p.clients?.name || "",
        client_email: p.clients?.email || "",
        client_plan: p.clients?.plans?.name || "",
      })));
    }
    setLoading(false);
  }, []);

  useEffect(() => { fetch(); }, [fetch]);
  return { payments, loading, refetch: fetch };
}
