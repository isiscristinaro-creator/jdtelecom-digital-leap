import { useMemo, useState } from "react";
import { Download, FileSpreadsheet, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from "recharts";
import { usePlans, usePayments } from "@/hooks/useSupabaseData";
import { exportToCSV, exportToExcel } from "@/utils/exportUtils";
import { toast } from "sonner";

const COLORS = ["hsl(24,95%,50%)", "hsl(15,90%,42%)", "hsl(350,80%,55%)", "hsl(40,90%,50%)", "hsl(200,80%,50%)"];
const fmt = (v: number) => v.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
const fmtK = (v: number) => `R$ ${(v / 1000).toFixed(0)}k`;

const tabs = [
  { id: "receita", label: "Receita" },
  { id: "planos", label: "Planos" },
];

const AdminReports = () => {
  const { plans, loading: plansLoading } = usePlans();
  const { payments, loading: paymentsLoading } = usePayments();
  const [activeTab, setActiveTab] = useState("receita");
  const [planFilter, setPlanFilter] = useState("Todos");

  const loading = plansLoading || paymentsLoading;

  // Group payments by month for revenue chart
  const revenueData = useMemo(() => {
    const byMonth = new Map<string, number>();
    payments.filter(p => p.status === "Pago").forEach(p => {
      const d = new Date(p.due_date);
      const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
      byMonth.set(key, (byMonth.get(key) || 0) + p.amount);
    });
    return Array.from(byMonth.entries())
      .sort(([a], [b]) => a.localeCompare(b))
      .slice(-6)
      .map(([k, v]) => {
        const [y, m] = k.split("-");
        return { month: `${m}/${y}`, revenue: v };
      });
  }, [payments]);

  const planDistribution = useMemo(() => {
    const filtered = planFilter === "Todos" ? plans : plans.filter(p => p.name === planFilter);
    return filtered.map(p => ({ name: p.speed, value: p.active_clients }));
  }, [plans, planFilter]);

  const getExportData = () => {
    if (activeTab === "receita") {
      return revenueData.map(d => ({ Mês: d.month, "Receita (R$)": d.revenue }));
    }
    const total = planDistribution.reduce((s, x) => s + x.value, 0);
    return planDistribution.map(p => ({
      Plano: p.name, Clientes: p.value, "Participação (%)": total ? Number(((p.value / total) * 100).toFixed(1)) : 0,
    }));
  };

  const exportData = useMemo(getExportData, [activeTab, revenueData, planDistribution]);
  const tabLabel = tabs.find(t => t.id === activeTab)?.label ?? "";

  const handleExportExcel = () => {
    if (!exportData.length) { toast.error("Nenhum dado"); return; }
    exportToExcel(exportData, `relatorio-${activeTab}-${new Date().toISOString().slice(0, 10)}`, { reportTitle: "JD Telecom", reportSubtitle: `Relatório de ${tabLabel}` });
    toast.success(`${exportData.length} registros exportados`);
  };

  const handleExportCSV = () => {
    if (!exportData.length) { toast.error("Nenhum dado"); return; }
    const data = exportData.map(row => {
      const out: Record<string, string | number> = {};
      Object.entries(row).forEach(([k, v]) => { out[k] = typeof v === "number" ? v.toFixed(2) : String(v); });
      return out;
    });
    exportToCSV(data, `relatorio_${activeTab}_jdtelecom`);
    toast.success(`${data.length} registros exportados`);
  };

  if (loading) {
    return (
      <div className="admin-page flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="admin-page space-y-6 w-full overflow-hidden">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="font-display text-2xl md:text-3xl font-bold text-[hsl(var(--dark-section-fg))]">Relatórios</h1>
          <p className="text-sm text-[hsl(var(--dark-section-muted))] mt-1">Análises detalhadas do negócio</p>
        </div>
        <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
          <Button onClick={handleExportCSV} variant="outline" className="border-[hsl(var(--dark-section-border))] bg-[hsl(var(--dark-section-card))] text-white rounded-xl font-bold text-sm w-full sm:w-auto">
            <Download className="w-4 h-4 mr-2" /> CSV
          </Button>
          <Button onClick={handleExportExcel} disabled={!exportData.length} className="bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold text-sm disabled:opacity-60 w-full sm:w-auto">
            <FileSpreadsheet className="w-4 h-4 mr-2" /> Exportar Excel
          </Button>
        </div>
      </div>

      <div className="flex flex-col gap-3">
        <div className="grid grid-cols-1 sm:flex gap-2">
          {tabs.map((t) => (
            <button key={t.id} onClick={() => setActiveTab(t.id)}
              className={`px-4 py-2 rounded-xl text-sm font-semibold whitespace-nowrap text-left sm:text-center transition-all border ${
                activeTab === t.id ? "bg-primary text-primary-foreground border-primary" : "bg-[hsl(var(--dark-section-card))] text-[hsl(var(--dark-section-muted))] border-[hsl(var(--dark-section-border))]"
              }`}>{t.label}</button>
          ))}
        </div>
        {activeTab === "planos" && (
          <select value={planFilter} onChange={e => setPlanFilter(e.target.value)}
            className="bg-[hsl(var(--dark-section-card))] border border-[hsl(var(--dark-section-border))] text-[hsl(var(--dark-section-fg))] px-3 h-9 rounded-xl text-xs font-semibold appearance-none cursor-pointer w-full sm:w-auto">
            <option value="Todos">Todos os planos</option>
            {plans.map(p => <option key={p.id} value={p.name}>{p.name}</option>)}
          </select>
        )}
      </div>

      <div className="bg-[hsl(var(--dark-section-card))] border border-[hsl(var(--dark-section-border))] rounded-2xl p-5 md:p-6">
        {activeTab === "receita" && (
          <div>
            <h3 className="font-display font-semibold text-[hsl(var(--dark-section-fg))] mb-6">Receita por Período</h3>
            {revenueData.length > 0 ? (
              <ResponsiveContainer width="100%" height={350}>
                <BarChart data={revenueData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(220,14%,22%)" />
                  <XAxis dataKey="month" tick={{ fill: "hsl(220,10%,55%)", fontSize: 12 }} axisLine={false} />
                  <YAxis tickFormatter={fmtK} tick={{ fill: "hsl(220,10%,55%)", fontSize: 12 }} axisLine={false} />
                  <Tooltip formatter={(v: number) => fmt(v)} contentStyle={{ background: "hsl(220,18%,14%)", border: "1px solid hsl(220,14%,22%)", borderRadius: 12, color: "#fff" }} />
                  <Bar dataKey="revenue" fill="hsl(24,95%,50%)" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <p className="text-center text-[hsl(var(--dark-section-muted))] py-12">Nenhum pagamento registrado ainda.</p>
            )}
          </div>
        )}

        {activeTab === "planos" && (
          <div>
            <h3 className="font-display font-semibold text-[hsl(var(--dark-section-fg))] mb-6">Planos Mais Vendidos</h3>
            {planDistribution.length > 0 ? (
              <div className="flex flex-col md:flex-row items-center gap-6">
                <ResponsiveContainer width="100%" height={300} className="max-w-[350px]">
                  <PieChart>
                    <Pie data={planDistribution} cx="50%" cy="50%" innerRadius={70} outerRadius={120} paddingAngle={3} dataKey="value">
                      {planDistribution.map((_, i) => (
                        <Cell key={i} fill={COLORS[i % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip contentStyle={{ background: "hsl(220,18%,14%)", border: "1px solid hsl(220,14%,22%)", borderRadius: 12, color: "#fff" }} />
                  </PieChart>
                </ResponsiveContainer>
                <div className="space-y-3 flex-1">
                  {planDistribution.map((p, i) => {
                    const total = planDistribution.reduce((s, x) => s + x.value, 0);
                    const pct = total ? ((p.value / total) * 100).toFixed(1) : "0";
                    return (
                      <div key={p.name} className="flex items-center gap-3">
                        <div className="w-3 h-3 rounded-full shrink-0" style={{ background: COLORS[i % COLORS.length] }} />
                        <span className="text-sm text-[hsl(var(--dark-section-muted))] flex-1">{p.name}</span>
                        <span className="text-sm font-bold text-[hsl(var(--dark-section-fg))]">{p.value}</span>
                        <span className="text-xs text-[hsl(var(--dark-section-muted))]">({pct}%)</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            ) : (
              <p className="text-center text-[hsl(var(--dark-section-muted))] py-12">Nenhum plano encontrado.</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminReports;
