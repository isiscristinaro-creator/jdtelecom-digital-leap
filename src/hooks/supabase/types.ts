// Tipos compartilhados das entidades do Supabase

export interface DbPlan {
  id: string;
  name: string;
  speed: string;
  price: number;
  benefits: string[];
  active_clients: number;
  created_at: string;
  ordem?: number | null;
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
  ordem?: number | null;
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
  ordem?: number | null;
}

export interface DbTestemunho {
  id: string;
  nome: string;
  mensagem: string;
  ativo: boolean;
  produto: string;
  created_at: string;
  ordem?: number | null;
}
