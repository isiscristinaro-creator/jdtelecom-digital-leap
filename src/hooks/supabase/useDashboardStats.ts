import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

export function useDashboardStats() {
  const [stats, setStats] = useState({
    totalClients: 0,
    activeClients: 0,
    inadimplentes: 0,
    cancelados: 0,
    mrr: 0,
    totalRevenue: 0,
    ticketMedio: 0,
    forecast: 0,
    newLast7: 0,
    newLast30: 0,
    growthRate: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      setLoading(true);
      const { data: clients } = await supabase
        .from("clients")
        .select("status, plan_id, join_date, plans(price)");

      if (clients) {
        const total = clients.length;
        const active = clients.filter((c: any) => c.status === "Ativo").length;
        const inad = clients.filter((c: any) => c.status === "Inadimplente").length;
        const canc = clients.filter((c: any) => c.status === "Cancelado").length;
        const mrrVal = clients
          .filter((c: any) => c.status === "Ativo")
          .reduce((s: number, c: any) => s + (c.plans?.price || 0), 0);

        const now = new Date();
        const d7 = new Date(now); d7.setDate(d7.getDate() - 7);
        const d30 = new Date(now); d30.setDate(d30.getDate() - 30);
        const last7 = clients.filter((c: any) => new Date(c.join_date) >= d7).length;
        const last30 = clients.filter((c: any) => new Date(c.join_date) >= d30).length;

        setStats({
          totalClients: total,
          activeClients: active,
          inadimplentes: inad,
          cancelados: canc,
          mrr: mrrVal,
          totalRevenue: mrrVal * 12,
          ticketMedio: active ? mrrVal / active : 0,
          forecast: mrrVal * 1.05,
          newLast7: last7,
          newLast30: last30,
          growthRate: total > 0 ? parseFloat(((last30 / total) * 100).toFixed(1)) : 0,
        });
      }
      setLoading(false);
    })();
  }, []);

  return { stats, loading };
}
