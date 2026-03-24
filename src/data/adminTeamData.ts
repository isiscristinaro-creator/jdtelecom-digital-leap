export type Permission = "dashboard" | "clientes" | "pagamentos" | "relatorios" | "planos" | "equipe" | "logs";
export type Role = "Administrador" | "Atendimento" | "Financeiro" | "Comercial" | "Operação";

export interface TeamMember {
  id: string;
  name: string;
  email: string;
  role: Role;
  permissions: Permission[];
  active: boolean;
  lastLogin: string;
  createdAt: string;
}

export const allPermissions: { id: Permission; label: string }[] = [
  { id: "dashboard", label: "Dashboard" },
  { id: "clientes", label: "Clientes" },
  { id: "pagamentos", label: "Pagamentos" },
  { id: "relatorios", label: "Relatórios" },
  { id: "planos", label: "Planos" },
  { id: "equipe", label: "Equipe" },
  { id: "logs", label: "Logs" },
];

export const roles: Role[] = ["Administrador", "Atendimento", "Financeiro", "Comercial", "Operação"];

export const rolePermissions: Record<Role, Permission[]> = {
  Administrador: ["dashboard", "clientes", "pagamentos", "relatorios", "planos", "equipe", "logs"],
  Atendimento: ["dashboard", "clientes"],
  Financeiro: ["dashboard", "pagamentos", "relatorios"],
  Comercial: ["dashboard", "clientes", "planos"],
  "Operação": ["dashboard", "clientes"],
};

export const mockTeam: TeamMember[] = [
  { id: "1", name: "Admin Master", email: "admin@jdtelecom.com", role: "Administrador", permissions: rolePermissions.Administrador, active: true, lastLogin: "24/03/2026 09:15", createdAt: "01/01/2025" },
  { id: "2", name: "Carlos Atendimento", email: "carlos@jdtelecom.com", role: "Atendimento", permissions: rolePermissions.Atendimento, active: true, lastLogin: "24/03/2026 08:30", createdAt: "15/02/2025" },
  { id: "3", name: "Ana Financeiro", email: "ana@jdtelecom.com", role: "Financeiro", permissions: rolePermissions.Financeiro, active: true, lastLogin: "23/03/2026 17:45", createdAt: "20/03/2025" },
  { id: "4", name: "Roberto Comercial", email: "roberto@jdtelecom.com", role: "Comercial", permissions: rolePermissions.Comercial, active: false, lastLogin: "15/03/2026 14:20", createdAt: "10/04/2025" },
  { id: "5", name: "Fernanda Operação", email: "fernanda@jdtelecom.com", role: "Operação", permissions: rolePermissions["Operação"], active: true, lastLogin: "24/03/2026 07:50", createdAt: "01/06/2025" },
];
