import { useState, useMemo } from "react";
import { Search, Download, FileText } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { mockLogs, categoryLabels, type SystemLog } from "@/data/adminLogsData";
import { exportToExcel } from "@/utils/exportUtils";

const categoryColors: Record<SystemLog["category"], string> = {
  login: "bg-blue-500/10 text-blue-400 border-blue-500/20",
  cliente: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
  plano: "bg-purple-500/10 text-purple-400 border-purple-500/20",
  pagamento: "bg-amber-500/10 text-amber-400 border-amber-500/20",
  equipe: "bg-cyan-500/10 text-cyan-400 border-cyan-500/20",
  sistema: "bg-slate-500/10 text-slate-400 border-slate-500/20",
};

const AdminLogs = () => {
  const [search, setSearch] = useState("");
  const [catFilter, setCatFilter] = useState("Todos");
  const [page, setPage] = useState(0);
  const perPage = 25;

  const categories = ["Todos", ...Object.keys(categoryLabels)];

  const filtered = useMemo(() => {
    return mockLogs.filter(l => {
      const matchSearch = !search || l.user.toLowerCase().includes(search.toLowerCase()) || l.action.toLowerCase().includes(search.toLowerCase()) || l.details.toLowerCase().includes(search.toLowerCase());
      const matchCat = catFilter === "Todos" || l.category === catFilter;
      return matchSearch && matchCat;
    });
  }, [search, catFilter]);

  const paginated = filtered.slice(page * perPage, (page + 1) * perPage);
  const totalPages = Math.ceil(filtered.length / perPage);

  const handleExport = () => {
    exportToExcel(filtered.map(l => ({
      "Data/Hora": l.datetime,
      Usuário: l.user,
      Categoria: categoryLabels[l.category],
      Ação: l.action,
      Detalhes: l.details,
      IP: l.ip,
    })), `logs-sistema-${new Date().toISOString().slice(0, 10)}`, { reportTitle: "JD Telecom", reportSubtitle: "Logs do Sistema" });
  };

  return (
    <div className="p-4 md:p-6 lg:p-8 pt-12 md:pt-6 space-y-6 max-w-[1400px] w-full overflow-hidden mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="font-display text-2xl md:text-3xl font-bold text-[hsl(var(--dark-section-fg))]">Logs do Sistema</h1>
          <p className="text-sm text-[hsl(var(--dark-section-muted))] mt-1">{filtered.length} registros</p>
        </div>
        <Button onClick={handleExport} className="w-full sm:w-auto bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold text-sm">
          <Download className="w-4 h-4 mr-2" /> Exportar Excel
        </Button>
      </div>

      <div className="flex flex-col gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[hsl(var(--dark-section-muted))]" />
          <Input placeholder="Buscar por usuário, ação ou detalhe..." value={search} onChange={e => { setSearch(e.target.value); setPage(0); }}
            className="bg-[hsl(var(--dark-section-card))] border-[hsl(var(--dark-section-border))] text-[hsl(var(--dark-section-fg))] pl-10 h-10 rounded-xl" />
        </div>
        <div className="grid grid-cols-2 sm:flex gap-2">
          {categories.map(c => (
            <button key={c} onClick={() => { setCatFilter(c); setPage(0); }}
              className={`w-full sm:w-auto px-3 py-2 rounded-xl text-xs font-semibold transition-all border ${catFilter === c ? "bg-primary text-primary-foreground border-primary" : "bg-[hsl(var(--dark-section-card))] text-[hsl(var(--dark-section-muted))] border-[hsl(var(--dark-section-border))]"}`}>
              {c === "Todos" ? c : categoryLabels[c as SystemLog["category"]]}
            </button>
          ))}
        </div>
      </div>

      <div className="bg-[hsl(var(--dark-section-card))] border border-[hsl(var(--dark-section-border))] rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-[hsl(var(--dark-section-border))]">
                <th className="text-left py-3 px-4 text-xs font-semibold text-[hsl(var(--dark-section-muted))] uppercase tracking-wider">Data/Hora</th>
                <th className="text-left py-3 px-4 text-xs font-semibold text-[hsl(var(--dark-section-muted))] uppercase tracking-wider">Usuário</th>
                <th className="text-left py-3 px-4 text-xs font-semibold text-[hsl(var(--dark-section-muted))] uppercase tracking-wider hidden md:table-cell">Categoria</th>
                <th className="text-left py-3 px-4 text-xs font-semibold text-[hsl(var(--dark-section-muted))] uppercase tracking-wider">Ação</th>
                <th className="text-left py-3 px-4 text-xs font-semibold text-[hsl(var(--dark-section-muted))] uppercase tracking-wider hidden lg:table-cell">Detalhes</th>
                <th className="text-right py-3 px-4 text-xs font-semibold text-[hsl(var(--dark-section-muted))] uppercase tracking-wider hidden xl:table-cell">IP</th>
              </tr>
            </thead>
            <tbody>
              {paginated.map(l => (
                <tr key={l.id} className="border-b border-[hsl(var(--dark-section-border))]/50 hover:bg-[hsl(var(--dark-section))]/30 transition-colors">
                  <td className="py-3 px-4 text-xs text-[hsl(var(--dark-section-muted))] whitespace-nowrap">{l.datetime}</td>
                  <td className="py-3 px-4 text-[hsl(var(--dark-section-fg))] font-medium text-xs">{l.user}</td>
                  <td className="py-3 px-4 hidden md:table-cell">
                    <span className={`inline-flex px-2 py-0.5 rounded-full border text-[10px] font-semibold ${categoryColors[l.category]}`}>
                      {categoryLabels[l.category]}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-[hsl(var(--dark-section-fg))] text-xs">{l.action}</td>
                  <td className="py-3 px-4 text-[hsl(var(--dark-section-muted))] text-xs hidden lg:table-cell max-w-[250px] truncate">{l.details}</td>
                  <td className="py-3 px-4 text-right text-[hsl(var(--dark-section-muted))] text-xs hidden xl:table-cell font-mono">{l.ip}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 px-4 py-3 border-t border-[hsl(var(--dark-section-border))]">
          <p className="text-xs text-[hsl(var(--dark-section-muted))]">Página {page + 1} de {totalPages}</p>
          <div className="flex gap-2 w-full sm:w-auto">
            <button disabled={page === 0} onClick={() => setPage(page - 1)} className="px-3 py-1.5 rounded-lg text-xs text-[hsl(var(--dark-section-muted))] hover:text-[hsl(var(--dark-section-fg))] disabled:opacity-30 flex-1 sm:flex-none">Anterior</button>
            <button disabled={page >= totalPages - 1} onClick={() => setPage(page + 1)} className="px-3 py-1.5 rounded-lg text-xs text-[hsl(var(--dark-section-muted))] hover:text-[hsl(var(--dark-section-fg))] disabled:opacity-30 flex-1 sm:flex-none">Próxima</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminLogs;
