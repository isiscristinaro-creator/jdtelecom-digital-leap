import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

// ==================== TYPES ====================

export interface DbPlan {
  id: string;
  name: string;
  speed: string;
  price: number;
  benefits: string[];
  active_clients: number;
  created_at: string;
}

export interface DbClient {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  plan_id: string;
  plan_name?: string;
  plan_speed?: string;
  plan_price?: number;
  status: "Ativo" | "Inadimplente" | "Cancelado";
  join_date: string;
  created_at: string;
}

export interface DbPayment {
  id: string;
  client_id: string;
  client_name?: string;
  client_email?: string;
  client_plan?: string;
  amount: number;
  status: "Pago" | "Pendente" | "Atrasado";
  description: string;
  due_date: string;
  created_at: string;
}

export interface DbTeamMember {
  id: string;
  name: string;
  email: string;
  role: string;
  permissions: string[];
  active: boolean;
  last_login: string | null;
  created_at: string;
}

export interface DbSystemLog {
  id: string;
  user_name: string;
  action: string;
  category: string;
  details: string;
  ip_address: string;
  created_at: string;
}

export interface DbServiceRecord {
  id: string;
  client_id: string;
  agent: string;
  type: string;
  description: string;
  created_at: string;
}

export interface DbProduto {
  id: string;
  nome: string;
  descricao: string;
  preco: number;
  imagem_url: string;
  categoria: string;
  ativo: boolean;
  created_at: string;
}

export interface DbPedido {
  id: string;
  cliente_email: string;
  valor: number;
  status: string;
  created_at: string;
}

export interface DbBanner {
  id: string;
  titulo: string;
  imagem_url: string;
  ativo: boolean;
  created_at: string;
}

export interface DbTestemunho {
  id: string;
  nome: string;
  mensagem: string;
  ativo: boolean;
  produto: string;
  created_at: string;
}

// ==================== HOOKS ====================

export function usePlans() {
  const [plans, setPlans] = useState<DbPlan[]>([]);
  const [loading, setLoading] = useState(true);

  const fetch = useCallback(async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("plans")
      .select("*")
      .order("price", { ascending: true });
    if (error) toast.error("Erro ao carregar planos: " + error.message);
    else setPlans(data || []);
    setLoading(false);
  }, []);

  useEffect(() => { fetch(); }, [fetch]);

  const create = async (plan: Omit<DbPlan, "id" | "created_at" | "active_clients">) => {
    const { error } = await supabase.from("plans").insert(plan);
    if (error) { toast.error(error.message); return false; }
    toast.success("Plano criado!"); await fetch(); return true;
  };

  const update = async (id: string, data: Partial<DbPlan>) => {
    const { error } = await supabase.from("plans").update(data).eq("id", id);
    if (error) { toast.error(error.message); return false; }
    toast.success("Plano atualizado!"); await fetch(); return true;
  };

  const remove = async (id: string) => {
    const { error } = await supabase.from("plans").delete().eq("id", id);
    if (error) { toast.error(error.message); return false; }
    toast.success("Plano removido!"); await fetch(); return true;
  };

  return { plans, loading, refetch: fetch, create, update, remove };
}

export function useClients() {
  const [clients, setClients] = useState<DbClient[]>([]);
  const [loading, setLoading] = useState(true);

  const fetch = useCallback(async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("clients")
      .select("*, plans(name, speed, price)")
      .order("name", { ascending: true });
    if (error) {
      toast.error("Erro ao carregar clientes: " + error.message);
      setClients([]);
    } else {
      setClients((data || []).map((c: any) => ({
        ...c,
        plan_name: c.plans?.name || "",
        plan_speed: c.plans?.speed || "",
        plan_price: c.plans?.price || 0,
      })));
    }
    setLoading(false);
  }, []);

  useEffect(() => { fetch(); }, [fetch]);
  return { clients, loading, refetch: fetch };
}

export function usePayments() {
  const [payments, setPayments] = useState<DbPayment[]>([]);
  const [loading, setLoading] = useState(true);

  const fetch = useCallback(async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("payments")
      .select("*, clients(name, email, plan_id, plans(name))")
      .order("due_date", { ascending: false });
    if (error) {
      toast.error("Erro ao carregar pagamentos: " + error.message);
      setPayments([]);
    } else {
      setPayments((data || []).map((p: any) => ({
        ...p,
        client_name: p.clients?.name || "",
        client_email: p.clients?.email || "",
        client_plan: p.clients?.plans?.name || "",
      })));
    }
    setLoading(false);
  }, []);

  useEffect(() => { fetch(); }, [fetch]);
  return { payments, loading, refetch: fetch };
}

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

