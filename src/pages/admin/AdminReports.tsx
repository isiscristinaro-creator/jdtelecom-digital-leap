import { useMemo, useState } from "react";
import { Download, FileSpreadsheet } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  LineChart, Line, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from "recharts";
import { growthData, planDistribution, mockPlans } from "@/data/adminMockData";
import { exportToCSV, exportToExcel } from "@/utils/exportUtils";
import { toast } from "sonner";

const COLORS = ["hsl(24,95%,50%)", "hsl(15,90%,42%)", "hsl(350,80%,55%)", "hsl(40,90%,50%)", "hsl(200,80%,50%)"];
const fmt = (v: number) => v.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
const fmtK = (v: number) => `R$ ${(v / 1000).toFixed(0)}k`;

const tabs = [
  { id: "receita", label: "Receita" },
  { id: "crescimento", label: "Crescimento" },
  { id: "inadimplencia", label: "Inadimplência" },
  { id: "planos", label: "Planos" },
];

const periods = [
  { id: "all", label: "Tudo" },
  { id: "3m", label: "3 meses" },
  { id: "6m", label: "6 meses" },
];

const inadData = [
  { month: "Out", rate: 12.1 },
  { month: "Nov", rate: 11.5 },
  { month: "Dez", rate: 10.8 },
  { month: "Jan", rate: 11.2 },
  { month: "Fev", rate: 10.3 },
  { month: "Mar", rate: 9.8 },
];

