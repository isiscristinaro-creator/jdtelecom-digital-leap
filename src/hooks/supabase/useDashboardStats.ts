import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

interface DashboardStats {
  totalClients: number;
  activeClients: number;
  inadimplentes: number;
  cancelados: number;
  mrr: number;
  totalRevenue: number;
  ticketMedio: number;
  forecast: number;
  newLast7: number;
  newLast30: number;
  growthRate: number;
}

const EMPTY: DashboardStats = {
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
};

async function fetchDashboardStats(): Promise<DashboardStats> {
  const { data: clients, error } = await supabase
    .from("clients")
    .select("status, plan_id, join_date, plans(price)");

  if (error) throw error;
  if (!clients) return EMPTY;

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

  return {
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
  };
}

export function useDashboardStats() {
  const query = useQuery({
    queryKey: ["dashboard-stats"],
    queryFn: fetchDashboardStats,
    staleTime: 60_000,
    refetchOnWindowFocus: true,
  });

  return {
    stats: query.data ?? EMPTY,
    loading: query.isLoading,
  };
}
