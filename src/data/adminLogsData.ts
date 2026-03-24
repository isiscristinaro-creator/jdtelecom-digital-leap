export interface SystemLog {
  id: string;
  user: string;
  action: string;
  category: "login" | "cliente" | "plano" | "pagamento" | "equipe" | "sistema";
  details: string;
  datetime: string;
  ip: string;
}

const actions = [
  { action: "Login realizado", category: "login" as const, details: "Acesso ao painel administrativo" },
  { action: "Dados do cliente alterados", category: "cliente" as const, details: "Endereço atualizado" },
  { action: "Plano alterado", category: "plano" as const, details: "Turbo Fibra 200 → Turbo Fibra 300" },
  { action: "Status alterado", category: "cliente" as const, details: "Ativo → Inadimplente" },
  { action: "Pagamento registrado", category: "pagamento" as const, details: "Mensalidade março/2026 - R$ 139,90" },
  { action: "Novo cliente cadastrado", category: "cliente" as const, details: "João Silva - Turbo Fibra 500" },
  { action: "Usuário criado", category: "equipe" as const, details: "Carlos Atendimento - Perfil: Atendimento" },
  { action: "Exportação de relatório", category: "sistema" as const, details: "Relatório financeiro exportado em Excel" },
  { action: "Configuração alterada", category: "sistema" as const, details: "Suspensão automática ativada" },
  { action: "Login realizado", category: "login" as const, details: "Acesso via dispositivo móvel" },
  { action: "Cliente cancelado", category: "cliente" as const, details: "Maria Santos - Cancelamento a pedido" },
  { action: "Plano criado", category: "plano" as const, details: "Novo plano Turbo Fibra 1.5GB" },
];

const users = ["Admin Master", "Carlos Atendimento", "Ana Financeiro", "Roberto Comercial", "Fernanda Operação"];
const ips = ["192.168.1.100", "192.168.1.105", "10.0.0.25", "192.168.1.110", "10.0.0.30"];

function generateLogs(count: number): SystemLog[] {
  const logs: SystemLog[] = [];
  for (let i = 0; i < count; i++) {
    const a = actions[i % actions.length];
    const d = new Date();
    d.setHours(d.getHours() - i * 2);
    logs.push({
      id: `log-${i}`,
      user: users[i % users.length],
      action: a.action,
      category: a.category,
      details: a.details,
      datetime: `${d.getDate().toString().padStart(2, "0")}/${(d.getMonth() + 1).toString().padStart(2, "0")}/${d.getFullYear()} ${d.getHours().toString().padStart(2, "0")}:${d.getMinutes().toString().padStart(2, "0")}`,
      ip: ips[i % ips.length],
    });
  }
  return logs;
}

export const mockLogs = generateLogs(100);

export const categoryLabels: Record<SystemLog["category"], string> = {
  login: "Login",
  cliente: "Cliente",
  plano: "Plano",
  pagamento: "Pagamento",
  equipe: "Equipe",
  sistema: "Sistema",
};
