import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import type { DbTeamMember } from "./types";

export function useTeamMembers() {
  const [team, setTeam] = useState<DbTeamMember[]>([]);
  const [loading, setLoading] = useState(true);

  const fetch = useCallback(async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("team_members")
      .select("*")
      .order("name", { ascending: true });
    if (error) toast.error("Erro ao carregar equipe: " + error.message);
    else setTeam(data || []);
    setLoading(false);
  }, []);

  useEffect(() => { fetch(); }, [fetch]);

  const create = async (member: Omit<DbTeamMember, "id" | "created_at" | "last_login">) => {
    const { error } = await supabase.from("team_members").insert(member);
    if (error) { toast.error(error.message); return false; }
    toast.success("Membro criado!"); await fetch(); return true;
  };

  const update = async (id: string, data: Partial<DbTeamMember>) => {
    const { error } = await supabase.from("team_members").update(data).eq("id", id);
    if (error) { toast.error(error.message); return false; }
    toast.success("Membro atualizado!"); await fetch(); return true;
  };

  const toggleActive = async (id: string, active: boolean) => {
    const { error } = await supabase.from("team_members").update({ active }).eq("id", id);
    if (error) { toast.error(error.message); return false; }
    await fetch(); return true;
  };

  return { team, loading, refetch: fetch, create, update, toggleActive };
}
