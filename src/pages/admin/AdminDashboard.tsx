import {
  Users, UserCheck, UserX, AlertTriangle, DollarSign, TrendingUp, BarChart3, Package,
  UserPlus, ArrowUpRight, AlertCircle, Info, Download, FileSpreadsheet, Loader2, Headphones, Target, Pencil, Check, X, History, Clock, Zap, FileText, Trophy, CalendarIcon
} from "lucide-react";
import { toast } from "sonner";
import {
  PieChart, Pie, Cell, Tooltip, ResponsiveContainer,
  AreaChart, Area, XAxis, YAxis, CartesianGrid, BarChart, Bar, Legend,
  LineChart, Line, ReferenceLine
} from "recharts";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { exportToCSV, exportToExcel } from "@/utils/exportUtils";
import { useNavigate } from "react-router-dom";
import { useState, useEffect, useRef, useMemo } from "react";
import { useAdminAuth } from "@/contexts/AdminAuthContext";
import { useDashboardStats, usePlans, useClients, usePayments, useAllServiceRecords } from "@/hooks/useSupabaseData";
import ExportFinanceiroModal from "@/components/admin/ExportFinanceiroModal";
import { useKpiGoals } from "@/hooks/useKpiGoals";
import { cn } from "@/lib/utils";
import { format } from "date-fns";

const fmt = (v: number) => v.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

