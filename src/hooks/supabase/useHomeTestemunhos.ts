import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export interface HomeTestemunho {
  id: string;
  nome: string;
  mensagem: string;
}

async function fetchHomeTestemunhos(): Promise<HomeTestemunho[]> {
  const { data, error } = await supabase
    .from("testemunhos")
    .select("id, nome, mensagem")
    .eq("ativo", true)
    .order("created_at", { ascending: false });
  if (error) {
    console.error("[useHomeTestemunhos] erro:", error.message);
    return [];
  }
  return data || [];
}

export function useHomeTestemunhos() {
  const query = useQuery({
    queryKey: ["home-testemunhos"],
    queryFn: fetchHomeTestemunhos,
    staleTime: 5 * 60_000,
    refetchOnWindowFocus: false,
  });
  return {
    testemunhos: query.data ?? [],
    loading: query.isLoading,
    error: query.error as Error | null,
    refetch: query.refetch,
  };
}
