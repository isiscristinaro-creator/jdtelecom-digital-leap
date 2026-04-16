import { useState, useMemo } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Download, FileSpreadsheet } from "lucide-react";
import { toast } from "sonner";
import { usePayments, usePlans } from "@/hooks/useSupabaseData";
import { exportToCSV, exportToExcel } from "@/utils/exportUtils";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const ExportFinanceiroModal = ({ open, onOpenChange }: Props) => {
  const { payments } = usePayments();
  const { plans } = usePlans();
  const [status, setStatus] = useState("todos");
  const [plano, setPlano] = useState("todos");
  const [dataInicial, setDataInicial] = useState("");
  const [dataFinal, setDataFinal] = useState("");
  const [formato, setFormato] = useState("excel");

  const filteredData = useMemo(() => {
    let filtered = [...payments];
    if (status !== "todos") filtered = filtered.filter(p => p.status === status);
    if (plano !== "todos") filtered = filtered.filter(p => p.client_plan === plano);
    if (dataInicial) {
      const start = new Date(dataInicial);
      filtered = filtered.filter(p => new Date(p.due_date) >= start);
    }
    if (dataFinal) {
      const end = new Date(dataFinal); end.setHours(23, 59, 59, 999);
      filtered = filtered.filter(p => new Date(p.due_date) <= end);
    }
    return filtered;
  }, [payments, status, plano, dataInicial, dataFinal]);

  const handleExport = async () => {
    const data = filteredData.map(p => ({
      Nome: p.client_name || "", Email: p.client_email || "", Plano: p.client_plan || "",
      Status: p.status, "Valor (R$)": p.amount, Data: p.due_date, Descrição: p.description,
    }));
    if (!data.length) { toast.error("Nenhum dado"); return; }
    const filename = `relatorio-financeiro-${new Date().toISOString().slice(0, 10)}`;
    // BUGFIX: aguarda exportToExcel (agora async) antes de fechar modal e mostrar toast,
    // garantindo que o arquivo termina de ser gerado antes do feedback ao usuário.
    if (formato === "excel") await exportToExcel(data, filename, { reportTitle: "JD Telecom", reportSubtitle: "Relatório Financeiro" });
    else exportToCSV(data, filename);
    toast.success(`${data.length} registros exportados`);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-[hsl(var(--dark-section-card))] border-[hsl(var(--dark-section-border))] text-[hsl(var(--dark-section-fg))] max-w-md">
        <DialogHeader>
          <DialogTitle className="text-lg font-bold flex items-center gap-2">
            <Download className="w-5 h-5 text-primary" /> Exportar Financeiro
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-4 mt-2">
          <div className="space-y-1.5">
            <Label className="text-xs text-[hsl(var(--dark-section-muted))]">Status</Label>
            <Select value={status} onValueChange={setStatus}>
              <SelectTrigger className="bg-[hsl(var(--dark-section))]/50 border-[hsl(var(--dark-section-border))] text-[hsl(var(--dark-section-fg))]"><SelectValue /></SelectTrigger>
              <SelectContent className="bg-[hsl(var(--dark-section-card))] border-[hsl(var(--dark-section-border))]">
                <SelectItem value="todos">Todos</SelectItem>
                <SelectItem value="Pago">Pago</SelectItem>
                <SelectItem value="Pendente">Pendente</SelectItem>
                <SelectItem value="Atrasado">Atrasado</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs text-[hsl(var(--dark-section-muted))]">Plano</Label>
            <Select value={plano} onValueChange={setPlano}>
              <SelectTrigger className="bg-[hsl(var(--dark-section))]/50 border-[hsl(var(--dark-section-border))] text-[hsl(var(--dark-section-fg))]"><SelectValue /></SelectTrigger>
              <SelectContent className="bg-[hsl(var(--dark-section-card))] border-[hsl(var(--dark-section-border))]">
                <SelectItem value="todos">Todos</SelectItem>
                {plans.map(p => <SelectItem key={p.id} value={p.name}>{p.name}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label className="text-xs text-[hsl(var(--dark-section-muted))]">Data Inicial</Label>
              <Input type="date" value={dataInicial} onChange={e => setDataInicial(e.target.value)}
                className="bg-[hsl(var(--dark-section))]/50 border-[hsl(var(--dark-section-border))] text-[hsl(var(--dark-section-fg))]" />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs text-[hsl(var(--dark-section-muted))]">Data Final</Label>
              <Input type="date" value={dataFinal} onChange={e => setDataFinal(e.target.value)}
                className="bg-[hsl(var(--dark-section))]/50 border-[hsl(var(--dark-section-border))] text-[hsl(var(--dark-section-fg))]" />
            </div>
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs text-[hsl(var(--dark-section-muted))]">Formato</Label>
            <Select value={formato} onValueChange={setFormato}>
              <SelectTrigger className="bg-[hsl(var(--dark-section))]/50 border-[hsl(var(--dark-section-border))] text-[hsl(var(--dark-section-fg))]"><SelectValue /></SelectTrigger>
              <SelectContent className="bg-[hsl(var(--dark-section-card))] border-[hsl(var(--dark-section-border))]">
                <SelectItem value="excel">Excel (.xls)</SelectItem>
                <SelectItem value="csv">CSV (.csv)</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="bg-[hsl(var(--dark-section))]/50 rounded-xl p-3 text-center">
            <p className="text-sm text-[hsl(var(--dark-section-muted))]">
              <span className="font-bold text-primary text-lg">{filteredData.length.toLocaleString()}</span> registros encontrados
            </p>
          </div>
          <Button onClick={handleExport} disabled={!filteredData.length} className="w-full bg-primary hover:bg-primary/90 text-primary-foreground rounded-xl disabled:opacity-60">
            <FileSpreadsheet className="w-4 h-4 mr-2" /> Exportar {filteredData.length.toLocaleString()} registros
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ExportFinanceiroModal;
