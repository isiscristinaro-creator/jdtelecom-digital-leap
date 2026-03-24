import {
  Users, UserCheck, UserX, AlertTriangle, DollarSign, TrendingUp, BarChart3, Package,
  UserPlus, ArrowUpRight, AlertCircle, Info, Download, FileSpreadsheet
} from "lucide-react";
import { toast } from "sonner";
import {
  totalClients, activeClients, inadimplenteClients, canceledClients,
  mrr, totalRevenue, ticketMedio, forecastRevenue,
  growthData, planDistribution, newClientsLast7, newClientsLast30, growthRate,
  alerts, mockPlans, mockClients, allPayments
} from "@/data/adminMockData";
import {
  LineChart, Line, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from "recharts";
import { Button } from "@/components/ui/button";
import { exportToCSV } from "@/utils/exportUtils";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import ExportFinanceiroModal from "@/components/admin/ExportFinanceiroModal";

const fmt = (v: number) => v.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
const fmtK = (v: number) => `R$ ${(v / 1000).toFixed(0)}k`;

const COLORS = ["hsl(24,95%,50%)", "hsl(15,90%,42%)", "hsl(350,80%,55%)", "hsl(40,90%,50%)", "hsl(200,80%,50%)"];

const alertIcons = { warning: AlertTriangle, danger: AlertCircle, info: Info };
const alertColors = {
  warning: "bg-amber-500/10 border-amber-500/20 text-amber-400",
  danger: "bg-red-500/10 border-red-500/20 text-red-400",
  info: "bg-blue-500/10 border-blue-500/20 text-blue-400",
};

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [financeiroOpen, setFinanceiroOpen] = useState(false);
  const summaryCards = [
    { label: "Total de Clientes", value: totalClients.toLocaleString(), icon: Users, color: "text-primary" },
    { label: "Clientes Ativos", value: activeClients.toLocaleString(), icon: UserCheck, color: "text-emerald-400" },
    { label: "Inadimplentes", value: inadimplenteClients.toLocaleString(), icon: AlertTriangle, color: "text-amber-400" },
    { label: "Cancelados", value: canceledClients.toLocaleString(), icon: UserX, color: "text-red-400" },
  ];

  const financeCards = [
    { label: "Receita Mensal (MRR)", value: fmt(mrr), icon: DollarSign },
    { label: "Receita Anual", value: fmt(totalRevenue), icon: TrendingUp },
    { label: "Ticket Médio", value: fmt(ticketMedio), icon: BarChart3 },
    { label: "Faturamento Previsto", value: fmt(forecastRevenue), icon: ArrowUpRight },
  ];

  const salesCards = [
    { label: "Novos (7 dias)", value: newClientsLast7 },
    { label: "Novos (30 dias)", value: newClientsLast30 },
    { label: "Crescimento", value: `${growthRate}%` },
  ];

  const handleExportClients = () => {
    const data = mockClients.map(c => ({
      Nome: c.name, Email: c.email, Telefone: c.phone, Plano: c.plan,
      "Valor (R$)": c.price.toFixed(2), Status: c.status, "Cliente desde": c.joinDate,
    }));
    if (!data.length) { toast.error("Nenhum dado para exportar"); return; }
    exportToCSV(data, "clientes_completo_jdtelecom");
    toast.success(`${data.length} clientes exportados com sucesso`);
  };

  const handleExportFinanceiro = () => {
    setFinanceiroOpen(true);
  };

  return (
    <div className="p-4 md:p-6 lg:p-8 pt-12 md:pt-6 space-y-6 max-w-[1400px] w-full overflow-hidden mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-12 md:pt-0">
        <div>
          <h1 className="font-display text-2xl md:text-3xl font-bold text-[hsl(var(--dark-section-fg))]">Dashboard</h1>
          <p className="text-sm text-[hsl(var(--dark-section-muted))] mt-1">Visão geral da JD Telecom</p>
        </div>
        <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
          <Button onClick={handleExportClients} size="sm"
            className="bg-[hsl(var(--dark-section-card))] border border-[hsl(var(--dark-section-border))] text-[hsl(var(--dark-section-fg))] hover:bg-primary/20 rounded-xl text-xs flex-1 sm:flex-none">
            <FileSpreadsheet className="w-3.5 h-3.5 mr-1.5" /> Clientes
          </Button>
          <Button onClick={handleExportFinanceiro} size="sm"
            className="bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs flex-1 sm:flex-none">
            <Download className="w-3.5 h-3.5 mr-1.5" /> Financeiro
          </Button>
        </div>
      </div>

      {/* Alerts */}
      <div className="space-y-2">
        {alerts.map((a, i) => {
          const Icon = alertIcons[a.type];
          return (
            <div key={i} className={`flex items-center gap-3 px-4 py-3 rounded-xl border ${alertColors[a.type]}`}>
              <Icon className="w-4 h-4 shrink-0" />
              <p className="text-sm">{a.message}</p>
            </div>
          );
        })}
      </div>

      {/* Quick actions */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {[
          { label: "Ver Inadimplentes", action: () => navigate("/admin/clientes"), icon: AlertTriangle, color: "text-amber-400 bg-amber-500/10" },
          { label: "Gerenciar Planos", action: () => navigate("/admin/planos"), icon: Package, color: "text-primary bg-primary/10" },
          { label: "Ver Pagamentos", action: () => navigate("/admin/pagamentos"), icon: DollarSign, color: "text-emerald-400 bg-emerald-500/10" },
          { label: "Relatórios", action: () => navigate("/admin/relatorios"), icon: BarChart3, color: "text-blue-400 bg-blue-500/10" },
        ].map(q => (
          <button key={q.label} onClick={q.action}
            className="bg-[hsl(var(--dark-section-card))] border border-[hsl(var(--dark-section-border))] rounded-2xl p-4 flex flex-col items-center gap-2 hover:border-primary/40 transition-all group">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${q.color}`}>
              <q.icon className="w-5 h-5" />
            </div>
            <span className="text-xs font-semibold text-[hsl(var(--dark-section-muted))] group-hover:text-[hsl(var(--dark-section-fg))] transition-colors">{q.label}</span>
          </button>
        ))}
      </div>

      {/* Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
        {summaryCards.map((c) => (
          <div key={c.label} className="bg-[hsl(var(--dark-section-card))] border border-[hsl(var(--dark-section-border))] rounded-2xl p-4 md:p-5">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                <c.icon className={`w-4 h-4 ${c.color}`} />
              </div>
            </div>
            <p className="font-display text-2xl md:text-3xl font-extrabold text-[hsl(var(--dark-section-fg))]">{c.value}</p>
            <p className="text-xs text-[hsl(var(--dark-section-muted))] mt-1">{c.label}</p>
          </div>
        ))}
      </div>

      {/* Financial */}
      <div>
        <h2 className="font-display text-lg font-bold text-[hsl(var(--dark-section-fg))] mb-3 flex items-center gap-2">
          <DollarSign className="w-5 h-5 text-primary" /> Financeiro
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
          {financeCards.map((c) => (
            <div key={c.label} className="bg-[hsl(var(--dark-section-card))] border border-[hsl(var(--dark-section-border))] rounded-2xl p-4 md:p-5">
              <c.icon className="w-5 h-5 text-primary mb-2" />
              <p className="font-display text-lg md:text-xl font-bold text-[hsl(var(--dark-section-fg))]">{c.value}</p>
              <p className="text-xs text-[hsl(var(--dark-section-muted))] mt-1">{c.label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Sales + Plans summary */}
      <div className="grid md:grid-cols-2 gap-4">
        <div className="bg-[hsl(var(--dark-section-card))] border border-[hsl(var(--dark-section-border))] rounded-2xl p-5">
          <h3 className="font-display font-semibold text-[hsl(var(--dark-section-fg))] mb-4 flex items-center gap-2">
            <UserPlus className="w-4 h-4 text-primary" /> Vendas
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {salesCards.map((c) => (
              <div key={c.label} className="text-center p-3 rounded-xl bg-[hsl(var(--dark-section))]/50">
                <p className="font-display text-xl font-bold text-primary">{c.value}</p>
                <p className="text-[10px] text-[hsl(var(--dark-section-muted))] mt-1">{c.label}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-[hsl(var(--dark-section-card))] border border-[hsl(var(--dark-section-border))] rounded-2xl p-5">
          <h3 className="font-display font-semibold text-[hsl(var(--dark-section-fg))] mb-4 flex items-center gap-2">
            <Package className="w-4 h-4 text-primary" /> Planos Ativos
          </h3>
          <div className="space-y-2">
            {mockPlans.slice(0, 3).map((p) => (
              <div key={p.id} className="flex items-center justify-between text-sm">
                <span className="text-[hsl(var(--dark-section-muted))]">{p.name}</span>
                <span className="font-bold text-[hsl(var(--dark-section-fg))]">{p.activeClients}</span>
              </div>
            ))}
            <p className="text-xs text-primary font-medium pt-1">
              Mais vendido: {mockPlans.reduce((a, b) => a.activeClients > b.activeClients ? a : b).name}
            </p>
          </div>
        </div>
      </div>

      {/* Charts */}
      <div className="grid lg:grid-cols-2 gap-4">
        <div className="bg-[hsl(var(--dark-section-card))] border border-[hsl(var(--dark-section-border))] rounded-2xl p-5">
          <h3 className="font-display font-semibold text-[hsl(var(--dark-section-fg))] mb-4">Crescimento de Clientes</h3>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={growthData}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(220,14%,22%)" />
              <XAxis dataKey="month" tick={{ fill: "hsl(220,10%,55%)", fontSize: 12 }} axisLine={false} />
              <YAxis tick={{ fill: "hsl(220,10%,55%)", fontSize: 12 }} axisLine={false} />
              <Tooltip contentStyle={{ background: "hsl(220,18%,14%)", border: "1px solid hsl(220,14%,22%)", borderRadius: 12, color: "#fff" }} />
              <Line type="monotone" dataKey="clients" stroke="hsl(24,95%,50%)" strokeWidth={3} dot={{ fill: "hsl(24,95%,50%)", r: 4 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-[hsl(var(--dark-section-card))] border border-[hsl(var(--dark-section-border))] rounded-2xl p-5">
          <h3 className="font-display font-semibold text-[hsl(var(--dark-section-fg))] mb-4">Receita Mensal</h3>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={growthData}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(220,14%,22%)" />
              <XAxis dataKey="month" tick={{ fill: "hsl(220,10%,55%)", fontSize: 12 }} axisLine={false} />
              <YAxis tickFormatter={fmtK} tick={{ fill: "hsl(220,10%,55%)", fontSize: 12 }} axisLine={false} />
              <Tooltip formatter={(v: number) => fmt(v)} contentStyle={{ background: "hsl(220,18%,14%)", border: "1px solid hsl(220,14%,22%)", borderRadius: 12, color: "#fff" }} />
              <Bar dataKey="revenue" fill="hsl(24,95%,50%)" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-[hsl(var(--dark-section-card))] border border-[hsl(var(--dark-section-border))] rounded-2xl p-5 lg:col-span-2">
          <h3 className="font-display font-semibold text-[hsl(var(--dark-section-fg))] mb-4">Distribuição por Plano</h3>
          <div className="flex flex-col md:flex-row items-center gap-6">
            <ResponsiveContainer width="100%" height={250} className="max-w-[300px]">
              <PieChart>
                <Pie data={planDistribution} cx="50%" cy="50%" innerRadius={60} outerRadius={100} paddingAngle={3} dataKey="value">
                  {planDistribution.map((_, i) => (
                    <Cell key={i} fill={COLORS[i % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ background: "hsl(220,18%,14%)", border: "1px solid hsl(220,14%,22%)", borderRadius: 12, color: "#fff" }} />
              </PieChart>
            </ResponsiveContainer>
            <div className="space-y-2 flex-1">
              {planDistribution.map((p, i) => (
                <div key={p.name} className="flex items-center gap-3">
                  <div className="w-3 h-3 rounded-full shrink-0" style={{ background: COLORS[i % COLORS.length] }} />
                  <span className="text-sm text-[hsl(var(--dark-section-muted))] flex-1">{p.name}</span>
                  <span className="text-sm font-bold text-[hsl(var(--dark-section-fg))]">{p.value} clientes</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      <ExportFinanceiroModal open={financeiroOpen} onOpenChange={setFinanceiroOpen} />
    </div>
  );
};

export default AdminDashboard;
