import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import type { DbPayment } from "./types";

type PaymentWithClientRow = DbPayment & {
  clients?: {
    name?: string | null;
    email?: string | null;
    plans?: {
      name?: string | null;
    } | null;
  } | null;
};

async function fetchPayments(): Promise<DbPayment[]> {
  const { data, error } = await supabase
    .from("payments")
    .select("*, clients(name, email, plan_id, plans(name))")
    .order("due_date", { ascending: false });
  if (error) throw error;
  return ((data as PaymentWithClientRow[] | null) || []).map((p) => ({
    ...p,
    client_name: p.clients?.name || "",
    client_email: p.clients?.email || "",
    client_plan: p.clients?.plans?.name || "",
  }));
}

export function usePayments() {
  const query = useQuery({
    queryKey: ["payments"],
    queryFn: fetchPayments,
    staleTime: 60_000,
    refetchOnWindowFocus: true,
  });

  if (query.error) {
    toast.error("Erro ao carregar pagamentos: " + (query.error as Error).message);
  }

  return {
    payments: query.data ?? [],
    loading: query.isLoading,
    refetch: query.refetch,
  };
}