import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import type { DbPedido } from "./types";

export function usePedidos() {
  const [pedidos, setPedidos] = useState<DbPedido[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    const { data, error: err } = await supabase
      .from("pedidos")
      .select("*")
      .order("created_at", { ascending: false });
    if (err) {
      toast.error("Erro ao carregar pedidos: " + err.message);
      setError(new Error(err.message));
    } else {
      setPedidos(data || []);
    }
    setLoading(false);
  }, []);

  useEffect(() => { fetchData(); }, [fetchData]);

  const create = async (p: Omit<DbPedido, "id" | "created_at">) => {
    const { error } = await supabase.from("pedidos").insert(p);
    if (error) { toast.error(error.message); return false; }
    toast.success("Pedido criado!"); await fetchData(); return true;
  };

  const updateStatus = async (id: string, status: string) => {
    const { error } = await supabase.from("pedidos").update({ status }).eq("id", id);
    if (error) { toast.error(error.message); return false; }
    toast.success("Status atualizado!"); await fetchData(); return true;
  };

  return { pedidos, loading, error, refetch: fetchData, create, updateStatus };
}
