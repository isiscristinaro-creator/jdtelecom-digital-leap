import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import type { DbServiceRecord } from "./types";

export function useServiceRecords(clientId: string | null) {
  const [records, setRecords] = useState<DbServiceRecord[]>([]);
  const [loading, setLoading] = useState(false);

  // BUG FIX: renomeado de `fetch` p/ `load` para evitar shadowing do `globalThis.fetch`.
  const load = useCallback(async () => {
    if (!clientId) { setRecords([]); return; }
    setLoading(true);
    const { data, error } = await supabase
      .from("service_records")
      .select("*")
      .eq("client_id", clientId)
      .order("created_at", { ascending: false });
    if (error) toast.error("Erro: " + error.message);
    else setRecords(data || []);
    setLoading(false);
  }, [clientId]);

  useEffect(() => { load(); }, [load]);

  const create = async (record: Omit<DbServiceRecord, "id" | "created_at">) => {
    const { error } = await supabase.from("service_records").insert(record);
    if (error) { toast.error(error.message); return false; }
    toast.success("Atendimento registrado!"); await load(); return true;
  };

  return { records, loading, refetch: load, create };
}

export function useAllServiceRecords() {
  const [records, setRecords] = useState<DbServiceRecord[]>([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("service_records")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(1000);
    if (error) toast.error("Erro: " + error.message);
    else setRecords(data || []);
    setLoading(false);
  }, []);

  useEffect(() => { load(); }, [load]);
  return { records, loading, refetch: load };
}