export function useServiceRecords(clientId: string | null) {
  const [records, setRecords] = useState<DbServiceRecord[]>([]);
  const [loading, setLoading] = useState(false);

  const fetch = useCallback(async () => {
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

  useEffect(() => { fetch(); }, [fetch]);

  const create = async (record: Omit<DbServiceRecord, "id" | "created_at">) => {
    const { error } = await supabase.from("service_records").insert(record);
    if (error) { toast.error(error.message); return false; }
    toast.success("Atendimento registrado!"); await fetch(); return true;
  };

  return { records, loading, refetch: fetch, create };
}

export function useAllServiceRecords() {
  const [records, setRecords] = useState<DbServiceRecord[]>([]);
  const [loading, setLoading] = useState(true);

  const fetch = useCallback(async () => {
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

  useEffect(() => { fetch(); }, [fetch]);
  return { records, loading, refetch: fetch };
}

// ==================== DASHBOARD STATS ====================

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

// ==================== PRODUTOS ====================

export function useProdutos() {
  const [produtos, setProdutos] = useState<DbProduto[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchData = useCallback(async () => {
    setLoading(true);
    const { data, error } = await supabase.from("produtos").select("*").order("created_at", { ascending: false });
    if (error) toast.error("Erro ao carregar produtos: " + error.message);
    else setProdutos(data || []);
    setLoading(false);
  }, []);

  useEffect(() => { fetchData(); }, [fetchData]);

  const create = async (p: Omit<DbProduto, "id" | "created_at">) => {
    const { error } = await supabase.from("produtos").insert(p);
    if (error) { toast.error(error.message); return false; }
    toast.success("Produto criado!"); await fetchData(); return true;
  };

  const update = async (id: string, data: Partial<DbProduto>) => {
    const { error } = await supabase.from("produtos").update(data).eq("id", id);
    if (error) { toast.error(error.message); return false; }
    toast.success("Produto atualizado!"); await fetchData(); return true;
  };

  const remove = async (id: string) => {
    const { error } = await supabase.from("produtos").delete().eq("id", id);
    if (error) { toast.error(error.message); return false; }
    toast.success("Produto removido!"); await fetchData(); return true;
  };

  return { produtos, loading, refetch: fetchData, create, update, remove };
}

// ==================== PEDIDOS ====================

export function usePedidos() {
  const [pedidos, setPedidos] = useState<DbPedido[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchData = useCallback(async () => {
    setLoading(true);
    const { data, error } = await supabase.from("pedidos").select("*").order("created_at", { ascending: false });
    if (error) toast.error("Erro ao carregar pedidos: " + error.message);
    else setPedidos(data || []);
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

  return { pedidos, loading, refetch: fetchData, create, updateStatus };
}

// ==================== BANNERS ====================

export function useBanners() {
  const [banners, setBanners] = useState<DbBanner[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchData = useCallback(async () => {
    setLoading(true);
    const { data, error } = await supabase.from("banners").select("*").order("created_at", { ascending: false });
    if (error) toast.error("Erro ao carregar banners: " + error.message);
    else setBanners(data || []);
    setLoading(false);
  }, []);

  useEffect(() => { fetchData(); }, [fetchData]);

  const create = async (b: Omit<DbBanner, "id" | "created_at">) => {
    const { error } = await supabase.from("banners").insert(b);
    if (error) { toast.error(error.message); return false; }
    toast.success("Banner criado!"); await fetchData(); return true;
  };

  const update = async (id: string, data: Partial<DbBanner>) => {
    const { error } = await supabase.from("banners").update(data).eq("id", id);
    if (error) { toast.error(error.message); return false; }
    toast.success("Banner atualizado!"); await fetchData(); return true;
  };

  const remove = async (id: string) => {
    const { error } = await supabase.from("banners").delete().eq("id", id);
    if (error) { toast.error(error.message); return false; }
    toast.success("Banner removido!"); await fetchData(); return true;
  };

  return { banners, loading, refetch: fetchData, create, update, remove };
}

// ==================== TESTEMUNHOS ====================

export function useTestemunhos() {
  const [testemunhos, setTestemunhos] = useState<DbTestemunho[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchData = useCallback(async () => {
    setLoading(true);
    const { data, error } = await supabase.from("testemunhos").select("*").order("created_at", { ascending: false });
    if (error) toast.error("Erro ao carregar testemunhos: " + error.message);
    else setTestemunhos(data || []);
    setLoading(false);
  }, []);

  useEffect(() => { fetchData(); }, [fetchData]);

  const create = async (t: Omit<DbTestemunho, "id" | "created_at">) => {
    const { error } = await supabase.from("testemunhos").insert(t);
    if (error) { toast.error(error.message); return false; }
    toast.success("Testemunho criado!"); await fetchData(); return true;
  };

  const update = async (id: string, data: Partial<DbTestemunho>) => {
    const { error } = await supabase.from("testemunhos").update(data).eq("id", id);
    if (error) { toast.error(error.message); return false; }
    toast.success("Testemunho atualizado!"); await fetchData(); return true;
  };

  const remove = async (id: string) => {
    const { error } = await supabase.from("testemunhos").delete().eq("id", id);
    if (error) { toast.error(error.message); return false; }
    toast.success("Testemunho removido!"); await fetchData(); return true;
  };

  return { testemunhos, loading, refetch: fetchData, create, update, remove };
}

// ==================== STORAGE UPLOAD ====================

export async function uploadImage(bucket: string, file: File): Promise<string | null> {
  const ext = file.name.split(".").pop();
  const path = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
  const { error } = await supabase.storage.from(bucket).upload(path, file);
  if (error) { toast.error("Erro no upload: " + error.message); return null; }
  const { data } = supabase.storage.from(bucket).getPublicUrl(path);
  return data.publicUrl;
}
