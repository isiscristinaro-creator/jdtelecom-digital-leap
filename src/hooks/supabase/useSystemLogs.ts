import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import type { DbSystemLog } from "./types";

export function useSystemLogs() {
  const [logs, setLogs] = useState<DbSystemLog[]>([]);
  const [loading, setLoading] = useState(true);

  const fetch = useCallback(async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("system_logs")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(500);
    if (error) toast.error("Erro ao carregar logs: " + error.message);
    else setLogs(data || []);
    setLoading(false);
  }, []);

  useEffect(() => { fetch(); }, [fetch]);
  return { logs, loading, refetch: fetch };
}
