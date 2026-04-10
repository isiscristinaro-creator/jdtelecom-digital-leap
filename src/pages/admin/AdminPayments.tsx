import { useState, useMemo } from "react";
import { Search, Download, Calendar, FileSpreadsheet, Loader2 } from "lucide-react";
import AdminPagination from "@/components/admin/AdminPagination";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { usePayments, usePlans } from "@/hooks/useSupabaseData";
import { exportToCSV, exportToExcel } from "@/utils/exportUtils";
import { toast } from "sonner";

const statusColors = {
  Pago: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
  Pendente: "bg-amber-500/10 text-amber-400 border-amber-500/20",
  Atrasado: "bg-red-500/10 text-red-400 border-red-500/20",
};

const AdminPayments = () => {
  const { payments, loading } = usePayments();
  const { plans } = usePlans();
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("Todos");
  const [planFilter, setPlanFilter] = useState("Todos");
  const [page, setPage] = useState(0);
  const perPage = 25;

  const filtered = useMemo(() => {
    return payments.filter((p) => {
      const matchSearch = !search || (p.client_name || "").toLowerCase().includes(search.toLowerCase());
      const matchStatus = statusFilter === "Todos" || p.status === statusFilter;
      const matchPlan = planFilter === "Todos" || p.client_plan === planFilter;
      return matchSearch && matchStatus && matchPlan;
    });
  }, [payments, search, statusFilter, planFilter]);

  const paginated = filtered.slice(page * perPage, (page + 1) * perPage);
  const totalPages = Math.max(1, Math.ceil(filtered.length / perPage));

  const totalPago = filtered.filter(p => p.status === "Pago").reduce((s, p) => s + p.amount, 0);
  const totalPendente = filtered.filter(p => p.status === "Pendente").reduce((s, p) => s + p.amount, 0);
  const totalAtrasado = filtered.filter(p => p.status === "Atrasado").reduce((s, p) => s + p.amount, 0);

  const fmt = (v: number) => v.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

  const handleExportExcel = () => {
    const data = filtered.map(p => ({
      Nome: p.client_name || "", Email: p.client_email || "", Plano: p.client_plan || "",
      Descrição: p.description, Data: p.due_date, "Valor (R$)": p.amount, Status: p.status,
    }));
    if (!data.length) { toast.error("Nenhum dado"); return; }
    exportToExcel(data, `relatorio-pagamentos-${new Date().toISOString().slice(0, 10)}`, { reportTitle: "JD Telecom", reportSubtitle: "Relatório de Pagamentos" });
    toast.success(`${data.length} registros exportados`);
  };

  const handleExportCSV = () => {
    const data = filtered.map(p => ({
      Nome: p.client_name || "", Email: p.client_email || "", Plano: p.client_plan || "",
      Descrição: p.description, Data: p.due_date, "Valor (R$)": p.amount.toFixed(2), Status: p.status,
    }));
    if (!data.length) { toast.error("Nenhum dado"); return; }
    exportToCSV(data, `pagamentos_jdtelecom`);
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
          <h1 className="font-display text-2xl md:text-3xl font-bold text-[hsl(var(--dark-section-fg))]">Pagamentos</h1>
          <p className="text-sm text-[hsl(var(--dark-section-muted))] mt-1">{filtered.length} registros</p>
        </div>
        <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
          <Button onClick={handleExportCSV} variant="outline" className="border-[hsl(var(--dark-section-border))] bg-[hsl(var(--dark-section-card))] text-white rounded-xl font-bold text-sm w-full sm:w-auto">
            <Download className="w-4 h-4 mr-2" /> CSV
          </Button>
          <Button onClick={handleExportExcel} disabled={!filtered.length} className="bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold text-sm disabled:opacity-60 w-full sm:w-auto">
            <FileSpreadsheet className="w-4 h-4 mr-2" /> Exportar Excel
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {[
          { label: "Total Pago", value: fmt(totalPago), color: "text-emerald-400" },
          { label: "Pendente", value: fmt(totalPendente), color: "text-amber-400" },
          { label: "Atrasado", value: fmt(totalAtrasado), color: "text-red-400" },
        ].map((c) => (
          <div key={c.label} className="bg-[hsl(var(--dark-section-card))] border border-[hsl(var(--dark-section-border))] rounded-2xl p-4">
            <p className={`font-display text-lg md:text-xl font-bold ${c.color}`}>{c.value}</p>
            <p className="text-xs text-[hsl(var(--dark-section-muted))] mt-1">{c.label}</p>
          </div>
        ))}
      </div>

      <div className="flex flex-col gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[hsl(var(--dark-section-muted))]" />
          <Input placeholder="Buscar por cliente..." value={search} onChange={(e) => { setSearch(e.target.value); setPage(0); }}
            className="bg-[hsl(var(--dark-section-card))] border-[hsl(var(--dark-section-border))] text-[hsl(var(--dark-section-fg))] pl-10 h-10 rounded-xl" />
        </div>
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="flex gap-2 flex-wrap">
            {["Todos", "Pago", "Pendente", "Atrasado"].map((s) => (
              <button key={s} onClick={() => { setStatusFilter(s); setPage(0); }}
                className={`w-full sm:w-auto px-3 py-2 rounded-xl text-xs font-semibold transition-all border ${
                  statusFilter === s ? "bg-primary text-primary-foreground border-primary" : "bg-[hsl(var(--dark-section-card))] text-[hsl(var(--dark-section-muted))] border-[hsl(var(--dark-section-border))]"
                }`}>{s}</button>
            ))}
          </div>
          <select value={planFilter} onChange={e => { setPlanFilter(e.target.value); setPage(0); }}
            className="bg-[hsl(var(--dark-section-card))] border border-[hsl(var(--dark-section-border))] text-[hsl(var(--dark-section-fg))] px-4 h-10 rounded-xl text-xs font-semibold appearance-none cursor-pointer w-full sm:w-auto">
            <option value="Todos">Todos os planos</option>
            {plans.map(p => <option key={p.id} value={p.name}>{p.name}</option>)}
          </select>
        </div>
      </div>

      <div className="bg-[hsl(var(--dark-section-card))] border border-[hsl(var(--dark-section-border))] rounded-2xl overflow-hidden">
        <div className="overflow-x-auto [-webkit-overflow-scrolling:touch]">
          <table className="w-full min-w-[700px] text-sm">
            <thead>
              <tr className="border-b border-[hsl(var(--dark-section-border))]">
                <th className="text-left py-3 px-4 text-xs font-semibold text-[hsl(var(--dark-section-muted))] uppercase tracking-wider">Cliente</th>
                <th className="text-left py-3 px-4 text-xs font-semibold text-[hsl(var(--dark-section-muted))] uppercase tracking-wider hidden md:table-cell">Descrição</th>
                <th className="text-left py-3 px-4 text-xs font-semibold text-[hsl(var(--dark-section-muted))] uppercase tracking-wider">Data</th>
                <th className="text-left py-3 px-4 text-xs font-semibold text-[hsl(var(--dark-section-muted))] uppercase tracking-wider">Valor</th>
                <th className="text-right py-3 px-4 text-xs font-semibold text-[hsl(var(--dark-section-muted))] uppercase tracking-wider">Status</th>
              </tr>
            </thead>
            <tbody>
              {paginated.map((p) => (
                <tr key={p.id} className="border-b border-[hsl(var(--dark-section-border))]/50 hover:bg-[hsl(var(--dark-section))]/30 transition-colors">
                  <td className="py-3 px-4 text-[hsl(var(--dark-section-fg))]">{p.client_name}</td>
                  <td className="py-3 px-4 text-[hsl(var(--dark-section-muted))] hidden md:table-cell">{p.description}</td>
                  <td className="py-3 px-4 text-[hsl(var(--dark-section-muted))]">{p.due_date}</td>
                  <td className="py-3 px-4 text-[hsl(var(--dark-section-fg))] font-medium">R$ {p.amount.toFixed(2)}</td>
                  <td className="py-3 px-4 text-right">
                    <span className={`inline-flex px-2.5 py-1 rounded-full border text-xs font-semibold ${statusColors[p.status]}`}>{p.status}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <AdminPagination currentPage={page + 1} totalPages={totalPages} totalItems={filtered.length} perPage={perPage} onPageChange={(p) => setPage(p - 1)} />
      </div>
    </div>
  );
};

export default AdminPayments;
