import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import type { DbClient } from "./types";

type ClientWithPlanRow = DbClient & {
  plans?: {
    name?: string | null;
    speed?: string | null;
    price?: number | null;
  } | null;
};

async function fetchClients(): Promise<DbClient[]> {
  const { data, error } = await supabase
    .from("clients")
    .select("*, plans(name, speed, price)")
    .order("name", { ascending: true });
  if (error) throw error;
  return ((data as ClientWithPlanRow[] | null) || []).map((c) => ({
    ...c,
    plan_name: c.plans?.name || "",
    plan_speed: c.plans?.speed || "",
    plan_price: c.plans?.price || 0,
  }));
}

export function useClients() {
  const query = useQuery({
    queryKey: ["clients"],
    queryFn: fetchClients,
    staleTime: 60_000,
    refetchOnWindowFocus: true,
  });

  if (query.error) {
    toast.error("Erro ao carregar clientes: " + (query.error as Error).message);
  }

  return {
    clients: query.data ?? [],
    loading: query.isLoading,
    error: query.error as Error | null,
    refetch: query.refetch,
  };
}