const COLORS = ["hsl(24,95%,50%)", "hsl(15,90%,42%)", "hsl(350,80%,55%)", "hsl(40,90%,50%)", "hsl(200,80%,50%)"];

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [financeiroOpen, setFinanceiroOpen] = useState(false);
  const { admin } = useAdminAuth();
  const [currentTime, setCurrentTime] = useState(new Date());
  const { stats, loading: statsLoading } = useDashboardStats();
  const { plans } = usePlans();
  const { clients } = useClients();
  const { payments } = usePayments();
  const { records: serviceRecords } = useAllServiceRecords();
  const { getGoal, updateGoal, history: kpiHistory } = useKpiGoals();
  const [editingKpi, setEditingKpi] = useState<string | null>(null);
  const [editValue, setEditValue] = useState("");
  const kpiNotifiedRef = useRef<Set<string>>(new Set());
  const [trendPeriod, setTrendPeriod] = useState<7 | 30 | 90>(30);
  const [whatIfGrowth, setWhatIfGrowth] = useState<number | null>(null);
  const [exportingPdf, setExportingPdf] = useState(false);
  const dashboardRef = useRef<HTMLDivElement>(null);
  const [compStartDate, setCompStartDate] = useState<Date>(() => {
    const d = new Date(); d.setMonth(d.getMonth() - 5); d.setDate(1); return d;
  });
  const [compEndDate, setCompEndDate] = useState<Date>(new Date());

  // Auto-notify when KPIs are below 50%
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 60000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    if (statsLoading) return;
    const metaReceita = getGoal("meta_receita");
    const metaClientes = getGoal("meta_clientes");
    const metaNovos = getGoal("meta_novos_30d");

    const kpis = [
      { key: "receita", label: "Receita Mensal", current: stats.mrr, target: metaReceita },
      { key: "clientes", label: "Clientes Total", current: stats.totalClients, target: metaClientes },
      { key: "novos", label: "Novos Clientes 30d", current: stats.newLast30, target: metaNovos },
    ];

    kpis.forEach(kpi => {
      if (kpi.target <= 0) return;
      const pct = (kpi.current / kpi.target) * 100;
      if (pct < 50 && !kpiNotifiedRef.current.has(kpi.key)) {
        kpiNotifiedRef.current.add(kpi.key);
        toast.error(`⚠️ Alerta: ${kpi.label} está em ${Math.round(pct)}% da meta (abaixo de 50%)`, {
          duration: 8000,
          description: `Atual: ${kpi.key === "receita" ? fmt(kpi.current) : kpi.current} | Meta: ${kpi.key === "receita" ? fmt(kpi.target) : kpi.target}`,
        });
      }
    });
  }, [statsLoading, stats, getGoal]);

  const greeting = (() => {
    const h = currentTime.getHours();
    if (h < 12) return "Bom dia";
    if (h < 18) return "Boa tarde";
    return "Boa noite";
  })();

  // Build chart data from plans
  const planDistribution = plans.map(p => ({ name: p.speed, value: p.active_clients }));

  // Build monthly client growth chart data
  const clientGrowthData = (() => {
    const months: Record<string, number> = {};
    clients.forEach(c => {
      const d = new Date(c.join_date);
      const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
      months[key] = (months[key] || 0) + 1;
    });
    const sorted = Object.entries(months).sort((a, b) => a[0].localeCompare(b[0]));
    let acc = 0;
    return sorted.map(([m, count]) => {
      acc += count;
      const [y, mo] = m.split("-");
      return { mes: `${mo}/${y.slice(2)}`, novos: count, total: acc };
    });
  })();

  // Build monthly revenue chart data
  const revenueData = (() => {
    const months: Record<string, { pago: number; pendente: number }> = {};
    payments.forEach(p => {
      const d = new Date(p.due_date);
      const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
      if (!months[key]) months[key] = { pago: 0, pendente: 0 };
      if (p.status === "Pago") months[key].pago += p.amount;
      else months[key].pendente += p.amount;
    });
    return Object.entries(months)
      .sort((a, b) => a[0].localeCompare(b[0]))
      .map(([m, v]) => {
        const [y, mo] = m.split("-");
        return { mes: `${mo}/${y.slice(2)}`, pago: v.pago, pendente: v.pendente };
      });
  })();

  // Alerts based on real stats
  const alerts = [
    ...(stats.inadimplentes > 0 ? [{ type: "warning" as const, message: `${stats.inadimplentes} clientes inadimplentes precisam de atenção` }] : []),
    ...(stats.cancelados > 0 ? [{ type: "danger" as const, message: `${stats.cancelados} clientes cancelados` }] : []),
    ...(stats.growthRate > 0 ? [{ type: "info" as const, message: `Crescimento de ${stats.growthRate}% nos últimos 30 dias` }] : []),
  ];

  const alertIcons = { warning: AlertTriangle, danger: AlertCircle, info: Info };
  const alertColors = {
    warning: "bg-amber-500/10 border-amber-500/20 text-amber-400",
    danger: "bg-red-500/10 border-red-500/20 text-red-400",
    info: "bg-blue-500/10 border-blue-500/20 text-blue-400",
  };

  const summaryCards = [
    { label: "Total de Clientes", value: stats.totalClients.toLocaleString(), icon: Users, color: "text-primary" },
    { label: "Clientes Ativos", value: stats.activeClients.toLocaleString(), icon: UserCheck, color: "text-emerald-400" },
    { label: "Inadimplentes", value: stats.inadimplentes.toLocaleString(), icon: AlertTriangle, color: "text-amber-400" },
    { label: "Cancelados", value: stats.cancelados.toLocaleString(), icon: UserX, color: "text-red-400" },
  ];

  const financeCards = [
    { label: "Receita Mensal (MRR)", value: fmt(stats.mrr), icon: DollarSign },
    { label: "Receita Anual", value: fmt(stats.totalRevenue), icon: TrendingUp },
    { label: "Ticket Médio", value: fmt(stats.ticketMedio), icon: BarChart3 },
    { label: "Faturamento Previsto", value: fmt(stats.forecast), icon: ArrowUpRight },
  ];

  const salesCards = [
    { label: "Novos (7 dias)", value: stats.newLast7 },
    { label: "Novos (30 dias)", value: stats.newLast30 },
    { label: "Crescimento", value: `${stats.growthRate}%` },
  ];

  const handleExportClients = () => {
    const data = clients.map(c => ({
      Nome: c.name, Email: c.email, Telefone: c.phone, Plano: c.plan_name || "",
      "Valor (R$)": (c.plan_price || 0).toFixed(2), Status: c.status, "Cliente desde": c.join_date,
    }));
    if (!data.length) { toast.error("Nenhum dado para exportar"); return; }
    exportToCSV(data, "clientes_completo_jdtelecom");
    toast.success(`${data.length} clientes exportados com sucesso`);
  };

  const handleExportPdf = async () => {
    if (!dashboardRef.current) return;
    setExportingPdf(true);
    try {
      const html2canvas = (await import("html2canvas-pro")).default;
      const { jsPDF } = await import("jspdf");
      const canvas = await html2canvas(dashboardRef.current, {
        scale: 1.5,
        useCORS: true,
        backgroundColor: "#0f1117",
        logging: false,
      });
      const imgData = canvas.toDataURL("image/jpeg", 0.85);
      const imgW = canvas.width;
      const imgH = canvas.height;
      const pdfW = 297; // A4 landscape width mm
      const pdfH = 210;
      const ratio = pdfW / imgW;
      const totalHeight = imgH * ratio;
      const pages = Math.ceil(totalHeight / pdfH);
      const pdf = new jsPDF({ orientation: "landscape", unit: "mm", format: "a4" });
      for (let i = 0; i < pages; i++) {
        if (i > 0) pdf.addPage();
        pdf.addImage(imgData, "JPEG", 0, -(i * pdfH), pdfW, totalHeight);
      }
      pdf.save(`dashboard-jdtelecom-${new Date().toISOString().slice(0, 10)}.pdf`);
      toast.success("Dashboard exportado em PDF!");
    } catch (err) {
      console.error(err);
      toast.error("Erro ao exportar PDF");
    }
    setExportingPdf(false);
  };

  if (statsLoading) {
    return (
      <div className="admin-page flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div ref={dashboardRef} className="admin-page space-y-6 w-full overflow-hidden">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="font-display text-2xl md:text-3xl font-bold text-[hsl(var(--dark-section-fg))]">
            {greeting}, {admin?.name?.split(" ")[0] || "Admin"} 👋
          </h1>
          <p className="text-sm text-[hsl(var(--dark-section-muted))] mt-1">
            {currentTime.toLocaleDateString("pt-BR", { weekday: "long", day: "numeric", month: "long", year: "numeric" })} — Visão geral da JD Telecom
          </p>
        </div>
        <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
          <Button onClick={handleExportClients} size="sm"
            className="bg-[hsl(var(--dark-section-card))] border border-[hsl(var(--dark-section-border))] text-[hsl(var(--dark-section-fg))] hover:bg-primary/20 rounded-xl text-xs flex-1 sm:flex-none">
            <FileSpreadsheet className="w-3.5 h-3.5 mr-1.5" /> Clientes
          </Button>
          <Button onClick={() => setFinanceiroOpen(true)} size="sm"
            className="bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs flex-1 sm:flex-none">
            <Download className="w-3.5 h-3.5 mr-1.5" /> Financeiro
          </Button>
          <Button onClick={handleExportPdf} size="sm" disabled={exportingPdf}
            className="bg-red-600 hover:bg-red-700 text-white rounded-xl text-xs flex-1 sm:flex-none">
            {exportingPdf ? <Loader2 className="w-3.5 h-3.5 mr-1.5 animate-spin" /> : <FileText className="w-3.5 h-3.5 mr-1.5" />} PDF
          </Button>
        </div>
      </div>

      {alerts.length > 0 && (
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
      )}

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
            <span className="text-sm sm:text-xs font-semibold text-[hsl(var(--dark-section-muted))] group-hover:text-[hsl(var(--dark-section-fg))] transition-colors text-center">{q.label}</span>
          </button>
        ))}
      </div>

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
            {plans.slice(0, 5).map((p) => (
              <div key={p.id} className="flex items-center justify-between text-sm">
                <span className="text-[hsl(var(--dark-section-muted))]">{p.name}</span>
                <span className="font-bold text-[hsl(var(--dark-section-fg))]">{p.active_clients}</span>
              </div>
            ))}
            {plans.length > 0 && (
              <p className="text-xs text-primary font-medium pt-1">
                Mais vendido: {plans.reduce((a, b) => a.active_clients > b.active_clients ? a : b).name}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Interactive Charts */}
      <div className="grid md:grid-cols-2 gap-4">
        {clientGrowthData.length > 0 && (
          <div className="bg-[hsl(var(--dark-section-card))] border border-[hsl(var(--dark-section-border))] rounded-2xl p-5">
            <h3 className="font-display font-semibold text-[hsl(var(--dark-section-fg))] mb-4 flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-primary" /> Evolução de Clientes
            </h3>
            <ResponsiveContainer width="100%" height={250}>
              <AreaChart data={clientGrowthData}>
                <defs>
                  <linearGradient id="colorTotal" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="hsl(24,95%,50%)" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="hsl(24,95%,50%)" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(220,14%,22%)" />
                <XAxis dataKey="mes" tick={{ fill: "hsl(220,10%,55%)", fontSize: 11 }} />
                <YAxis tick={{ fill: "hsl(220,10%,55%)", fontSize: 11 }} />
                <Tooltip contentStyle={{ background: "hsl(220,18%,14%)", border: "1px solid hsl(220,14%,22%)", borderRadius: 12, color: "#fff" }} />
                <Area type="monotone" dataKey="total" stroke="hsl(24,95%,50%)" fill="url(#colorTotal)" strokeWidth={2} name="Total Acumulado" />
                <Area type="monotone" dataKey="novos" stroke="hsl(160,80%,50%)" fill="hsl(160,80%,50%)" fillOpacity={0.15} strokeWidth={2} name="Novos" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        )}

        {revenueData.length > 0 && (
          <div className="bg-[hsl(var(--dark-section-card))] border border-[hsl(var(--dark-section-border))] rounded-2xl p-5">
            <h3 className="font-display font-semibold text-[hsl(var(--dark-section-fg))] mb-4 flex items-center gap-2">
              <DollarSign className="w-4 h-4 text-primary" /> Receita Mensal
            </h3>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={revenueData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(220,14%,22%)" />
                <XAxis dataKey="mes" tick={{ fill: "hsl(220,10%,55%)", fontSize: 11 }} />
                <YAxis tick={{ fill: "hsl(220,10%,55%)", fontSize: 11 }} tickFormatter={v => `R$${(v/1000).toFixed(0)}k`} />
                <Tooltip contentStyle={{ background: "hsl(220,18%,14%)", border: "1px solid hsl(220,14%,22%)", borderRadius: 12, color: "#fff" }} formatter={(v: number) => [`R$ ${v.toFixed(2)}`, ""]} />
                <Legend wrapperStyle={{ color: "hsl(220,10%,70%)", fontSize: 12 }} />
                <Bar dataKey="pago" fill="hsl(160,70%,45%)" radius={[4, 4, 0, 0]} name="Pago" />
                <Bar dataKey="pendente" fill="hsl(40,90%,50%)" radius={[4, 4, 0, 0]} name="Pendente" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>

      {planDistribution.length > 0 && (
        <div className="bg-[hsl(var(--dark-section-card))] border border-[hsl(var(--dark-section-border))] rounded-2xl p-5">
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
      )}

      {/* KPIs & Metas (Editable) */}
      {(() => {
        const metaReceita = getGoal("meta_receita");
        const metaClientes = getGoal("meta_clientes");
        const metaNovos30 = getGoal("meta_novos_30d");
        const pctReceita = metaReceita > 0 ? Math.min(100, Math.round((stats.mrr / metaReceita) * 100)) : 0;
        const pctClientes = metaClientes > 0 ? Math.min(100, Math.round((stats.totalClients / metaClientes) * 100)) : 0;
        const pctNovos = metaNovos30 > 0 ? Math.min(100, Math.round((stats.newLast30 / metaNovos30) * 100)) : 0;

        const kpis = [
          { key: "meta_receita", label: "Meta Receita Mensal", current: fmt(stats.mrr), target: fmt(metaReceita), rawTarget: metaReceita, pct: pctReceita, color: "bg-emerald-500", isCurrency: true },
          { key: "meta_clientes", label: "Meta Clientes Total", current: String(stats.totalClients), target: String(metaClientes), rawTarget: metaClientes, pct: pctClientes, color: "bg-primary", isCurrency: false },
          { key: "meta_novos_30d", label: "Novos Clientes (30d)", current: String(stats.newLast30), target: String(metaNovos30), rawTarget: metaNovos30, pct: pctNovos, color: "bg-blue-500", isCurrency: false },
        ];

        // KPI Notifications
        kpis.forEach(k => {
          const notifKey = `${k.key}_${k.pct >= 100 ? "100" : k.pct < 50 ? "50" : ""}`;
          if (notifKey.endsWith("_")) return;
          if (!kpiNotifiedRef.current.has(notifKey)) {
            kpiNotifiedRef.current.add(notifKey);
            if (k.pct >= 100) {
              toast.success(`🎯 ${k.label}: Meta atingida! (${k.pct}%)`, { duration: 6000 });
            } else if (k.pct < 50 && k.rawTarget > 0) {
              toast.warning(`⚠️ ${k.label}: Abaixo de 50% da meta (${k.pct}%)`, { duration: 6000 });
            }
          }
        });

        const handleSaveKpi = (key: string) => {
          const val = parseFloat(editValue);
          if (isNaN(val) || val <= 0) { toast.error("Valor inválido"); return; }
          updateGoal(key, val, admin?.name || "Admin");
          setEditingKpi(null);
        };

        return (
          <div className="bg-[hsl(var(--dark-section-card))] border border-[hsl(var(--dark-section-border))] rounded-2xl p-5">
            <h3 className="font-display font-semibold text-[hsl(var(--dark-section-fg))] mb-4 flex items-center gap-2">
              <Target className="w-4 h-4 text-primary" /> Metas & KPIs
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {kpis.map(k => (
                <div key={k.key} className="p-4 rounded-xl bg-[hsl(var(--dark-section))]/50 space-y-3">
                  <p className="text-[10px] uppercase text-[hsl(var(--dark-section-muted))] font-semibold tracking-wider">{k.label}</p>
                  <div className="flex items-end justify-between">
                    <p className="font-display text-2xl font-bold text-[hsl(var(--dark-section-fg))]">{k.current}</p>
                    {editingKpi === k.key ? (
                      <div className="flex items-center gap-1">
                        <input
                          type="number"
                          value={editValue}
                          onChange={e => setEditValue(e.target.value)}
                          onKeyDown={e => e.key === "Enter" && handleSaveKpi(k.key)}
                          className="w-20 h-7 bg-[hsl(var(--dark-section))] border border-[hsl(var(--dark-section-border))] text-[hsl(var(--dark-section-fg))] rounded-lg px-2 text-xs"
                          autoFocus
                        />
                        <button onClick={() => handleSaveKpi(k.key)} className="text-emerald-400 hover:text-emerald-300">
                          <Check className="w-4 h-4" />
                        </button>
                        <button onClick={() => setEditingKpi(null)} className="text-[hsl(var(--dark-section-muted))] hover:text-[hsl(var(--dark-section-fg))]">
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={() => { setEditingKpi(k.key); setEditValue(String(k.rawTarget)); }}
                        className="flex items-center gap-1 text-xs text-[hsl(var(--dark-section-muted))] hover:text-primary transition-colors group"
                      >
                        <span>/ {k.target}</span>
                        <Pencil className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                      </button>
                    )}
                  </div>
                  <div className="w-full h-2 rounded-full bg-[hsl(var(--dark-section-border))]">
                    <div className={`h-full rounded-full ${k.color} transition-all duration-700`} style={{ width: `${k.pct}%` }} />
                  </div>
                  <p className={`text-xs font-bold ${k.pct >= 100 ? "text-emerald-400" : k.pct >= 70 ? "text-primary" : "text-amber-400"}`}>
                    {k.pct}% {k.pct >= 100 ? "✓ Meta atingida!" : "da meta"}
                  </p>
                </div>
              ))}
            </div>
          </div>
        );
      })()}

      {/* KPI Trend Chart with Period Filter & Meta vs Real */}
      {kpiHistory.length > 1 && (() => {
        const cutoff = new Date();
        cutoff.setDate(cutoff.getDate() - trendPeriod);
        const filtered = kpiHistory.filter(e => new Date(e.changed_at) >= cutoff);

        // Build trend data from filtered history
        const trendMap: Record<string, Record<string, number>> = {};
        [...filtered].reverse().forEach(entry => {
          const d = new Date(entry.changed_at);
          const dateKey = d.toLocaleDateString("pt-BR", { day: "2-digit", month: "2-digit" });
          if (!trendMap[dateKey]) trendMap[dateKey] = {};
          trendMap[dateKey][entry.label] = entry.new_value;
        });
        const trendLabels = [...new Set(filtered.map(e => e.label))];
        const trendData = Object.entries(trendMap).map(([date, vals]) => ({
          data: date,
          ...vals,
        }));
        const trendColors = ["hsl(160,70%,45%)", "hsl(24,95%,50%)", "hsl(210,80%,55%)"];

        // Meta vs Real comparison data with alert flags
        const metaVsReal = [
          { name: "Receita", meta: getGoal("meta_receita"), real: stats.mrr },
          { name: "Clientes", meta: getGoal("meta_clientes"), real: stats.totalClients },
          { name: "Novos 30d", meta: getGoal("meta_novos_30d"), real: stats.newLast30 },
        ].map(item => ({
          ...item,
          pct: item.meta > 0 ? Math.round((item.real / item.meta) * 100) : 0,
          alert: item.meta > 0 && (item.real / item.meta) < 0.5,
        }));

        const periodButtons = [
          { label: "7d", value: 7 as const },
          { label: "30d", value: 30 as const },
          { label: "90d", value: 90 as const },
        ];

        return (
          <div className="grid md:grid-cols-2 gap-4">
            {/* Trend Line Chart */}
            <div className="bg-[hsl(var(--dark-section-card))] border border-[hsl(var(--dark-section-border))] rounded-2xl p-5">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-display font-semibold text-[hsl(var(--dark-section-fg))] flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-primary" /> Tendência de Metas
                </h3>
                <div className="flex gap-1">
                  {periodButtons.map(pb => (
                    <button
                      key={pb.value}
                      onClick={() => setTrendPeriod(pb.value)}
                      className={`px-2.5 py-1 rounded-lg text-[10px] font-semibold transition-colors ${
                        trendPeriod === pb.value
                          ? "bg-primary text-primary-foreground"
                          : "bg-[hsl(var(--dark-section))]/50 text-[hsl(var(--dark-section-muted))] hover:text-[hsl(var(--dark-section-fg))]"
                      }`}
                    >
                      {pb.label}
                    </button>
                  ))}
                </div>
              </div>
              {trendData.length > 0 ? (
                <ResponsiveContainer width="100%" height={250}>
                  <LineChart data={trendData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(220,14%,22%)" />
                    <XAxis dataKey="data" tick={{ fill: "hsl(220,10%,55%)", fontSize: 11 }} />
                    <YAxis tick={{ fill: "hsl(220,10%,55%)", fontSize: 11 }} />
                    <Tooltip contentStyle={{ background: "hsl(220,18%,14%)", border: "1px solid hsl(220,14%,22%)", borderRadius: 12, color: "#fff" }} />
                    <Legend wrapperStyle={{ color: "hsl(220,10%,70%)", fontSize: 12 }} />
                    {trendLabels.map((label, i) => (
                      <Line key={label} type="monotone" dataKey={label} stroke={trendColors[i % trendColors.length]} strokeWidth={2} dot={{ r: 4 }} name={label} />
                    ))}
                  </LineChart>
                </ResponsiveContainer>
              ) : (
                <p className="text-xs text-[hsl(var(--dark-section-muted))] text-center py-12">Sem dados no período selecionado</p>
              )}
            </div>

            {/* Meta vs Real Bar Chart */}
            <div className="bg-[hsl(var(--dark-section-card))] border border-[hsl(var(--dark-section-border))] rounded-2xl p-5">
              <h3 className="font-display font-semibold text-[hsl(var(--dark-section-fg))] mb-4 flex items-center gap-2">
                <Target className="w-4 h-4 text-primary" /> Meta vs Real
              </h3>
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={metaVsReal} barGap={4}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(220,14%,22%)" />
                  <XAxis dataKey="name" tick={{ fill: "hsl(220,10%,55%)", fontSize: 11 }} />
                  <YAxis tick={{ fill: "hsl(220,10%,55%)", fontSize: 11 }} />
                  <Tooltip
                    contentStyle={{ background: "hsl(220,18%,14%)", border: "1px solid hsl(220,14%,22%)", borderRadius: 12, color: "#fff" }}
                    formatter={(value: number, name: string) => [value.toLocaleString("pt-BR"), name]}
                  />
                  <Legend wrapperStyle={{ color: "hsl(220,10%,70%)", fontSize: 12 }} />
                  <Bar dataKey="meta" fill="hsl(220,60%,50%)" radius={[4, 4, 0, 0]} name="Meta" />
                  <Bar dataKey="real" radius={[4, 4, 0, 0]} name="Real">
                    {metaVsReal.map((entry, idx) => (
                      <Cell key={idx} fill={entry.alert ? "hsl(0,70%,50%)" : "hsl(160,70%,45%)"} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
              {/* Alert badges below chart */}
              <div className="flex gap-3 mt-3">
                {metaVsReal.map(item => (
                  <div key={item.name} className={`flex-1 text-center px-2 py-1.5 rounded-lg text-[10px] font-semibold ${
                    item.alert
                      ? "bg-red-500/15 text-red-400 border border-red-500/30"
                      : item.pct >= 100
                        ? "bg-emerald-500/15 text-emerald-400 border border-emerald-500/30"
                        : "bg-[hsl(var(--dark-section))]/50 text-[hsl(var(--dark-section-muted))] border border-transparent"
                  }`}>
                    {item.name}: {item.pct}% {item.alert && "⚠️"} {item.pct >= 100 && "✓"}
                  </div>
                ))}
              </div>
            </div>
          </div>
        );
      })()}

      {/* Predictive Analysis with What-If */}
      {(() => {
        const metaReceita = getGoal("meta_receita");
        const metaClientes = getGoal("meta_clientes");
        const metaNovos = getGoal("meta_novos_30d");

        const monthlyGrowth = (() => {
          if (clientGrowthData.length < 2) return 0;
          const last = clientGrowthData[clientGrowthData.length - 1];
          const prev = clientGrowthData[clientGrowthData.length - 2];
          if (!prev || prev.total === 0) return 0;
          return (last.total - prev.total) / prev.total;
        })();

        const revenueGrowth = (() => {
          if (revenueData.length < 2) return 0;
          const last = revenueData[revenueData.length - 1];
          const prev = revenueData[revenueData.length - 2];
          if (!prev || prev.pago === 0) return 0;
          return (last.pago - prev.pago) / prev.pago;
        })();

        // What-if overrides
        const simRevGrowth = whatIfGrowth !== null ? whatIfGrowth / 100 : revenueGrowth;
        const simClientGrowth = whatIfGrowth !== null ? whatIfGrowth / 100 : monthlyGrowth;

        const projectMonths = (current: number, target: number, growthRate: number): number | null => {
          if (current >= target) return 0;
          if (growthRate <= 0) return null;
          return Math.ceil(Math.log(target / current) / Math.log(1 + growthRate));
        };

        const predictions = [
          {
            label: "Receita Mensal",
            current: stats.mrr,
            target: metaReceita,
            pct: metaReceita > 0 ? Math.round((stats.mrr / metaReceita) * 100) : 0,
            growth: simRevGrowth,
            realGrowth: revenueGrowth,
            months: projectMonths(stats.mrr, metaReceita, simRevGrowth),
            format: (v: number) => fmt(v),
          },
          {
            label: "Clientes Total",
            current: stats.totalClients,
            target: metaClientes,
            pct: metaClientes > 0 ? Math.round((stats.totalClients / metaClientes) * 100) : 0,
            growth: simClientGrowth,
            realGrowth: monthlyGrowth,
            months: projectMonths(stats.totalClients, metaClientes, simClientGrowth),
            format: (v: number) => String(v),
          },
          {
            label: "Novos Clientes 30d",
            current: stats.newLast30,
            target: metaNovos,
            pct: metaNovos > 0 ? Math.round((stats.newLast30 / metaNovos) * 100) : 0,
            growth: simClientGrowth,
            realGrowth: monthlyGrowth,
            months: projectMonths(stats.newLast30, metaNovos, simClientGrowth),
            format: (v: number) => String(v),
          },
        ];

        // Projection data with both real and what-if lines
        const projectionData = Array.from({ length: 7 }, (_, i) => {
          const d = new Date();
          d.setMonth(d.getMonth() + i);
          const label = d.toLocaleDateString("pt-BR", { month: "short", year: "2-digit" });
          return {
            mes: label,
            receita: Math.round(stats.mrr * Math.pow(1 + (revenueGrowth || 0.02), i)),
            ...(whatIfGrowth !== null ? { receitaWhatIf: Math.round(stats.mrr * Math.pow(1 + simRevGrowth, i)) } : {}),
            metaReceita,
          };
        });

        return (
          <div className="bg-[hsl(var(--dark-section-card))] border border-[hsl(var(--dark-section-border))] rounded-2xl p-5">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-display font-semibold text-[hsl(var(--dark-section-fg))] flex items-center gap-2">
                <Zap className="w-4 h-4 text-primary" /> Análise Preditiva
              </h3>
            </div>

            {/* What-If Slider */}
            <div className="mb-5 p-4 rounded-xl bg-[hsl(var(--dark-section))]/50 border border-[hsl(var(--dark-section-border))]">
              <div className="flex items-center justify-between mb-2">
                <p className="text-xs font-semibold text-[hsl(var(--dark-section-fg))] flex items-center gap-2">
                  🔮 Cenário What-If — Simular taxa de crescimento
                </p>
                {whatIfGrowth !== null && (
                  <button
                    onClick={() => setWhatIfGrowth(null)}
                    className="text-[10px] text-[hsl(var(--dark-section-muted))] hover:text-primary px-2 py-1 rounded-lg bg-[hsl(var(--dark-section))]/50"
                  >
                    Resetar para real
                  </button>
                )}
              </div>
              <div className="flex items-center gap-4">
                <span className="text-[10px] text-[hsl(var(--dark-section-muted))] w-8">0%</span>
                <input
                  type="range"
                  min={0}
                  max={50}
                  step={1}
                  value={whatIfGrowth ?? Math.round(Math.max(revenueGrowth, monthlyGrowth) * 100)}
                  onChange={(e) => setWhatIfGrowth(Number(e.target.value))}
                  className="flex-1 h-2 rounded-full appearance-none cursor-pointer accent-primary"
                  style={{ background: `linear-gradient(to right, hsl(24,95%,50%) ${((whatIfGrowth ?? Math.round(Math.max(revenueGrowth, monthlyGrowth) * 100)) / 50) * 100}%, hsl(220,14%,22%) 0%)` }}
                />
                <span className="text-[10px] text-[hsl(var(--dark-section-muted))] w-8">50%</span>
                <span className="text-sm font-bold text-primary min-w-[48px] text-right">
                  {whatIfGrowth !== null ? `${whatIfGrowth}%` : `${Math.round(Math.max(revenueGrowth, monthlyGrowth) * 100)}%`}
                </span>
              </div>
              {whatIfGrowth !== null && (
                <p className="text-[10px] text-amber-400 mt-2">
                  ⚡ Simulando com {whatIfGrowth}%/mês (real: {(Math.max(revenueGrowth, monthlyGrowth) * 100).toFixed(1)}%/mês)
                </p>
              )}
            </div>

            {/* Prediction Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-5">
              {predictions.map(p => {
                const statusColor = p.pct >= 100
                  ? "text-emerald-400"
                  : p.months !== null && p.months <= 3
                    ? "text-primary"
                    : p.months === null
                      ? "text-red-400"
                      : "text-amber-400";
                return (
                  <div key={p.label} className="p-4 rounded-xl bg-[hsl(var(--dark-section))]/50 space-y-2">
                    <p className="text-[10px] uppercase text-[hsl(var(--dark-section-muted))] font-semibold tracking-wider">{p.label}</p>
                    <div className="flex items-baseline justify-between">
                      <span className="text-lg font-bold text-[hsl(var(--dark-section-fg))]">{p.format(p.current)}</span>
                      <span className="text-xs text-[hsl(var(--dark-section-muted))]">→ {p.format(p.target)}</span>
                    </div>
                    <p className={`text-xs font-bold ${statusColor}`}>
                      {p.pct >= 100 ? (
                        "✓ Meta atingida!"
                      ) : p.months === null ? (
                        "⚠️ Crescimento insuficiente"
                      ) : p.months === 0 ? (
                        "✓ Meta atingida!"
                      ) : (
                        `📈 ~${p.months} ${p.months === 1 ? "mês" : "meses"} para atingir`
                      )}
                    </p>
                    <p className="text-[10px] text-[hsl(var(--dark-section-muted))]">
                      Taxa: {(p.growth * 100).toFixed(1)}%/mês
                      {whatIfGrowth !== null && <span className="text-amber-400 ml-1">(real: {(p.realGrowth * 100).toFixed(1)}%)</span>}
                    </p>
                  </div>
                );
              })}
            </div>

            {/* Scenarios Comparison Side-by-Side */}
            <div className="mb-5">
              <p className="text-[10px] uppercase text-[hsl(var(--dark-section-muted))] font-semibold tracking-wider mb-3">
                📊 Comparação de Cenários — Receita em 6 meses
              </p>
              {(() => {
                const pessimistRate = Math.max(0, revenueGrowth * 0.5);
                const realistRate = revenueGrowth > 0 ? revenueGrowth : 0.02;
                const optimistRate = Math.max(revenueGrowth * 1.5, 0.1);

                const scenarios = [
                  { name: "Pessimista", rate: pessimistRate, color: "text-red-400", bg: "bg-red-500/10 border-red-500/20", icon: "📉" },
                  { name: "Realista", rate: realistRate, color: "text-primary", bg: "bg-primary/10 border-primary/20", icon: "📊" },
                  { name: "Otimista", rate: optimistRate, color: "text-emerald-400", bg: "bg-emerald-500/10 border-emerald-500/20", icon: "🚀" },
                ];

                return (
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    {scenarios.map(s => {
                      const projected6m = Math.round(stats.mrr * Math.pow(1 + s.rate, 6));
                      const projClients6m = Math.round(stats.totalClients * Math.pow(1 + (s.name === "Pessimista" ? monthlyGrowth * 0.5 : s.name === "Otimista" ? Math.max(monthlyGrowth * 1.5, 0.1) : monthlyGrowth > 0 ? monthlyGrowth : 0.05), 6));
                      const monthsToMeta = projectMonths(stats.mrr, metaReceita, s.rate);
                      return (
                        <div key={s.name} className={`p-4 rounded-xl border ${s.bg} space-y-3`}>
                          <div className="flex items-center gap-2">
                            <span className="text-lg">{s.icon}</span>
                            <p className={`text-xs font-bold ${s.color} uppercase tracking-wider`}>{s.name}</p>
                          </div>
                          <div>
                            <p className="text-[10px] text-[hsl(var(--dark-section-muted))]">Taxa mensal</p>
                            <p className={`text-sm font-bold ${s.color}`}>{(s.rate * 100).toFixed(1)}%/mês</p>
                          </div>
                          <div>
                            <p className="text-[10px] text-[hsl(var(--dark-section-muted))]">Receita em 6 meses</p>
                            <p className="text-lg font-bold text-[hsl(var(--dark-section-fg))]">{fmt(projected6m)}</p>
                          </div>
                          <div>
                            <p className="text-[10px] text-[hsl(var(--dark-section-muted))]">Clientes em 6 meses</p>
                            <p className="text-sm font-bold text-[hsl(var(--dark-section-fg))]">{projClients6m}</p>
                          </div>
                          <div>
                            <p className="text-[10px] text-[hsl(var(--dark-section-muted))]">Meta receita</p>
                            <p className={`text-xs font-bold ${monthsToMeta === null ? "text-red-400" : monthsToMeta === 0 ? "text-emerald-400" : s.color}`}>
                              {monthsToMeta === null ? "❌ Não atinge" : monthsToMeta === 0 ? "✓ Atingida" : `~${monthsToMeta} meses`}
                            </p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                );
              })()}
            </div>

            {/* Comparative 3-Scenario Chart */}
            {(() => {
              const pessimistRate = Math.max(0, revenueGrowth * 0.5);
              const realistRate = revenueGrowth > 0 ? revenueGrowth : 0.02;
              const optimistRate = Math.max(revenueGrowth * 1.5, 0.1);

              const scenarioChartData = Array.from({ length: 7 }, (_, i) => {
                const d = new Date();
                d.setMonth(d.getMonth() + i);
                const label = d.toLocaleDateString("pt-BR", { month: "short", year: "2-digit" });
                return {
                  mes: label,
                  pessimista: Math.round(stats.mrr * Math.pow(1 + pessimistRate, i)),
                  realista: Math.round(stats.mrr * Math.pow(1 + realistRate, i)),
                  otimista: Math.round(stats.mrr * Math.pow(1 + optimistRate, i)),
                  meta: metaReceita,
                };
              });

              return (
                <div className="mb-5">
                  <div className="flex items-center justify-between mb-3">
                    <p className="text-[10px] uppercase text-[hsl(var(--dark-section-muted))] font-semibold tracking-wider">
                      📈 Gráfico Comparativo — 3 Cenários (6 meses)
                    </p>
                    <Button
                      size="sm"
                      variant="outline"
                      className="text-xs border-[hsl(var(--dark-section-border))] text-[hsl(var(--dark-section-muted))] hover:text-red-400 hover:border-red-400"
                      onClick={async () => {
                        try {
                          const { jsPDF } = await import("jspdf");
                          const pdf = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });
                          const pw = 210; const margin = 15; const cw = pw - margin * 2;
                          let y = 20;

                          // Header
                          pdf.setFillColor(15, 17, 23);
                          pdf.rect(0, 0, pw, 297, "F");
                          pdf.setTextColor(255, 140, 50);
                          pdf.setFontSize(18);
                          pdf.text("JD Telecom — Relatório de Cenários What-If", margin, y);
                          y += 8;
                          pdf.setFontSize(9);
                          pdf.setTextColor(150, 150, 160);
                          pdf.text(`Gerado em ${new Date().toLocaleString("pt-BR")}`, margin, y);
                          y += 12;

                          // Current metrics
                          pdf.setFontSize(12);
                          pdf.setTextColor(255, 255, 255);
                          pdf.text("Métricas Atuais", margin, y); y += 7;
                          pdf.setFontSize(9);
                          pdf.setTextColor(200, 200, 210);
                          pdf.text(`Receita Mensal (MRR): ${fmt(stats.mrr)}`, margin, y); y += 5;
                          pdf.text(`Total de Clientes: ${stats.totalClients}`, margin, y); y += 5;
                          pdf.text(`Meta de Receita: ${fmt(metaReceita)}`, margin, y); y += 5;
                          pdf.text(`Meta de Clientes: ${metaClientes}`, margin, y); y += 5;
                          pdf.text(`Crescimento Receita: ${(revenueGrowth * 100).toFixed(1)}%/mês`, margin, y); y += 5;
                          pdf.text(`Crescimento Clientes: ${(monthlyGrowth * 100).toFixed(1)}%/mês`, margin, y); y += 12;

                          // Scenarios table
                          const scenarios = [
                            { name: "Pessimista", rate: pessimistRate, emoji: "📉" },
                            { name: "Realista", rate: realistRate, emoji: "📊" },
                            { name: "Otimista", rate: optimistRate, emoji: "🚀" },
                          ];
                          pdf.setFontSize(12);
                          pdf.setTextColor(255, 255, 255);
                          pdf.text("Cenários de Projeção", margin, y); y += 8;

                          scenarios.forEach(s => {
                            const proj6m = Math.round(stats.mrr * Math.pow(1 + s.rate, 6));
                            const projClients = Math.round(stats.totalClients * Math.pow(1 + s.rate, 6));
                            const months = projectMonths(stats.mrr, metaReceita, s.rate);

                            pdf.setFontSize(10);
                            pdf.setTextColor(255, 140, 50);
                            pdf.text(`${s.name} (${(s.rate * 100).toFixed(1)}%/mês)`, margin, y); y += 6;
                            pdf.setFontSize(9);
                            pdf.setTextColor(200, 200, 210);
                            pdf.text(`  Receita em 6 meses: ${fmt(proj6m)}`, margin, y); y += 5;
                            pdf.text(`  Clientes em 6 meses: ${projClients}`, margin, y); y += 5;
                            pdf.text(`  Meta de receita: ${months === null ? "Não atinge" : months === 0 ? "Já atingida" : `~${months} meses`}`, margin, y); y += 8;
                          });

                          // Monthly projection table
                          y += 4;
                          pdf.setFontSize(12);
                          pdf.setTextColor(255, 255, 255);
                          pdf.text("Projeção Mensal Detalhada", margin, y); y += 8;

                          pdf.setFontSize(8);
                          pdf.setTextColor(150, 150, 160);
                          pdf.text("Mês", margin, y);
                          pdf.text("Pessimista", margin + 40, y);
                          pdf.text("Realista", margin + 80, y);
                          pdf.text("Otimista", margin + 120, y);
                          y += 5;
                          pdf.setDrawColor(50, 50, 60);
                          pdf.line(margin, y, margin + cw, y); y += 4;

                          scenarioChartData.forEach(row => {
                            pdf.setTextColor(200, 200, 210);
                            pdf.text(row.mes, margin, y);
                            pdf.text(fmt(row.pessimista), margin + 40, y);
                            pdf.text(fmt(row.realista), margin + 80, y);
                            pdf.text(fmt(row.otimista), margin + 120, y);
                            y += 5;
                          });

                          // What-if note
                          if (whatIfGrowth !== null) {
                            y += 8;
                            pdf.setFontSize(10);
                            pdf.setTextColor(255, 200, 50);
                            pdf.text(`Nota: Cenário What-If ativo com taxa simulada de ${whatIfGrowth}%/mês`, margin, y);
                          }

                          pdf.save(`cenarios-whatif-jdtelecom-${new Date().toISOString().slice(0, 10)}.pdf`);
                          toast.success("Relatório de cenários exportado em PDF!");
                        } catch (err) {
                          console.error(err);
                          toast.error("Erro ao exportar PDF de cenários");
                        }
                      }}
                    >
                      <FileText className="w-3 h-3 mr-1" /> PDF Cenários
                    </Button>
                  </div>
                  <ResponsiveContainer width="100%" height={260}>
                    <LineChart data={scenarioChartData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="hsl(220,14%,22%)" />
                      <XAxis dataKey="mes" tick={{ fill: "hsl(220,10%,55%)", fontSize: 10 }} />
                      <YAxis tick={{ fill: "hsl(220,10%,55%)", fontSize: 10 }} tickFormatter={v => `R$${(v / 1000).toFixed(0)}k`} />
                      <Tooltip contentStyle={{ background: "hsl(220,18%,14%)", border: "1px solid hsl(220,14%,22%)", borderRadius: 12, color: "#fff" }} formatter={(v: number) => [fmt(v), ""]} />
                      <Legend wrapperStyle={{ color: "hsl(220,10%,70%)", fontSize: 11 }} />
                      <Line type="monotone" dataKey="pessimista" stroke="hsl(0,70%,55%)" strokeWidth={2} dot={{ r: 3 }} name="📉 Pessimista" />
                      <Line type="monotone" dataKey="realista" stroke="hsl(24,95%,50%)" strokeWidth={2.5} dot={{ r: 4 }} name="📊 Realista" />
                      <Line type="monotone" dataKey="otimista" stroke="hsl(160,70%,45%)" strokeWidth={2} dot={{ r: 3 }} name="🚀 Otimista" />
                      <ReferenceLine y={metaReceita} stroke="hsl(260,70%,60%)" strokeWidth={2} strokeDasharray="8 4" label={{ value: "Meta", fill: "hsl(260,70%,60%)", fontSize: 10, position: "right" }} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              );
            })()}

            {/* Projection Chart */}
            <div>
              <p className="text-[10px] uppercase text-[hsl(var(--dark-section-muted))] font-semibold tracking-wider mb-3">
                Projeção de Receita (6 meses) {whatIfGrowth !== null && <span className="text-amber-400">— Cenário What-If</span>}
              </p>
              <ResponsiveContainer width="100%" height={220}>
                <AreaChart data={projectionData}>
                  <defs>
                    <linearGradient id="colorProj" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="hsl(24,95%,50%)" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="hsl(24,95%,50%)" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="colorWhatIf" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="hsl(45,90%,50%)" stopOpacity={0.2} />
                      <stop offset="95%" stopColor="hsl(45,90%,50%)" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(220,14%,22%)" />
                  <XAxis dataKey="mes" tick={{ fill: "hsl(220,10%,55%)", fontSize: 10 }} />
                  <YAxis tick={{ fill: "hsl(220,10%,55%)", fontSize: 10 }} tickFormatter={v => `R$${(v / 1000).toFixed(0)}k`} />
                  <Tooltip contentStyle={{ background: "hsl(220,18%,14%)", border: "1px solid hsl(220,14%,22%)", borderRadius: 12, color: "#fff" }} formatter={(v: number) => [fmt(v), ""]} />
                  <Legend wrapperStyle={{ color: "hsl(220,10%,70%)", fontSize: 11 }} />
                  <Area type="monotone" dataKey="receita" stroke="hsl(24,95%,50%)" fill="url(#colorProj)" strokeWidth={2} name="Projeção Real" />
                  {whatIfGrowth !== null && (
                    <Area type="monotone" dataKey="receitaWhatIf" stroke="hsl(45,90%,50%)" fill="url(#colorWhatIf)" strokeWidth={2} strokeDasharray="6 3" name={`What-If (${whatIfGrowth}%)`} />
                  )}
                  <ReferenceLine y={metaReceita} stroke="hsl(160,70%,45%)" strokeWidth={2} strokeDasharray="8 4" label={{ value: "Meta", fill: "hsl(160,70%,45%)", fontSize: 10, position: "right" }} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        );
      })()}

      {kpiHistory.length > 0 && (
        <div className="bg-[hsl(var(--dark-section-card))] border border-[hsl(var(--dark-section-border))] rounded-2xl p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-display font-semibold text-[hsl(var(--dark-section-fg))] flex items-center gap-2">
              <History className="w-4 h-4 text-primary" /> Histórico de Alterações de Metas
            </h3>
            <div className="flex gap-2">
              <Button
                size="sm"
                variant="outline"
                className="text-xs border-[hsl(var(--dark-section-border))] text-[hsl(var(--dark-section-muted))] hover:text-primary hover:border-primary"
                onClick={() => {
                  const csvData = kpiHistory.map(entry => ({
                    "Meta": entry.label,
                    "Valor Anterior": entry.old_value,
                    "Novo Valor": entry.new_value,
                    "Alterado Por": entry.changed_by,
                    "Data/Hora": new Date(entry.changed_at).toLocaleString("pt-BR"),
                  }));
                  if (exportToCSV(csvData, `historico-metas-${new Date().toISOString().slice(0, 10)}`)) {
                    toast.success(`${csvData.length} registros exportados (CSV)`);
                  }
                }}
              >
                <Download className="w-3 h-3 mr-1" /> CSV
              </Button>
              <Button
                size="sm"
                variant="outline"
                className="text-xs border-[hsl(var(--dark-section-border))] text-[hsl(var(--dark-section-muted))] hover:text-emerald-400 hover:border-emerald-400"
                onClick={() => {
                  const xlsData = kpiHistory.map(entry => ({
                    "Meta": entry.label,
                    "Valor Anterior": entry.old_value,
                    "Novo Valor": entry.new_value,
                    "Alterado Por": entry.changed_by,
                    "Data/Hora": new Date(entry.changed_at).toLocaleString("pt-BR"),
                  }));
                  if (exportToExcel(xlsData, `historico-metas-${new Date().toISOString().slice(0, 10)}`, {
                    reportTitle: "JD Telecom",
                    reportSubtitle: "Histórico de Alterações de Metas",
                  })) {
                    toast.success(`${xlsData.length} registros exportados (Excel)`);
                  }
                }}
              >
                <FileSpreadsheet className="w-3 h-3 mr-1" /> Excel
              </Button>
            </div>
          </div>

          {/* Visual Timeline Chart */}
          {(() => {
            const keyMap: Record<string, { label: string; entries: { date: string; value: number }[] }> = {};
            [...kpiHistory].reverse().forEach(entry => {
              if (!keyMap[entry.key]) keyMap[entry.key] = { label: entry.label, entries: [] };
              const dateStr = new Date(entry.changed_at).toLocaleDateString("pt-BR", { day: "2-digit", month: "2-digit" });
              // Add old value as first point
              if (keyMap[entry.key].entries.length === 0) {
                keyMap[entry.key].entries.push({ date: dateStr + " (ant)", value: entry.old_value });
              }
              keyMap[entry.key].entries.push({ date: dateStr, value: entry.new_value });
            });

            const timelineKeys = Object.keys(keyMap);
            if (timelineKeys.length === 0) return null;

            const allDates: string[] = [];
            timelineKeys.forEach(k => {
              keyMap[k].entries.forEach(e => {
                if (!allDates.includes(e.date)) allDates.push(e.date);
              });
            });

            const timelineData = allDates.map(date => {
              const point: Record<string, any> = { date };
              timelineKeys.forEach(k => {
                const match = keyMap[k].entries.find(e => e.date === date);
                if (match) point[keyMap[k].label] = match.value;
              });
              return point;
            });

            const lineColors = ["hsl(24,95%,50%)", "hsl(160,70%,45%)", "hsl(210,80%,55%)"];

            return (
              <div className="mb-5">
                <p className="text-[10px] uppercase text-[hsl(var(--dark-section-muted))] font-semibold tracking-wider mb-3">
                  📈 Evolução das Metas ao Longo do Tempo
                </p>
                <ResponsiveContainer width="100%" height={200}>
                  <LineChart data={timelineData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(220,14%,22%)" />
                    <XAxis dataKey="date" tick={{ fill: "hsl(220,10%,55%)", fontSize: 10 }} />
                    <YAxis tick={{ fill: "hsl(220,10%,55%)", fontSize: 10 }} />
                    <Tooltip contentStyle={{ background: "hsl(220,18%,14%)", border: "1px solid hsl(220,14%,22%)", borderRadius: 12, color: "#fff" }} />
                    <Legend wrapperStyle={{ color: "hsl(220,10%,70%)", fontSize: 11 }} />
                    {timelineKeys.map((k, i) => (
                      <Line key={k} type="monotone" dataKey={keyMap[k].label} stroke={lineColors[i % lineColors.length]} strokeWidth={2} dot={{ r: 4, fill: lineColors[i % lineColors.length] }} connectNulls name={keyMap[k].label} />
                    ))}
                  </LineChart>
                </ResponsiveContainer>
              </div>
            );
          })()}

          <div className="space-y-2 max-h-64 overflow-y-auto">
            {kpiHistory.slice(0, 20).map((entry, i) => {
              const date = new Date(entry.changed_at);
              const fmtDate = date.toLocaleDateString("pt-BR") + " " + date.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" });
              const isRevenue = entry.key === "meta_receita";
              const fmtVal = (v: number) => isRevenue ? fmt(v) : String(v);
              return (
                <div key={i} className="flex items-center gap-3 p-3 rounded-xl bg-[hsl(var(--dark-section))]/50 text-sm">
                  <Clock className="w-4 h-4 text-[hsl(var(--dark-section-muted))] shrink-0" />
                  <div className="flex-1 min-w-0">
                    <span className="text-[hsl(var(--dark-section-fg))] font-medium">{entry.label}</span>
                    <span className="text-[hsl(var(--dark-section-muted))]"> alterada de </span>
                    <span className="text-amber-400 font-semibold">{fmtVal(entry.old_value)}</span>
                    <span className="text-[hsl(var(--dark-section-muted))]"> para </span>
                    <span className="text-emerald-400 font-semibold">{fmtVal(entry.new_value)}</span>
                  </div>
                  <div className="text-right shrink-0">
                    <p className="text-xs text-primary font-medium">{entry.changed_by}</p>
                    <p className="text-[10px] text-[hsl(var(--dark-section-muted))]">{fmtDate}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Monthly Performance Comparison & Ranking */}
      {(() => {
        const now = new Date();
        const getMonthData = (monthsAgo: number) => {
          const start = new Date(now.getFullYear(), now.getMonth() - monthsAgo, 1);
          const end = new Date(now.getFullYear(), now.getMonth() - monthsAgo + 1, 0);
          const endStr = end.toISOString().slice(0, 10);
          const startStr = start.toISOString().slice(0, 10);
          const monthClients = clients.filter(c => c.join_date >= startStr && c.join_date <= endStr);
          const monthPayments = payments.filter(p => p.due_date >= startStr && p.due_date <= endStr);
          const revenue = monthPayments.filter(p => p.status === "Pago").reduce((s, p) => s + p.amount, 0);
          const pending = monthPayments.filter(p => p.status !== "Pago").reduce((s, p) => s + p.amount, 0);
          const monthLabel = start.toLocaleDateString("pt-BR", { month: "short", year: "2-digit" });
          return { label: monthLabel, newClients: monthClients.length, revenue, pending, total: revenue + pending };
        };

        const months = Array.from({ length: 6 }, (_, i) => getMonthData(5 - i));
        const currentMonth = months[months.length - 1];
        const prevMonth = months[months.length - 2];
        const revenueChange = prevMonth.revenue > 0 ? Math.round(((currentMonth.revenue - prevMonth.revenue) / prevMonth.revenue) * 100) : 0;
        const clientsChange = prevMonth.newClients > 0 ? Math.round(((currentMonth.newClients - prevMonth.newClients) / prevMonth.newClients) * 100) : 0;

        // Ranking by revenue
        const ranked = [...months].sort((a, b) => b.revenue - a.revenue).map((m, i) => ({ ...m, rank: i + 1 }));

        return (
          <div className="bg-[hsl(var(--dark-section-card))] border border-[hsl(var(--dark-section-border))] rounded-2xl p-5">
            <h3 className="font-display font-semibold text-[hsl(var(--dark-section-fg))] mb-4 flex items-center gap-2">
              <Trophy className="w-4 h-4 text-primary" /> Comparação Mensal & Ranking
            </h3>

            {/* Month-over-Month Summary */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-5">
              <div className="p-4 rounded-xl bg-[hsl(var(--dark-section))]/50 text-center">
                <p className="text-[10px] uppercase text-[hsl(var(--dark-section-muted))] font-semibold tracking-wider">Receita Mês Atual</p>
                <p className="font-display text-xl font-bold text-[hsl(var(--dark-section-fg))] mt-1">{fmt(currentMonth.revenue)}</p>
                <p className={`text-xs font-bold mt-1 ${revenueChange >= 0 ? "text-emerald-400" : "text-red-400"}`}>
                  {revenueChange >= 0 ? "↑" : "↓"} {Math.abs(revenueChange)}% vs mês anterior
                </p>
              </div>
              <div className="p-4 rounded-xl bg-[hsl(var(--dark-section))]/50 text-center">
                <p className="text-[10px] uppercase text-[hsl(var(--dark-section-muted))] font-semibold tracking-wider">Novos Clientes Mês Atual</p>
                <p className="font-display text-xl font-bold text-[hsl(var(--dark-section-fg))] mt-1">{currentMonth.newClients}</p>
                <p className={`text-xs font-bold mt-1 ${clientsChange >= 0 ? "text-emerald-400" : "text-red-400"}`}>
                  {clientsChange >= 0 ? "↑" : "↓"} {Math.abs(clientsChange)}% vs mês anterior
                </p>
              </div>
              <div className="p-4 rounded-xl bg-[hsl(var(--dark-section))]/50 text-center">
                <p className="text-[10px] uppercase text-[hsl(var(--dark-section-muted))] font-semibold tracking-wider">Melhor Mês (Receita)</p>
                <p className="font-display text-xl font-bold text-primary mt-1">{ranked[0]?.label}</p>
                <p className="text-xs text-[hsl(var(--dark-section-muted))] mt-1">{fmt(ranked[0]?.revenue || 0)}</p>
              </div>
            </div>

            {/* Comparison Chart */}
            <div className="mb-5">
              <p className="text-[10px] uppercase text-[hsl(var(--dark-section-muted))] font-semibold tracking-wider mb-3">
                📊 Receita & Novos Clientes — Últimos 6 meses
              </p>
              <ResponsiveContainer width="100%" height={240}>
                <BarChart data={months} barGap={2}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(220,14%,22%)" />
                  <XAxis dataKey="label" tick={{ fill: "hsl(220,10%,55%)", fontSize: 11 }} />
                  <YAxis yAxisId="left" tick={{ fill: "hsl(220,10%,55%)", fontSize: 10 }} tickFormatter={v => `R$${(v / 1000).toFixed(0)}k`} />
                  <YAxis yAxisId="right" orientation="right" tick={{ fill: "hsl(220,10%,55%)", fontSize: 10 }} />
                  <Tooltip contentStyle={{ background: "hsl(220,18%,14%)", border: "1px solid hsl(220,14%,22%)", borderRadius: 12, color: "#fff" }} />
                  <Legend wrapperStyle={{ color: "hsl(220,10%,70%)", fontSize: 12 }} />
                  <Bar yAxisId="left" dataKey="revenue" fill="hsl(160,70%,45%)" radius={[4, 4, 0, 0]} name="Receita (R$)" />
                  <Bar yAxisId="left" dataKey="pending" fill="hsl(40,90%,50%)" radius={[4, 4, 0, 0]} name="Pendente (R$)" />
                  <Bar yAxisId="right" dataKey="newClients" fill="hsl(210,80%,55%)" radius={[4, 4, 0, 0]} name="Novos Clientes" />
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* Performance Ranking Table */}
            <div>
              <p className="text-[10px] uppercase text-[hsl(var(--dark-section-muted))] font-semibold tracking-wider mb-3">
                🏆 Ranking de Performance por Período
              </p>
              <div className="space-y-2">
                {ranked.map(m => {
                  const medalColors = ["text-amber-400", "text-gray-300", "text-orange-500"];
                  const medals = ["🥇", "🥈", "🥉"];
                  return (
                    <div key={m.label} className={`flex items-center gap-3 p-3 rounded-xl ${m.rank === 1 ? "bg-amber-500/10 border border-amber-500/20" : "bg-[hsl(var(--dark-section))]/50"}`}>
                      <span className="text-lg w-8 text-center">{m.rank <= 3 ? medals[m.rank - 1] : `#${m.rank}`}</span>
                      <div className="flex-1">
                        <p className={`text-sm font-bold ${m.rank <= 3 ? medalColors[m.rank - 1] || "text-[hsl(var(--dark-section-fg))]" : "text-[hsl(var(--dark-section-fg))]"}`}>
                          {m.label.charAt(0).toUpperCase() + m.label.slice(1)}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-bold text-[hsl(var(--dark-section-fg))]">{fmt(m.revenue)}</p>
                        <p className="text-[10px] text-[hsl(var(--dark-section-muted))]">{m.newClients} novos clientes</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        );
      })()}

      {/* Atendimentos Metrics + Chart */}
      {serviceRecords.length > 0 && (() => {
        const byType: Record<string, number> = {};
        const byAgent: Record<string, number> = {};
        serviceRecords.forEach(r => {
          byType[r.type] = (byType[r.type] || 0) + 1;
          byAgent[r.agent] = (byAgent[r.agent] || 0) + 1;
        });
        const typeData = Object.entries(byType).sort((a, b) => b[1] - a[1]);
        const agentData = Object.entries(byAgent).sort((a, b) => b[1] - a[1]).slice(0, 5);
        const now = new Date();
        const d30 = new Date(now); d30.setDate(d30.getDate() - 30);
        const d7 = new Date(now); d7.setDate(d7.getDate() - 7);
        const last30 = serviceRecords.filter(r => new Date(r.created_at) >= d30).length;
        const last7 = serviceRecords.filter(r => new Date(r.created_at) >= d7).length;

        // Temporal chart data (monthly)
        const monthlyRecords: Record<string, Record<string, number>> = {};
        serviceRecords.forEach(r => {
          const d = new Date(r.created_at);
          const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
          if (!monthlyRecords[key]) monthlyRecords[key] = {};
          monthlyRecords[key][r.type] = (monthlyRecords[key][r.type] || 0) + 1;
        });
        const allTypes = Object.keys(byType);
        const temporalData = Object.entries(monthlyRecords)
          .sort((a, b) => a[0].localeCompare(b[0]))
          .map(([m, types]) => {
            const [y, mo] = m.split("-");
            const entry: any = { mes: `${mo}/${y.slice(2)}`, total: 0 };
            allTypes.forEach(t => { entry[t] = types[t] || 0; entry.total += types[t] || 0; });
            return entry;
          });

        const typeColors: Record<string, string> = {
          "Suporte Técnico": "text-blue-400 bg-blue-500/10",
          "Financeiro": "text-amber-400 bg-amber-500/10",
          "Comercial": "text-purple-400 bg-purple-500/10",
        };
        const chartTypeColors: Record<string, string> = {
          "Suporte Técnico": "hsl(210,80%,55%)",
          "Financeiro": "hsl(40,90%,50%)",
          "Comercial": "hsl(270,70%,55%)",
        };

        return (
          <>
            {/* Temporal Chart */}
            {temporalData.length > 1 && (
              <div className="bg-[hsl(var(--dark-section-card))] border border-[hsl(var(--dark-section-border))] rounded-2xl p-5">
                <h3 className="font-display font-semibold text-[hsl(var(--dark-section-fg))] mb-4 flex items-center gap-2">
                  <Headphones className="w-4 h-4 text-primary" /> Evolução de Atendimentos
                </h3>
                <ResponsiveContainer width="100%" height={250}>
                  <BarChart data={temporalData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(220,14%,22%)" />
                    <XAxis dataKey="mes" tick={{ fill: "hsl(220,10%,55%)", fontSize: 11 }} />
                    <YAxis tick={{ fill: "hsl(220,10%,55%)", fontSize: 11 }} />
                    <Tooltip contentStyle={{ background: "hsl(220,18%,14%)", border: "1px solid hsl(220,14%,22%)", borderRadius: 12, color: "#fff" }} />
                    <Legend wrapperStyle={{ color: "hsl(220,10%,70%)", fontSize: 12 }} />
                    {allTypes.map(t => (
                      <Bar key={t} dataKey={t} fill={chartTypeColors[t] || "hsl(220,60%,50%)"} radius={[4, 4, 0, 0]} stackId="a" name={t} />
                    ))}
                  </BarChart>
                </ResponsiveContainer>
              </div>
            )}

            {/* Metrics Cards */}
            <div className="bg-[hsl(var(--dark-section-card))] border border-[hsl(var(--dark-section-border))] rounded-2xl p-5">
              <h3 className="font-display font-semibold text-[hsl(var(--dark-section-fg))] mb-4 flex items-center gap-2">
                <Headphones className="w-4 h-4 text-primary" /> Métricas de Atendimentos
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-5">
                <div className="text-center p-3 rounded-xl bg-[hsl(var(--dark-section))]/50">
                  <p className="font-display text-xl font-bold text-primary">{serviceRecords.length}</p>
                  <p className="text-[10px] text-[hsl(var(--dark-section-muted))] mt-1">Total de Atendimentos</p>
                </div>
                <div className="text-center p-3 rounded-xl bg-[hsl(var(--dark-section))]/50">
                  <p className="font-display text-xl font-bold text-emerald-400">{last30}</p>
                  <p className="text-[10px] text-[hsl(var(--dark-section-muted))] mt-1">Últimos 30 dias</p>
                </div>
                <div className="text-center p-3 rounded-xl bg-[hsl(var(--dark-section))]/50">
                  <p className="font-display text-xl font-bold text-blue-400">{last7}</p>
                  <p className="text-[10px] text-[hsl(var(--dark-section-muted))] mt-1">Últimos 7 dias</p>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <p className="text-[10px] uppercase text-[hsl(var(--dark-section-muted))] font-semibold tracking-wider mb-3">Por Tipo</p>
                  <div className="space-y-2">
                    {typeData.map(([type, count]) => {
                      const pct = Math.round((count / serviceRecords.length) * 100);
                      const colors = typeColors[type] || "text-slate-400 bg-slate-500/10";
                      return (
                        <div key={type}>
                          <div className="flex items-center justify-between text-sm mb-1">
                            <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${colors}`}>{type}</span>
                            <span className="text-[hsl(var(--dark-section-fg))] font-bold text-xs">{count} ({pct}%)</span>
                          </div>
                          <div className="w-full h-1.5 rounded-full bg-[hsl(var(--dark-section))]/50">
                            <div className="h-full rounded-full bg-primary" style={{ width: `${pct}%` }} />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                <div>
                  <p className="text-[10px] uppercase text-[hsl(var(--dark-section-muted))] font-semibold tracking-wider mb-3">Agentes mais ativos</p>
                  <div className="space-y-2">
                    {agentData.map(([agent, count], i) => (
                      <div key={agent} className="flex items-center justify-between text-sm py-2 px-3 rounded-xl bg-[hsl(var(--dark-section))]/30">
                        <div className="flex items-center gap-2">
                          <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold ${i === 0 ? "bg-primary text-primary-foreground" : "bg-[hsl(var(--dark-section))]/50 text-[hsl(var(--dark-section-muted))]"}`}>
                            {i + 1}
                          </span>
                          <span className="text-[hsl(var(--dark-section-fg))] font-medium">{agent}</span>
                        </div>
                        <span className="text-primary font-bold">{count}</span>
                      </div>
                    ))}
                    {agentData.length === 0 && (
                      <p className="text-xs text-[hsl(var(--dark-section-muted))] text-center py-4">Nenhum agente registrado</p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </>
        );
      })()}

      <ExportFinanceiroModal open={financeiroOpen} onOpenChange={setFinanceiroOpen} />
    </div>
  );
};

export default AdminDashboard;