const AdminReports = () => {
  const [activeTab, setActiveTab] = useState("receita");
  const [period, setPeriod] = useState("all");
  const [planFilter, setPlanFilter] = useState("Todos");

  const sliceData = <T,>(data: T[]) => {
    if (period === "3m") return data.slice(-3);
    if (period === "6m") return data.slice(-6);
    return data;
  };

  const filteredPlanDistribution = useMemo(() => {
    if (planFilter === "Todos") return planDistribution;
    const selectedSpeed = mockPlans.find((plan) => plan.name === planFilter)?.speed;
    if (!selectedSpeed) return [];
    return planDistribution.filter((item) => item.name === selectedSpeed);
  }, [planFilter]);

  const getExportData = () => {
    if (activeTab === "receita") {
      return sliceData(growthData).map(d => ({ Mês: d.month, "Receita (R$)": d.revenue, Clientes: d.clients }));
    } else if (activeTab === "crescimento") {
      return sliceData(growthData).map(d => ({ Mês: d.month, Clientes: d.clients, "Receita (R$)": d.revenue }));
    } else if (activeTab === "inadimplencia") {
      return sliceData(inadData).map(d => ({ Mês: d.month, "Taxa de inadimplência (%)": d.rate }));
    } else {
      if (!filteredPlanDistribution.length) return [];
      const total = filteredPlanDistribution.reduce((s, x) => s + x.value, 0);
      return filteredPlanDistribution.map(p => ({
        Plano: p.name, Clientes: p.value, "Participação (%)": Number(((p.value / total) * 100).toFixed(1)),
      }));
    }
  };

  const exportData = useMemo(() => getExportData(), [activeTab, period, filteredPlanDistribution]);

  const tabLabel = tabs.find(t => t.id === activeTab)?.label ?? "";

  const handleExportExcel = () => {
    if (!exportData.length) {
      toast.error("Nenhum dado disponível para exportação");
      return;
    }

    exportToExcel(exportData, `relatorio-${activeTab}-${new Date().toISOString().slice(0, 10)}`, { reportTitle: "JD Telecom", reportSubtitle: `Relatório de ${tabLabel}` });
    toast.success(`${exportData.length} registros exportados com sucesso`);
  };

  const handleExportCSV = () => {
    if (!exportData.length) {
      toast.error("Nenhum dado disponível para exportação");
      return;
    }

    const data = exportData.map(row => {
      const out: Record<string, string | number> = {};
      Object.entries(row).forEach(([k, v]) => { out[k] = typeof v === "number" ? (v as number).toFixed(2) : String(v); });
      return out;
    });
    exportToCSV(data, `relatorio_${activeTab}_jdtelecom`);
    toast.success(`${data.length} registros exportados com sucesso`);
  };

  return (
    <div className="p-4 md:p-6 lg:p-8 pt-12 md:pt-6 space-y-6 max-w-[1400px] w-full overflow-hidden mx-auto">
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

      {/* Tabs + Filters */}
      <div className="flex flex-col gap-3">
        <div className="grid grid-cols-1 sm:flex gap-2">
          {tabs.map((t) => (
            <button key={t.id} onClick={() => setActiveTab(t.id)}
              className={`px-4 py-2 rounded-xl text-sm font-semibold whitespace-nowrap text-left sm:text-center transition-all border ${
                activeTab === t.id ? "bg-primary text-primary-foreground border-primary" : "bg-[hsl(var(--dark-section-card))] text-[hsl(var(--dark-section-muted))] border-[hsl(var(--dark-section-border))]"
              }`}>{t.label}</button>
          ))}
        </div>
        <div className="grid grid-cols-2 sm:flex gap-2">
          {periods.map(p => (
            <button key={p.id} onClick={() => setPeriod(p.id)}
              className={`px-3 py-2 rounded-xl text-xs font-semibold border transition-all ${period === p.id ? "bg-primary/20 text-primary border-primary/40" : "bg-[hsl(var(--dark-section-card))] text-[hsl(var(--dark-section-muted))] border-[hsl(var(--dark-section-border))]"}`}>
              {p.label}
            </button>
          ))}
          <select value={planFilter} onChange={e => setPlanFilter(e.target.value)}
            className="bg-[hsl(var(--dark-section-card))] border border-[hsl(var(--dark-section-border))] text-[hsl(var(--dark-section-fg))] px-3 h-9 rounded-xl text-xs font-semibold appearance-none cursor-pointer col-span-2 sm:col-span-1 w-full sm:w-auto">
            <option value="Todos">Todos os planos</option>
            {mockPlans.map(p => <option key={p.id} value={p.name}>{p.name}</option>)}
          </select>
        </div>
      </div>

      {/* Content */}
      <div className="bg-[hsl(var(--dark-section-card))] border border-[hsl(var(--dark-section-border))] rounded-2xl p-5 md:p-6">
        {activeTab === "receita" && (
          <div>
            <h3 className="font-display font-semibold text-[hsl(var(--dark-section-fg))] mb-6">Receita por Período</h3>
            <ResponsiveContainer width="100%" height={350}>
              <BarChart data={sliceData(growthData)}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(220,14%,22%)" />
                <XAxis dataKey="month" tick={{ fill: "hsl(220,10%,55%)", fontSize: 12 }} axisLine={false} />
                <YAxis tickFormatter={fmtK} tick={{ fill: "hsl(220,10%,55%)", fontSize: 12 }} axisLine={false} />
                <Tooltip formatter={(v: number) => fmt(v)} contentStyle={{ background: "hsl(220,18%,14%)", border: "1px solid hsl(220,14%,22%)", borderRadius: 12, color: "#fff" }} />
                <Bar dataKey="revenue" fill="hsl(24,95%,50%)" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-6">
              {sliceData(growthData).slice(-4).map((d) => (
                <div key={d.month} className="bg-[hsl(var(--dark-section))]/50 rounded-xl p-3 text-center">
                  <p className="text-xs text-[hsl(var(--dark-section-muted))]">{d.month}</p>
                  <p className="font-display font-bold text-[hsl(var(--dark-section-fg))]">{fmt(d.revenue)}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === "crescimento" && (
          <div>
            <h3 className="font-display font-semibold text-[hsl(var(--dark-section-fg))] mb-6">Crescimento de Clientes</h3>
            <ResponsiveContainer width="100%" height={350}>
              <LineChart data={sliceData(growthData)}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(220,14%,22%)" />
                <XAxis dataKey="month" tick={{ fill: "hsl(220,10%,55%)", fontSize: 12 }} axisLine={false} />
                <YAxis tick={{ fill: "hsl(220,10%,55%)", fontSize: 12 }} axisLine={false} />
                <Tooltip contentStyle={{ background: "hsl(220,18%,14%)", border: "1px solid hsl(220,14%,22%)", borderRadius: 12, color: "#fff" }} />
                <Line type="monotone" dataKey="clients" stroke="hsl(24,95%,50%)" strokeWidth={3} dot={{ fill: "hsl(24,95%,50%)", r: 5 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        )}

        {activeTab === "inadimplencia" && (
          <div>
            <h3 className="font-display font-semibold text-[hsl(var(--dark-section-fg))] mb-6">Taxa de Inadimplência (%)</h3>
            <ResponsiveContainer width="100%" height={350}>
              <LineChart data={sliceData(inadData)}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(220,14%,22%)" />
                <XAxis dataKey="month" tick={{ fill: "hsl(220,10%,55%)", fontSize: 12 }} axisLine={false} />
                <YAxis unit="%" tick={{ fill: "hsl(220,10%,55%)", fontSize: 12 }} axisLine={false} />
                <Tooltip contentStyle={{ background: "hsl(220,18%,14%)", border: "1px solid hsl(220,14%,22%)", borderRadius: 12, color: "#fff" }} formatter={(v: number) => `${v}%`} />
                <Line type="monotone" dataKey="rate" stroke="hsl(350,80%,55%)" strokeWidth={3} dot={{ fill: "hsl(350,80%,55%)", r: 5 }} />
              </LineChart>
            </ResponsiveContainer>
            <p className="text-xs text-[hsl(var(--dark-section-muted))] mt-4 text-center">A taxa de inadimplência vem caindo nos últimos meses — tendência positiva.</p>
          </div>
        )}

        {activeTab === "planos" && (
          <div>
            <h3 className="font-display font-semibold text-[hsl(var(--dark-section-fg))] mb-6">Planos Mais Vendidos</h3>
            <div className="flex flex-col md:flex-row items-center gap-6">
              <ResponsiveContainer width="100%" height={300} className="max-w-[350px]">
                <PieChart>
                  <Pie data={filteredPlanDistribution} cx="50%" cy="50%" innerRadius={70} outerRadius={120} paddingAngle={3} dataKey="value">
                    {filteredPlanDistribution.map((_, i) => (
                      <Cell key={i} fill={COLORS[i % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={{ background: "hsl(220,18%,14%)", border: "1px solid hsl(220,14%,22%)", borderRadius: 12, color: "#fff" }} />
                </PieChart>
              </ResponsiveContainer>
              <div className="space-y-3 flex-1">
                {filteredPlanDistribution.map((p, i) => {
                  const total = filteredPlanDistribution.reduce((s, x) => s + x.value, 0);
                  const pct = ((p.value / total) * 100).toFixed(1);
                  return (
                    <div key={p.name} className="flex items-center gap-3">
                      <div className="w-3 h-3 rounded-full shrink-0" style={{ background: COLORS[i % COLORS.length] }} />
                      <span className="text-sm text-[hsl(var(--dark-section-muted))] flex-1">{p.name}</span>
                      <span className="text-sm font-bold text-[hsl(var(--dark-section-fg))]">{p.value}</span>
                      <span className="text-xs text-[hsl(var(--dark-section-muted))]">({pct}%)</span>
                    </div>
                  );
                })}
                {!filteredPlanDistribution.length && (
                  <p className="text-xs text-[hsl(var(--dark-section-muted))]">Nenhum dado encontrado para o plano selecionado.</p>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminReports;
