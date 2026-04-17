import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export interface RawBanner {
  id: string;
  titulo: string;
  imagem_url: string;
}

/**
 * Fetch único e cacheado dos banners ativos da home.
 * Compartilhado entre HeroSection e BannersSection para evitar
 * duas requisições à mesma tabela no carregamento inicial.
 */
async function fetchHomeBanners(): Promise<RawBanner[]> {
  const { data, error } = await supabase
    .from("banners")
    .select("id, titulo, imagem_url")
    .eq("ativo", true)
    .order("ordem", { ascending: true, nullsFirst: false })
    .order("created_at", { ascending: false });
  if (error) {
    console.error("[useHomeBanners] erro:", error.message);
    return [];
  }
  return (data || []).filter((b) => !!b.imagem_url);
}

export function useHomeBanners() {
  const query = useQuery({
    queryKey: ["home-banners"],
    queryFn: fetchHomeBanners,
    staleTime: 5 * 60_000, // 5min: banners mudam pouco
    refetchOnWindowFocus: false,
  });
  return { banners: query.data ?? [], loading: query.isLoading };
}
