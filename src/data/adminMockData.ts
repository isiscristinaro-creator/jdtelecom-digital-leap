// ===== MOCK DATA FOR ADMIN PANEL =====

export interface Client {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  plan: string;
  speed: string;
  price: number;
  status: "Ativo" | "Inadimplente" | "Cancelado";
  joinDate: string;
  payments: Payment[];
}

export interface Payment {
  id: string;
  clientId: string;
  clientName: string;
  date: string;
  amount: number;
  status: "Pago" | "Pendente" | "Atrasado";
  description: string;
}

export interface Plan {
  id: string;
  name: string;
  speed: string;
  price: number;
  benefits: string[];
  activeClients: number;
}

// Plans
export const mockPlans: Plan[] = [
  { id: "1", name: "Turbo Fibra 200", speed: "200MB", price: 99.90, benefits: ["Internet Fibra", "Suporte 24/7"], activeClients: 312 },
  { id: "2", name: "Turbo Fibra 300", speed: "300MB", price: 139.90, benefits: ["Internet Fibra", "TV PLUS", "Suporte 24/7"], activeClients: 587 },
  { id: "3", name: "Turbo Fibra 500", speed: "500MB", price: 179.90, benefits: ["Internet Fibra", "TV PLUS Premium", "Suporte 24/7"], activeClients: 423 },
  { id: "4", name: "Turbo Fibra 800", speed: "800MB", price: 229.90, benefits: ["Internet Fibra", "TV PLUS Premium", "Telefone Fixo", "Suporte 24/7"], activeClients: 198 },
  { id: "5", name: "Turbo Fibra 1GB", speed: "1GB", price: 349.90, benefits: ["Internet Fibra", "TV PLUS Premium", "Telefone Fixo", "IP Fixo", "Suporte VIP"], activeClients: 89 },
];

// Generate clients
const firstNames = ["João", "Maria", "Pedro", "Ana", "Carlos", "Luciana", "Roberto", "Fernanda", "Ricardo", "Patricia", "Marcos", "Juliana", "André", "Camila", "Thiago", "Beatriz", "Rafael", "Larissa", "Bruno", "Amanda"];
const lastNames = ["Silva", "Santos", "Oliveira", "Souza", "Pereira", "Costa", "Ferreira", "Rodrigues", "Almeida", "Nascimento", "Lima", "Araújo", "Melo", "Barbosa", "Ribeiro"];
const streets = ["Rua das Flores", "Av. Brasil", "Rua São Paulo", "Av. Djalma Batista", "Rua Recife", "Av. Torquato Tapajós", "Rua Pará", "Av. Max Teixeira"];
const cities = ["Manaus, AM", "Santarém, PA", "Oriximiná, PA", "Nhamundá, AM", "Breves, PA"];

function randomFrom<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function generateClients(count: number): Client[] {
  const clients: Client[] = [];
  const statuses: Client["status"][] = ["Ativo", "Ativo", "Ativo", "Ativo", "Ativo", "Ativo", "Ativo", "Inadimplente", "Inadimplente", "Cancelado"];

  for (let i = 0; i < count; i++) {
    const plan = randomFrom(mockPlans);
    const status = randomFrom(statuses);
    const name = `${randomFrom(firstNames)} ${randomFrom(lastNames)}`;
    const monthsAgo = Math.floor(Math.random() * 24) + 1;
    const joinDate = new Date();
    joinDate.setMonth(joinDate.getMonth() - monthsAgo);

    const payments: Payment[] = [];
    for (let m = 0; m < Math.min(monthsAgo, 6); m++) {
      const payDate = new Date();
      payDate.setMonth(payDate.getMonth() - m);
      const payStatus = m === 0 && status === "Inadimplente" ? "Atrasado" as const :
                        m === 0 ? "Pendente" as const : "Pago" as const;
      payments.push({
        id: `pay-${i}-${m}`,
        clientId: `client-${i}`,
        clientName: name,
        date: `${payDate.getDate().toString().padStart(2, "0")}/${(payDate.getMonth() + 1).toString().padStart(2, "0")}/${payDate.getFullYear()}`,
        amount: plan.price,
        status: payStatus,
        description: `Mensalidade ${payDate.toLocaleString("pt-BR", { month: "long", year: "numeric" })}`,
      });
    }

    clients.push({
      id: `client-${i}`,
      name,
      email: `${name.toLowerCase().replace(/ /g, ".").normalize("NFD").replace(/[\u0300-\u036f]/g, "")}@email.com`,
      phone: `(92) 9${Math.floor(1000 + Math.random() * 9000)}-${Math.floor(1000 + Math.random() * 9000)}`,
      address: `${randomFrom(streets)}, ${Math.floor(100 + Math.random() * 900)} - ${randomFrom(cities)}`,
      plan: plan.name,
      speed: plan.speed,
      price: plan.price,
      status,
      joinDate: `${joinDate.getDate().toString().padStart(2, "0")}/${(joinDate.getMonth() + 1).toString().padStart(2, "0")}/${joinDate.getFullYear()}`,
      payments,
    });
  }
  return clients;
}

export const mockClients = generateClients(1609);

// Derived stats
export const totalClients = mockClients.length;
export const activeClients = mockClients.filter((c) => c.status === "Ativo").length;
export const inadimplenteClients = mockClients.filter((c) => c.status === "Inadimplente").length;
export const canceledClients = mockClients.filter((c) => c.status === "Cancelado").length;

export const mrr = mockClients.filter((c) => c.status === "Ativo").reduce((sum, c) => sum + c.price, 0);
export const totalRevenue = mrr * 12;
export const ticketMedio = mrr / activeClients;
export const forecastRevenue = mrr * 1.05;

// Chart data
export const growthData = [
  { month: "Out", clients: 1180, revenue: 185000 },
  { month: "Nov", clients: 1250, revenue: 198000 },
  { month: "Dez", clients: 1320, revenue: 212000 },
  { month: "Jan", clients: 1390, revenue: 225000 },
  { month: "Fev", clients: 1480, revenue: 241000 },
  { month: "Mar", clients: 1609, revenue: 258000 },
];

export const planDistribution = mockPlans.map((p) => ({
  name: p.speed,
  value: p.activeClients,
}));

// Recent clients (last 7 & 30 days)
export const newClientsLast7 = 23;
export const newClientsLast30 = 89;
export const growthRate = 8.7;

// All payments flattened
export const allPayments: Payment[] = mockClients.flatMap((c) => c.payments);

// Alerts
export const alerts = [
  { type: "warning" as const, message: `${inadimplenteClients} clientes inadimplentes precisam de atenção` },
  { type: "danger" as const, message: "12 cancelamentos nos últimos 30 dias" },
  { type: "info" as const, message: "Receita cresceu 7% em relação ao mês anterior" },
];
