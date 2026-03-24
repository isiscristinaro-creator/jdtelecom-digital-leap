import { useState, useMemo } from "react";
import { Search, Download, Calendar, FileSpreadsheet } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { allPayments, mockClients, mockPlans } from "@/data/adminMockData";
import { exportToCSV, exportToExcel } from "@/utils/exportUtils";
import { toast } from "sonner";

const statusColors = {
  Pago: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
  Pendente: "bg-amber-500/10 text-amber-400 border-amber-500/20",
  Atrasado: "bg-red-500/10 text-red-400 border-red-500/20",
};

const AdminPayments = () => {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("Todos");
  const [monthFilter, setMonthFilter] = useState("Todos");
  const [clientFilter, setClientFilter] = useState("Todos");
  const [planFilter, setPlanFilter] = useState("Todos");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [page, setPage] = useState(0);
  const perPage = 25;

  const clientById = useMemo(() => {
    return new Map(mockClients.map((client) => [client.id, client]));
  }, []);

  const availableClients = useMemo(() => {
    const seen = new Set<string>();
    return allPayments
      .map((payment) => ({ id: payment.clientId, name: payment.clientName }))
      .filter((client) => {
        if (seen.has(client.id)) return false;
        seen.add(client.id);
        return true;
      })
      .sort((a, b) => a.name.localeCompare(b.name, "pt-BR"));
  }, []);

  const availableMonths = useMemo(() => {
    const months = [...new Set(allPayments.map(p => {
      const parts = p.date.split("/");
      return `${parts[1]}/${parts[2]}`;
    }))];
    return months.sort().reverse();
  }, []);

  const parseDate = (dateStr: string) => {
    const [d, m, y] = dateStr.split("/").map(Number);
    return new Date(y, m - 1, d);
  };

  const parseInputDate = (dateStr: string) => {
    const [y, m, d] = dateStr.split("-").map(Number);
    return new Date(y, m - 1, d);
  };

  const filtered = useMemo(() => {
    return allPayments.filter((p) => {
      const matchSearch = !search || p.clientName.toLowerCase().includes(search.toLowerCase());
      const matchClient = clientFilter === "Todos" || p.clientId === clientFilter;
      const matchStatus = statusFilter === "Todos" || p.status === statusFilter;
      const matchMonth = monthFilter === "Todos" || (() => {
        const parts = p.date.split("/");
        return `${parts[1]}/${parts[2]}` === monthFilter;
      })();
      const clientPlan = clientById.get(p.clientId)?.plan;
      const matchPlan = planFilter === "Todos" || clientPlan === planFilter;
      
      let matchDateRange = true;
      if (dateFrom) {
        const pDate = parseDate(p.date);
        const from = parseInputDate(dateFrom);
        if (pDate < from) matchDateRange = false;
      }
      if (dateTo) {
        const pDate = parseDate(p.date);
        const to = parseInputDate(dateTo);
        to.setHours(23, 59, 59, 999);
        if (pDate > to) matchDateRange = false;
      }
      
      return matchSearch && matchClient && matchStatus && matchMonth && matchPlan && matchDateRange;
    });
  }, [search, clientFilter, statusFilter, monthFilter, planFilter, dateFrom, dateTo, clientById]);

  const paginated = filtered.slice(page * perPage, (page + 1) * perPage);
  const totalPages = Math.max(1, Math.ceil(filtered.length / perPage));

  const totalPago = filtered.filter((p) => p.status === "Pago").reduce((s, p) => s + p.amount, 0);
  const totalPendente = filtered.filter((p) => p.status === "Pendente").reduce((s, p) => s + p.amount, 0);
  const totalAtrasado = filtered.filter((p) => p.status === "Atrasado").reduce((s, p) => s + p.amount, 0);

  const fmt = (v: number) => v.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

  const buildExportData = () => filtered.map(p => ({
    Nome: p.clientName,
    Email: clientById.get(p.clientId)?.email ?? "-",
    Plano: clientById.get(p.clientId)?.plan ?? "-",
    Descrição: p.description,
    Data: p.date,
    "Valor (R$)": p.amount,
    Status: p.status,
  }));

  const buildSuffix = () => {
    let s = "";
    if (statusFilter !== "Todos") s += `_${statusFilter.toLowerCase()}`;
    if (monthFilter !== "Todos") s += `_${monthFilter.replace("/", "-")}`;
    if (planFilter !== "Todos") s += `_plano`;
    if (clientFilter !== "Todos") s += `_cliente`;
    return s;
  };

  const handleExportCSV = () => {
    const exportData = buildExportData();
    if (!exportData.length) {
      toast.error("Nenhum dado disponível para exportação");
      return;
    }

    exportToCSV(
      exportData.map((item) => ({ ...item, "Valor (R$)": item["Valor (R$)"].toFixed(2) })),
      `pagamentos_jdtelecom${buildSuffix()}`,
    );
    toast.success(`${exportData.length} registros exportados com sucesso`);
  };

  const handleExportExcel = () => {
    const exportData = buildExportData();
    if (!exportData.length) {
      toast.error("Nenhum dado disponível para exportação");
      return;
    }

    exportToExcel(exportData, `relatorio-pagamentos-${new Date().toISOString().slice(0, 10)}`, { reportTitle: "JD Telecom", reportSubtitle: "Relatório de Pagamentos" });
    toast.success(`${exportData.length} registros exportados com sucesso`);
  };

  return (
    <div className="p-4 md:p-6 lg:p-8 pt-12 md:pt-6 space-y-6 max-w-[1400px] w-full overflow-hidden mx-auto">
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

      {/* Summary cards */}
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

      {/* Filters */}
      <div className="space-y-3">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[hsl(var(--dark-section-muted))]" />
            <Input placeholder="Buscar por cliente..." value={search} onChange={(e) => { setSearch(e.target.value); setPage(0); }}
              className="bg-[hsl(var(--dark-section-card))] border-[hsl(var(--dark-section-border))] text-[hsl(var(--dark-section-fg))] pl-10 h-10 rounded-xl" />
          </div>
          <div className="flex gap-2 flex-wrap">
            {["Todos", "Pago", "Pendente", "Atrasado"].map((s) => (
              <button key={s} onClick={() => { setStatusFilter(s); setPage(0); }}
                className={`px-3 py-2 rounded-xl text-xs font-semibold transition-all border ${
                  statusFilter === s ? "bg-primary text-primary-foreground border-primary" : "bg-[hsl(var(--dark-section-card))] text-[hsl(var(--dark-section-muted))] border-[hsl(var(--dark-section-border))]"
                }`}>{s}</button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-3">
          <div className="relative">
            <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[hsl(var(--dark-section-muted))] pointer-events-none" />
            <select value={monthFilter} onChange={(e) => { setMonthFilter(e.target.value); setPage(0); }}
              className="bg-[hsl(var(--dark-section-card))] border border-[hsl(var(--dark-section-border))] text-[hsl(var(--dark-section-fg))] pl-10 pr-4 h-10 rounded-xl text-xs font-semibold appearance-none cursor-pointer w-full">
              <option value="Todos">Todos os meses</option>
              {availableMonths.map(m => <option key={m} value={m}>{m}</option>)}
            </select>
          </div>
          <select value={planFilter} onChange={e => { setPlanFilter(e.target.value); setPage(0); }}
            className="bg-[hsl(var(--dark-section-card))] border border-[hsl(var(--dark-section-border))] text-[hsl(var(--dark-section-fg))] px-4 h-10 rounded-xl text-xs font-semibold appearance-none cursor-pointer w-full">
            <option value="Todos">Todos os planos</option>
            {mockPlans.map(p => <option key={p.id} value={p.name}>{p.name}</option>)}
          </select>
          <select value={clientFilter} onChange={e => { setClientFilter(e.target.value); setPage(0); }}
            className="bg-[hsl(var(--dark-section-card))] border border-[hsl(var(--dark-section-border))] text-[hsl(var(--dark-section-fg))] px-4 h-10 rounded-xl text-xs font-semibold appearance-none cursor-pointer w-full">
            <option value="Todos">Todos os clientes</option>
            {availableClients.map(client => <option key={client.id} value={client.id}>{client.name}</option>)}
          </select>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            <div className="flex items-center gap-2">
              <span className="text-xs text-[hsl(var(--dark-section-muted))] whitespace-nowrap">De:</span>
              <input type="date" value={dateFrom} onChange={e => { setDateFrom(e.target.value); setPage(0); }}
                className="bg-[hsl(var(--dark-section-card))] border border-[hsl(var(--dark-section-border))] text-[hsl(var(--dark-section-fg))] px-3 h-10 rounded-xl text-xs w-full" />
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs text-[hsl(var(--dark-section-muted))] whitespace-nowrap">Até:</span>
              <input type="date" value={dateTo} onChange={e => { setDateTo(e.target.value); setPage(0); }}
                className="bg-[hsl(var(--dark-section-card))] border border-[hsl(var(--dark-section-border))] text-[hsl(var(--dark-section-fg))] px-3 h-10 rounded-xl text-xs w-full" />
            </div>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="bg-[hsl(var(--dark-section-card))] border border-[hsl(var(--dark-section-border))] rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
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
                  <td className="py-3 px-4 text-[hsl(var(--dark-section-fg))]">{p.clientName}</td>
                  <td className="py-3 px-4 text-[hsl(var(--dark-section-muted))] hidden md:table-cell">{p.description}</td>
                  <td className="py-3 px-4 text-[hsl(var(--dark-section-muted))]">{p.date}</td>
                  <td className="py-3 px-4 text-[hsl(var(--dark-section-fg))] font-medium">R$ {p.amount.toFixed(2)}</td>
                  <td className="py-3 px-4 text-right">
                    <span className={`inline-flex px-2.5 py-1 rounded-full border text-xs font-semibold ${statusColors[p.status]}`}>{p.status}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="flex items-center justify-between px-4 py-3 border-t border-[hsl(var(--dark-section-border))]">
          <p className="text-xs text-[hsl(var(--dark-section-muted))]">Página {page + 1} de {totalPages}</p>
          <div className="flex gap-2">
            <button disabled={page === 0} onClick={() => setPage(page - 1)} className="px-3 py-1.5 rounded-lg text-xs text-[hsl(var(--dark-section-muted))] hover:text-[hsl(var(--dark-section-fg))] disabled:opacity-30">Anterior</button>
            <button disabled={page >= totalPages - 1} onClick={() => setPage(page + 1)} className="px-3 py-1.5 rounded-lg text-xs text-[hsl(var(--dark-section-muted))] hover:text-[hsl(var(--dark-section-fg))] disabled:opacity-30">Próxima</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminPayments;
